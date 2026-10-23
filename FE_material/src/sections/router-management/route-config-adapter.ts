import type { ManagedRoute, ManagedRouteSection, RouterRowItem, SubheaderSection } from './types';

const DEFAULT_ROUTE_ICON = 'solar:route-bold-duotone';

function slugify(value: string, index: number) {
  const slug = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return slug || `section-${index + 1}`;
}

function countRoutes(routes: ManagedRoute[]): number {
  return routes.reduce(
    (total, route) => total + 1 + (route.children ? countRoutes(route.children) : 0),
    0,
  );
}

function mapRoutes(
  routes: ManagedRoute[],
  sectionId: string,
  sectionTitle: string,
  level = 0,
  parentNumber = '',
  inheritedIcon = DEFAULT_ROUTE_ICON,
  parentId?: string,
): RouterRowItem[] {
  return routes.map((route, index) => {
    const stt = parentNumber ? `${parentNumber}.${index + 1}` : `${index + 1}`;
    const icon = route.icon ?? inheritedIcon;

    return {
      id: route.id,
      title: route.title,
      path: route.path,
      icon,
      inheritsIcon: !route.icon,
      level,
      sectionId,
      sectionTitle,
      parentId,
      stt,
      isIndex: route.index,
      hideInMenu: route.hideInMenu,
      info: route.info,
      children: route.children?.length
        ? mapRoutes(route.children, sectionId, sectionTitle, level + 1, stt, icon, route.id)
        : undefined,
    };
  });
}

export function buildRouterSections(config: ManagedRouteSection[]): SubheaderSection[] {
  return config.map((section, index) => {
    const id = slugify(section.subheader, index);

    return {
      id,
      title: section.subheader,
      routeCount: countRoutes(section.items),
      items: mapRoutes(section.items, id, section.subheader),
    };
  });
}
