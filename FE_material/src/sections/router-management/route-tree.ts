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

export function findRouteWithSection(
  config: ManagedRouteSection[],
  id: string
): { route: ManagedRoute; sectionTitle: string } | undefined {
  for (const section of config) {
    const route = findRoute([section], id);
    if (route) return { route, sectionTitle: section.subheader };
  }
  return undefined;
}

export function collectDescendantIds(route: ManagedRoute) {
  const ids = new Set<string>();
  const visit = (items?: ManagedRoute[]) => items?.forEach((item) => { ids.add(item.id); visit(item.children); });
  visit(route.children);
  return ids;
}

export function addSection(config: ManagedRouteSection[], subheader: string): ManagedRouteSection[] {
  const trimmed = subheader.trim();
  if (!trimmed || config.some((s) => s.subheader === trimmed)) return config;
  const next = cloneConfig(config);
  next.push({ subheader: trimmed, items: [] });
  return next;
}

export function renameSection(
  config: ManagedRouteSection[],
  oldSubheader: string,
  newSubheader: string
): ManagedRouteSection[] {
  const trimmed = newSubheader.trim();
  if (!trimmed || trimmed === oldSubheader) return config;
  if (config.some((s) => s.subheader.toLowerCase() === trimmed.toLowerCase() && s.subheader !== oldSubheader)) {
    return config;
  }
  const next = cloneConfig(config);
  const target = next.find((s) => s.subheader === oldSubheader);
  if (!target) return config;
  target.subheader = trimmed;
  return next;
}

function targetItems(config: ManagedRouteSection[], destination: RouteDestination) {
  let section = config.find((item) => item.subheader === destination.section);
  if (!section) {
    section = { subheader: destination.section, items: [] };
    config.push(section);
  }
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

export function moveSection(config: ManagedRouteSection[], subheader: string, offset: -1 | 1): ManagedRouteSection[] {
  const index = config.findIndex((s) => s.subheader === subheader);
  if (index < 0) return config;
  const target = index + offset;
  if (target < 0 || target >= config.length) return config;
  const next = cloneConfig(config);
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function moveRouteSibling(config: ManagedRouteSection[], id: string, offset: -1 | 1): ManagedRouteSection[] {
  const next = cloneConfig(config);

  // 1. Kiểm tra nếu id là route cấp gốc của bất kỳ section nào
  for (let sIdx = 0; sIdx < next.length; sIdx++) {
    const section = next[sIdx];
    const index = section.items.findIndex((item) => item.id === id);
    if (index >= 0) {
      const target = index + offset;
      if (target >= 0 && target < section.items.length) {
        // Đổi chỗ trong cùng section
        [section.items[index], section.items[target]] = [section.items[target], section.items[index]];
        return next;
      }
      // Nếu ở đầu section và di chuyển lên -> chuyển sang cuối section phía trên
      if (target < 0 && sIdx > 0) {
        const [removed] = section.items.splice(index, 1);
        next[sIdx - 1].items.push(removed);
        return next;
      }
      // Nếu ở cuối section và di chuyển xuống -> chuyển sang đầu section phía dưới
      if (target >= section.items.length && sIdx < next.length - 1) {
        const [removed] = section.items.splice(index, 1);
        next[sIdx + 1].items.unshift(removed);
        return next;
      }
      return config; // Đã ở đỉnh/đáy tuyệt đối
    }
  }

  // 2. Nếu là route con, hoán đổi trong danh sách anh-em của cha
  const visitNested = (items: ManagedRoute[]): boolean => {
    for (const item of items) {
      if (item.children) {
        const cIdx = item.children.findIndex((c) => c.id === id);
        if (cIdx >= 0) {
          const target = cIdx + offset;
          if (target >= 0 && target < item.children.length) {
            [item.children[cIdx], item.children[target]] = [item.children[target], item.children[cIdx]];
            return true;
          }
          return false;
        }
        if (visitNested(item.children)) return true;
      }
    }
    return false;
  };

  for (const section of next) {
    if (visitNested(section.items)) return next;
  }

  return config;
}
