const fs = require('fs');
const path = require('path');

describe('Security Revalidation (Phase 3)', () => {
  const rootDir = path.resolve(__dirname, '../../');

  test('SEC-001: Firestore rules prevent public read access to /orders', () => {
    const rulesPath = path.join(rootDir, 'firestore.rules');
    expect(fs.existsSync(rulesPath)).toBe(true);
    const rules = fs.readFileSync(rulesPath, 'utf8');

    // Must NOT contain public read
    expect(rules).not.toMatch(/match\s*\/orders\/\{orderId\}\s*\{\s*allow\s*read:\s*if\s*true;/);

    // Must restrict read to isAdmin() or customerUid owner
    expect(rules).toMatch(/match\s*\/orders\/\{orderId\}/);
    expect(rules).toContain('isAdmin()');
    expect(rules).toMatch(/resource\.data\.customerUid\s*==\s*request\.auth\.uid|request\.auth\.uid\s*==\s*resource\.data\.customerUid/);
  });

  test('SEC-002: Firestore rules prevent unauthenticated/arbitrary admin privilege escalation', () => {
    const rulesPath = path.join(rootDir, 'firestore.rules');
    const rules = fs.readFileSync(rulesPath, 'utf8');

    // Must NOT allow arbitrary authenticated writes to /admins
    expect(rules).not.toMatch(/match\s*\/admins\/\{adminId\}\s*\{\s*allow\s*write:\s*if\s*request\.auth\s*!=\s*null;/);

    // Create & delete must be restricted to existing active admin
    expect(rules).toMatch(/allow\s*create,\s*delete:\s*if\s*isAdmin\(\);/);
  });

  test('SEC-003: Vercel configuration enforces HTTP Security Headers', () => {
    const vercelConfigPath = path.join(rootDir, 'vercel.json');
    expect(fs.existsSync(vercelConfigPath)).toBe(true);
    const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));

    const allHeaders = [];
    if (config.headers) {
      config.headers.forEach(entry => {
        if (entry.headers) {
          entry.headers.forEach(h => allHeaders.push(h.key.toLowerCase()));
        }
      });
    }

    expect(allHeaders).toContain('content-security-policy');
    expect(allHeaders).toContain('x-frame-options');
    expect(allHeaders).toContain('x-content-type-options');
    expect(allHeaders).toContain('referrer-policy');
    expect(allHeaders).toContain('permissions-policy');

    // Verify DENY on X-Frame-Options
    const xFrame = config.headers[0].headers.find(h => h.key.toLowerCase() === 'x-frame-options');
    expect(xFrame.value).toBe('DENY');

    // Verify nosniff
    const xContent = config.headers[0].headers.find(h => h.key.toLowerCase() === 'x-content-type-options');
    expect(xContent.value).toBe('nosniff');
  });

  test('SEC-004: Cloud Storage Security Rules exist and enforce server-side validation', () => {
    const storageRulesPath = path.join(rootDir, 'storage.rules');
    const firebaseConfigPath = path.join(rootDir, 'firebase.json');

    expect(fs.existsSync(storageRulesPath)).toBe(true);
    expect(fs.existsSync(firebaseConfigPath)).toBe(true);

    const storageRules = fs.readFileSync(storageRulesPath, 'utf8');
    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));

    // Check firebase.json references storage.rules
    expect(firebaseConfig.storage).toBeDefined();
    expect(firebaseConfig.storage.rules).toBe('storage.rules');

    // Check rules require authentication, MIME check and size limit
    expect(storageRules).toContain('request.auth != null');
    expect(storageRules).toContain('image/');
    expect(storageRules).toMatch(/request\.resource\.size\s*<\s*5\s*\*\s*1024\s*\*\s*1024/);
  });

  test('SEC-005: Source tree contains no exposed private credentials or service accounts', () => {
    const sourceFiles = [
      path.join(rootDir, 'src', 'firebase.js'),
      path.join(rootDir, 'src', 'services', 'emailService.js'),
      path.join(rootDir, 'vercel.json'),
      path.join(rootDir, 'firebase.json')
    ];

    sourceFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        expect(content).not.toMatch(/-----BEGIN PRIVATE KEY-----/);
        expect(content).not.toMatch(/-----BEGIN RSA PRIVATE KEY-----/);
      }
    });
  });
});
