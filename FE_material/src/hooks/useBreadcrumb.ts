import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { staticRoutesConfig } from '@/router/routes-config';
import { selectRoutesConfig, useRouterStore } from '@/store';
import { resolveBreadcrumb } from './breadcrumb-utils';

export function useBreadcrumb() {
  const { pathname } = useLocation();
  const routesConfig = useRouterStore(selectRoutesConfig);

  return useMemo(
    () => resolveBreadcrumb(pathname, routesConfig.length ? routesConfig : staticRoutesConfig),
    [pathname, routesConfig],
  );
}
