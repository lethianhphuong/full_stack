import type { RouteObject } from 'react-router';
import { AUTH_ROUTE_ID } from '../constants';
import { lazyWithProgress } from '../utils';

// ----------------------------------------------------------------------

export const authRoutes: RouteObject[] = [
  {
    path: 'auth',
    id: AUTH_ROUTE_ID,
    lazy: lazyWithProgress(() => import('@/layouts/auth/AuthLayout')),
    children: [
      {
        path: 'login',
        lazy: lazyWithProgress(() => import('@/pages/auth/LoginPage')),
      },
      {
        path: 'register',
        lazy: lazyWithProgress(() => import('@/pages/auth/RegisterPage')),
      },
    ],
  },
];
