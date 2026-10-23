import { create } from 'zustand';
import { MOCK_MANAGED_ROUTES } from './mock-routes';
import { cloneConfig, deleteRoute, insertRoute, moveRoute, moveRouteSibling, updateRoute } from './route-tree';
import type { ManagedRoute, ManagedRouteSection, RouteDestination } from './types';

type State = { routes: ManagedRouteSection[] };
type Actions = {
  addRoute: (route: ManagedRoute, destination: RouteDestination) => void;
  updateRoute: (id: string, updates: Partial<ManagedRoute>) => void;
  moveRoute: (id: string, destination: RouteDestination) => void;
  moveRouteSibling: (id: string, offset: -1 | 1) => void;
  deleteRoute: (id: string) => void;
  resetMock: () => void;
};

export const useManagedRouterStore = create<State & Actions>((set) => ({
  routes: cloneConfig(MOCK_MANAGED_ROUTES),
  addRoute: (route, destination) => set((state) => ({ routes: insertRoute(state.routes, route, destination) })),
  updateRoute: (id, updates) => set((state) => ({ routes: updateRoute(state.routes, id, updates) })),
  moveRoute: (id, destination) => set((state) => ({ routes: moveRoute(state.routes, id, destination) })),
  moveRouteSibling: (id, offset) => set((state) => ({ routes: moveRouteSibling(state.routes, id, offset) })),
  deleteRoute: (id) => set((state) => ({ routes: deleteRoute(state.routes, id) })),
  resetMock: () => set({ routes: cloneConfig(MOCK_MANAGED_ROUTES) }),
}));
