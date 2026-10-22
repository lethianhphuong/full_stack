import type { RouteConfig, RouteSectionConfig } from './routes-config';

// ----------------------------------------------------------------------
// Nav Types (exported để các component có thể import)
// ----------------------------------------------------------------------

export type NavItemConfig = {
  title: string;
  path: string;
  icon?: string;
  info?: string | number;
  children?: NavItemConfig[];
};

export type NavSectionConfig = {
  subheader: string;
  items: NavItemConfig[];
};

// ----------------------------------------------------------------------

/**
 * Convert single RouteConfig to NavItemConfig (recursive)
 * Returns null if hidden from menu
 */
function configToNavItem(config: RouteConfig, basePath: string = ''): NavItemConfig | null {
  // Skip items hidden from menu
  if (config.hideInMenu) return null;

  const navItem: NavItemConfig = {
    title: config.title,
    path: `${basePath}/${config.path}`,
    icon: config.icon,
    info: config.info,
  };

  // Process children recursively
  if (config.children) {
    const children = config.children
      .map(child => configToNavItem(child, basePath)) // Keep same basePath for nested
      .filter((item): item is NavItemConfig => item !== null);
    
    if (children.length > 0) {
      navItem.children = children;
    }
  }

  return navItem;
}

// ----------------------------------------------------------------------

/**
 * Generate NavSectionConfig[] from RouteSectionConfig[]
 * 
 * Converts route config (with lazy components) to nav config (paths only)
 * for use in navigation menus.
 */
export function generateNavConfig(
  sections: RouteSectionConfig[], 
  basePath: string = ''
): NavSectionConfig[] {
  return sections.map(section => ({
    subheader: section.subheader,
    items: section.items
      .map(item => configToNavItem(item, basePath))
      .filter((item): item is NavItemConfig => item !== null),
  }));
}

// ----------------------------------------------------------------------

/**
 * Flatten nav items (for horizontal menu)
 */
export function flattenNavItems(sections: NavSectionConfig[]): NavItemConfig[] {
  return sections.flatMap(section => section.items);
}

// ----------------------------------------------------------------------

/**
 * Find nav item by path (recursive)
 */
export function findNavItemByPath(
  sections: NavSectionConfig[], 
  path: string
): NavItemConfig | null {
  function searchInItems(items: NavItemConfig[]): NavItemConfig | null {
    for (const item of items) {
      if (item.path === path) return item;
      
      if (item.children) {
        const found = searchInItems(item.children);
        if (found) return found;
      }
    }
    return null;
  }

  for (const section of sections) {
    const found = searchInItems(section.items);
    if (found) return found;
  }
  return null;
}
