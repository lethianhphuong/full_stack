import type { ManagedRoute, ManagedRouteSection, RouteDestination } from './types';

export function cloneConfig(config: ManagedRouteSection[]): ManagedRouteSection[] {
  const cloneItems = (items: ManagedRoute[]): ManagedRoute[] => items.map((item) => ({ ...item, children: item.children ? cloneItems(item.children) : undefined }));
  return config.map((section) => ({ ...section, items: cloneItems(section.items) }));
}

export function findRoute(config: ManagedRouteSection[], id: string): ManagedRoute | undefined {
  const visit = (items: ManagedRoute[]): ManagedRoute | undefined => {
    for (const item of items) {
      if (item.id === id) return item;
      const nested = item.children ? visit(item.children) : undefined;
      if (nested) return nested;
    }
    return undefined;
  };
  for (const section of config) {
    const route = visit(section.items);
    if (route) return route;
  }
  return undefined;
}

export function collectDescendantIds(route: ManagedRoute) {
  const ids = new Set<string>();
  const visit = (items?: ManagedRoute[]) => items?.forEach((item) => { ids.add(item.id); visit(item.children); });
  visit(route.children);
  return ids;
}

function targetItems(config: ManagedRouteSection[], destination: RouteDestination) {
  const section = config.find((item) => item.subheader === destination.section);
  if (!section) return undefined;
  if (!destination.parentId) return section.items;
  const parent = findRoute(config, destination.parentId);
  if (!parent) return undefined;
  parent.children ??= [];
  return parent.children;
}

function remove(items: ManagedRoute[], id: string): ManagedRoute | undefined {
  const index = items.findIndex((item) => item.id === id);
  if (index >= 0) return items.splice(index, 1)[0];
  for (const item of items) {
    const found = item.children ? remove(item.children, id) : undefined;
    if (found) return found;
  }
  return undefined;
}

export function insertRoute(config: ManagedRouteSection[], route: ManagedRoute, destination: RouteDestination) {
  const next = cloneConfig(config);
  const items = targetItems(next, destination);
  if (!items) return config;
  items.splice(Math.min(destination.index ?? items.length, items.length), 0, route);
  return next;
}

export function updateRoute(config: ManagedRouteSection[], id: string, updates: Partial<ManagedRoute>) {
  const next = cloneConfig(config);
  const route = findRoute(next, id);
  if (!route) return config;
  const previousPath = route.path.replace(/\/+$/, '');
  Object.assign(route, updates, { id });
  const nextPath = route.path.replace(/\/+$/, '');
  if (previousPath !== nextPath) {
    const updateChildren = (items?: ManagedRoute[]) => items?.forEach((child) => {
      if (child.path === previousPath || child.path.startsWith(`${previousPath}/`)) {
        child.path = `${nextPath}${child.path.slice(previousPath.length)}`;
      }
      updateChildren(child.children);
    });
    updateChildren(route.children);
  }
  return next;
}

export function moveRoute(config: ManagedRouteSection[], id: string, destination: RouteDestination) {
  const next = cloneConfig(config);
  let route: ManagedRoute | undefined;
  for (const section of next) {
    route = remove(section.items, id);
    if (route) break;
  }
  const items = route ? targetItems(next, destination) : undefined;
  if (!route || !items) return config;
  items.splice(Math.min(destination.index ?? items.length, items.length), 0, route);
  return next;
}

export function deleteRoute(config: ManagedRouteSection[], id: string) {
  const next = cloneConfig(config);
  return next.some((section) => Boolean(remove(section.items, id))) ? next : config;
}

export function moveRouteSibling(config: ManagedRouteSection[], id: string, offset: -1 | 1) {
  const next = cloneConfig(config);
  const visit = (items: ManagedRoute[]): boolean => {
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      const target = index + offset;
      if (target < 0 || target >= items.length) return false;
      [items[index], items[target]] = [items[target], items[index]];
      return true;
    }
    return items.some((item) => item.children ? visit(item.children) : false);
  };
  return next.some((section) => visit(section.items)) ? next : config;
}
