import { describe, it, expect } from 'vitest';
import { navItems, validateNavItems } from '../navigation';

describe('Navigation Config', () => {
  it('should have valid structure', () => {
    expect(() => validateNavItems(navItems)).not.toThrow();
  });

  it('should have required properties for each item', () => {
    navItems.forEach(item => {
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('page');
      expect(item.label).toBeTruthy();
      expect(item.page).toBeTruthy();
    });
  });

  it('should have valid children structure', () => {
    navItems.forEach(item => {
      if (item.children) {
        item.children.forEach(child => {
          expect(child).toHaveProperty('label');
          expect(child).toHaveProperty('page');
        });
      }
    });
  });
});
