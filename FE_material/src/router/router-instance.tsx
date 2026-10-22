import { createBrowserRouter } from 'react-router';
import { ROOT_ROUTE_ID } from './constants';
import { lazyWithProgress } from './utils';
import { staticRoutesConfig } from './routes-config';
import { generateRoutes } from './generate-routes';
import { authRoutes, errorRoutes } from './routes';

// ----------------------------------------------------------------------

/**
 * Static router instance (for backward compatibility)
 * 
 * NOTE: This is only used for initial render or if you need direct router access.
 * The main Router component uses dynamic routing from store.
 */
// Basename cho app (deploy ở subdirectory)
const BASENAME = import.meta.env.VITE_APP_BASENAME || '';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      id: ROOT_ROUTE_ID,
      lazy: lazyWithProgress(() => import('@/layout/root-layout')),
      children: [
        // Dashboard layout wraps all app routes
        {
          lazy: lazyWithProgress(() => import('@/layouts/dashboard')),
          children: generateRoutes(staticRoutesConfig),
        },
        // Standalone OnlyOffice Fullscreen tab view (không có sidebar hay dashboard layout)
        {
          path: 'documents/:id/view',
          lazy: lazyWithProgress(() => import('@/pages/onlyoffice/OnlyOfficeFullscreenPage')),
        },
        // Auth routes
        ...authRoutes,
        // Error routes
        ...errorRoutes,
      ],
    },
  ],
  { basename: BASENAME }
);
