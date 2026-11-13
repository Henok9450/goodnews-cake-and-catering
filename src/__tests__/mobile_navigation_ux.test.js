const fs = require('fs');
const path = require('path');

describe('Mobile Navigation Discoverability & UX Improvements', () => {
  const rootDir = path.resolve(__dirname, '../../');
  const headerFile = fs.readFileSync(path.join(rootDir, 'src', 'components', 'layout', 'Header.jsx'), 'utf8');

  test('NAV-001: Mobile toggle button displays visible MENU and CLOSE label', () => {
    expect(headerFile).toContain("id=\"mobile-menu-toggle-btn\"");
    expect(headerFile).toContain("{isMenuOpen ? 'Close' : 'Menu'}");
  });

  test('NAV-002: Mobile toggle enforces minimum 44x44px touch target (WCAG 2.2 AA)', () => {
    expect(headerFile).toContain("min-h-[44px]");
    expect(headerFile).toContain("min-w-[44px]");
  });

  test('NAV-003: Accessible ARIA attributes present on mobile menu button', () => {
    expect(headerFile).toContain("aria-label={isMenuOpen ? \"Close navigation menu\" : \"Open navigation menu\"}");
    expect(headerFile).toContain("aria-expanded={isMenuOpen}");
    expect(headerFile).toContain("aria-controls=\"mobile-navigation-drawer\"");
  });

  test('NAV-004: First-visit attention tooltip and gentle pulse implemented', () => {
    expect(headerFile).toContain("localStorage.getItem('goodnews_menu_discovered')");
    expect(headerFile).toContain("localStorage.setItem('goodnews_menu_discovered', 'true')");
    expect(headerFile).toContain("Explore our Cakes &amp; Catering");
    expect(headerFile).toContain("role=\"tooltip\"");
    expect(headerFile).toContain("ring-2 ring-primary-500 ring-offset-2 animate-pulse");
  });

  test('NAV-005: Clean mobile header avoids screen clutter and keeps full catalog organized in MENU drawer', () => {
    expect(headerFile).not.toContain("quickCategories");
    expect(headerFile).toContain("id=\"mobile-menu-toggle-btn\"");
  });

  test('NAV-006: Redesigned drawer organizes offerings into clear categorized sections', () => {
    expect(headerFile).toContain("Artisanal Cakes &amp; Treats");
    expect(headerFile).toContain("Specialty &amp; Event Services");
    expect(headerFile).toContain("Customer Care &amp; Tracking");
    expect(headerFile).toContain("All Celebration Cakes");
    expect(headerFile).toContain("Custom Cake Builder");
    expect(headerFile).toContain("Catering &amp; Event Services");
    expect(headerFile).toContain("Track Order Status");
  });

  test('NAV-007: Operating hours and quick call shortcuts accessible in mobile header and drawer', () => {
    expect(headerFile).toContain("tel:+251917559943");
    expect(headerFile).toContain("getBakeryStatus");
    expect(headerFile).toContain("Bakery is Open");
  });
});
