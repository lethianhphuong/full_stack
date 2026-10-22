import type { RouteObject } from 'react-router';
import type { RouteConfig, RouteSectionConfig } from './routes-config';
import { lazyWithProgress } from './utils';

// ----------------------------------------------------------------------

/**
 * Convert single RouteConfig to RouteObject
 * Returns null if config has no element (nav-only item)
 */
function configToRoute(config: RouteConfig): RouteObject | null {
  // Skip items without element (nav-only items like parent menus)
  if (!config.element) return null;

  const route: RouteObject = {
    path: config.path,
    id: config.id,
    lazy: lazyWithProgress(config.element),
  };

  return route;
}

/**
 * Recursively extract all routes from a RouteConfig (including nested children)
 */
function extractRoutesRecursive(config: RouteConfig): RouteObject[] {
  const routes: RouteObject[] = [];

  // Add current route if it has element
  const currentRoute = configToRoute(config);
  if (currentRoute) {
    routes.push(currentRoute);
  }

  // Recursively add children routes
  if (config.children) {
    for (const child of config.children) {
      routes.push(...extractRoutesRecursive(child));
    }
  }

  return routes;
}

/**
 * Generate index route if exists in config
 */
function findIndexRoute(sections: RouteSectionConfig[]): RouteObject | null {
  for (const section of sections) {
    for (const item of section.items) {
      if (item.index && item.element) {
        return {
          index: true,
          id: `${item.id}-index`,
          lazy: lazyWithProgress(item.element),
        };
      }
    }
  }
  return null;
}

// ----------------------------------------------------------------------

/**
 * Generate RouteObject[] from RouteSectionConfig[]
 * 
 * Cấu trúc routes được flatten (không nested):
 * - Index route: /dashboard
 * - All routes flattened regardless of nesting level
 */
export function generateRoutes(sections: RouteSectionConfig[]): RouteObject[] {
  const routes: RouteObject[] = [];

  // Add index route first (if exists)
  const indexRoute = findIndexRoute(sections);
  if (indexRoute) {
    routes.push(indexRoute);
  }

  // Process all sections - recursively extract all routes
  for (const section of sections) {
    for (const item of section.items) {
      routes.push(...extractRoutesRecursive(item));
    }
  }

  return routes;
}

// ----------------------------------------------------------------------

/**
 * Get all route paths for debugging/logging (recursive)
 */
export function getAllRoutePaths(sections: RouteSectionConfig[]): string[] {
  const paths: string[] = [];

  function extractPaths(config: RouteConfig) {
    if (config.element) {
      paths.push(config.path);
    }
    if (config.children) {
      for (const child of config.children) {
        extractPaths(child);
      }
    }
  }

  for (const section of sections) {
    for (const item of section.items) {
      extractPaths(item);
    }
  }

  return paths;
}
