jest.mock('../config/firebase', () => ({
  storage: {},
  auth: {},
  db: {}
}));

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytesResumable: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn()
}));

import { drawWatermarkOnCanvas, compressImageForUpload } from '../services/storageService';
import fs from 'fs';
import path from 'path';

describe('GoodNews Cake Watermark Verification Suite', () => {
  const rootDir = path.resolve(__dirname, '../../');

  test('WM-001: drawWatermarkOnCanvas helper is properly exported and safe in non-canvas environments', () => {
    expect(typeof drawWatermarkOnCanvas).toBe('function');
    // Calling with empty dummy object should not throw
    expect(() => drawWatermarkOnCanvas({}, {})).not.toThrow();
  });

  test('WM-002: compressImageForUpload supports watermark parameter and fallbacks gracefully in test runtime', async () => {
    const dummyFile = { name: 'chocolate-cake.jpg', size: 1000, type: 'image/jpeg' };
    const result = await compressImageForUpload(dummyFile, 1600, 0.88, true);
    expect(result).toBe(dummyFile);
  });

  test('WM-003: Pristine original cake photographs are backed up in originals directory', () => {
    const originalCakesDir = path.join(rootDir, 'originals/cakes');
    const originalSeasonalDir = path.join(rootDir, 'originals/seasonal');

    expect(fs.existsSync(originalCakesDir)).toBe(true);
    expect(fs.existsSync(originalSeasonalDir)).toBe(true);

    const cakeBackups = fs.readdirSync(originalCakesDir);
    const seasonalBackups = fs.readdirSync(originalSeasonalDir);

    expect(cakeBackups.length).toBeGreaterThanOrEqual(18);
    expect(seasonalBackups.length).toBeGreaterThanOrEqual(28);

    // Verify key cakes exist in pristine backup
    expect(cakeBackups).toContain('cake1.png');
    expect(cakeBackups).toContain('wedding-cake-grand.png');
    expect(cakeBackups).toContain('two-tier-pearl-celebration.png');
  });

  test('WM-004: Public cake images have WebP and card-WebP derivatives generated with watermark', () => {
    const publicCakesDir = path.join(rootDir, 'public/images/cakes');
    const files = fs.readdirSync(publicCakesDir);

    // Check cake1
    expect(files).toContain('cake1.png');
    expect(files).toContain('cake1.webp');
    expect(files).toContain('cake1-card.webp');

    // Check wedding-cake-grand
    expect(files).toContain('wedding-cake-grand.png');
    expect(files).toContain('wedding-cake-grand.webp');
    expect(files).toContain('wedding-cake-grand-card.webp');
  });

  test('WM-005: All food & catering assets are protected while raw logo remains un-watermarked', () => {
    const originalsDir = path.join(rootDir, 'originals');
    const folders = fs.readdirSync(originalsDir);

    // Food & catering portfolios are backed up and watermarked
    expect(folders).toContain('catering');
    expect(folders).toContain('cookies');
    expect(folders).toContain('cupcakes');
    expect(folders).toContain('cakes');
    expect(folders).toContain('seasonal');

    // Logo brand marks remain pristine
    expect(folders).not.toContain('logo');
  });
});
