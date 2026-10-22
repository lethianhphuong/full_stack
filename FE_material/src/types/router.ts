// Router types
import type { RouteObject } from 'react-router';

export type AppRouteObject = RouteObject & {
  // Add custom properties if needed
  meta?: {
    title?: string;
    icon?: string;
    hideInMenu?: boolean;
  };
};
