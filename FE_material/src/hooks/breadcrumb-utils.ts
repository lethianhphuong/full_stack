import type { RouteConfig, RouteSectionConfig } from '@/router/routes-config';
import type { BreadcrumbItem } from '@/components/app-page-container/types';

function segments(path: string): string[] {
  return path.split('/').filter(Boolean);
}

function matchPath(pattern: string, pathname: string): boolean {
  const routeSegments = segments(pattern);
  const urlSegments = segments(pathname);

  return routeSegments.length === urlSegments.length && routeSegments.every(
    (segment, index) => segment.startsWith(':') || segment === urlSegments[index],
  );
}

function findRouteChain(pathname: string, sections: RouteSectionConfig[]): RouteConfig[] {
  let bestChain: RouteConfig[] = [];
  let bestScore = -1;

  function visit(route: RouteConfig, ancestors: RouteConfig[]) {
    const chain = [...ancestors, route];
    if (matchPath(route.path, pathname) && route.element) {
      const routeSegments = segments(route.path);
      const staticCount = routeSegments.filter((segment) => !segment.startsWith(':')).length;
      const score = staticCount * 100 + chain.length;
      if (score > bestScore) {
        bestScore = score;
        bestChain = chain;
      }
    }
    route.children?.forEach((child) => visit(child, chain));
  }

  sections.forEach((section) => section.items.forEach((item) => visit(item, [])));
  return bestChain;
}

export function resolveBreadcrumb(pathname: string, sections: RouteSectionConfig[]) {
  const chain = pathname === '/'
    ? sections.flatMap((section) => section.items).filter((item) => item.index).slice(0, 1)
    : findRouteChain(pathname, sections);
  const home: BreadcrumbItem = { title: 'Trang chủ', path: '/' };

  if (chain.length === 0 || chain.at(-1)?.index) {
    return { breadcrumbItems: [home], currentRouteTitle: chain.at(-1)?.title };
  }

  const urlSegments = segments(pathname);
  const breadcrumbItems: BreadcrumbItem[] = [home, ...chain.map((route, index) => {
    const patternSegments = segments(route.path);
    const path = `/${urlSegments.slice(0, patternSegments.length).join('/')}`;
    return {
      title: route.title,
      path: index === chain.length - 1 || !route.element ? undefined : path,
    };
  })];

  return { breadcrumbItems, currentRouteTitle: chain.at(-1)?.title };
}
