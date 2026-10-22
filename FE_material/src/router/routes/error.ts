import type { RouteObject } from 'react-router';
import { redirect } from 'react-router';
import { lazyWithProgress } from '../utils';

// ----------------------------------------------------------------------

export const errorRoutes: RouteObject[] = [
  {
    path: '404',
    lazy: lazyWithProgress(() => import('@/pages/error/Page404')),
  },
  {
    path: '*',
    loader: () => redirect('/404'),
  },
];
