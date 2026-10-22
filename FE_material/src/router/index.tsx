import { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { useRouterStore, selectRoutesConfig, selectRouterVersion } from '@/store';
import { generateRoutes } from './generate-routes';
import { ROOT_ROUTE_ID } from './constants';
import { lazyWithProgress } from './utils';
import { authRoutes, errorRoutes } from './routes';

// ----------------------------------------------------------------------

/**
 * Create router instance from routes config
 */
// Basename cho app (deploy ở subdirectory)
const BASENAME = import.meta.env.VITE_APP_BASENAME || '';

function createAppRouter(appRoutes: ReturnType<typeof generateRoutes>) {
  return createBrowserRouter(
    [
      {
        path: '/',
        id: ROOT_ROUTE_ID,
        lazy: lazyWithProgress(() => import('@/layout/root-layout')),
        children: [
          // Dashboard layout wraps all app routes
          {
            lazy: lazyWithProgress(() => import('@/layouts/dashboard')),
            children: appRoutes,
          },
          // Standalone OnlyOffice Fullscreen tab view (không có sidebar hay dashboard layout)
          {
            path: 'documents/:id/view',
            lazy: lazyWithProgress(() => import('@/pages/onlyoffice/OnlyOfficeFullscreenPage')),
          },
          // Auth routes (static)
          ...authRoutes,
          // Error routes (static)
          ...errorRoutes,
        ],
      },
    ],
    { basename: BASENAME }
  );
}

// ----------------------------------------------------------------------

/**
 * Router Component
 * 
 * - Lấy routes config từ Zustand store
 * - Re-create router khi config thay đổi (version tăng)
 * - Sử dụng key={version} để force re-mount RouterProvider
 * 
 * Future: Có thể gọi loadRoutesFromApi() trong useEffect để load dynamic routes
 */
export default function Router() {
  const routesConfig = useRouterStore(selectRoutesConfig);
  const version = useRouterStore(selectRouterVersion);

  // Generate routes từ config và tạo router instance
  // Re-create khi routesConfig thay đổi
  const router = useMemo(() => {
    const dashboardChildren = generateRoutes(routesConfig);
    return createAppRouter(dashboardChildren);
  }, [routesConfig]);

  // key={version} forces RouterProvider to re-mount when routes change
  return <RouterProvider router={router} key={version} />;
}

// ----------------------------------------------------------------------

// Export for backward compatibility (nếu có code khác dùng)
export { router } from './router-instance';
