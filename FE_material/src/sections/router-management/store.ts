import { create } from 'zustand';
import { MOCK_MANAGED_ROUTES } from './mock-routes';
import { addSection, cloneConfig, deleteRoute, insertRoute, moveRoute, moveRouteSibling, moveSection, renameSection, updateRoute } from './route-tree';
import type { ManagedRoute, ManagedRouteSection, RouteDestination } from './types';

type State = { routes: ManagedRouteSection[] };
type Actions = {
  addSection: (subheader: string) => void;
  renameSection: (oldSubheader: string, newSubheader: string) => boolean;
  moveSection: (subheader: string, offset: -1 | 1) => boolean;
  addRoute: (route: ManagedRoute, destination: RouteDestination) => void;
  updateRoute: (id: string, updates: Partial<ManagedRoute>) => void;
  moveRoute: (id: string, destination: RouteDestination) => void;
  moveRouteSibling: (id: string, offset: -1 | 1) => boolean;
  deleteRoute: (id: string) => void;
  resetMock: () => void;
};

export const useManagedRouterStore = create<State & Actions>((set) => ({
  routes: cloneConfig(MOCK_MANAGED_ROUTES),
  addSection: (subheader) => set((state) => ({ routes: addSection(state.routes, subheader) })),
  renameSection: (oldSubheader, newSubheader) => {
    let changed = false;
    set((state) => {
      const next = renameSection(state.routes, oldSubheader, newSubheader);
      if (next !== state.routes) {
        changed = true;
        return { routes: next };
      }
      return state;
    });
    return changed;
  },
  moveSection: (subheader, offset) => {
    let changed = false;
    set((state) => {
      const next = moveSection(state.routes, subheader, offset);
      if (next !== state.routes) {
        changed = true;
        return { routes: next };
      }
      return state;
    });
    return changed;
  },
  addRoute: (route, destination) => set((state) => ({ routes: insertRoute(state.routes, route, destination) })),
  updateRoute: (id, updates) => set((state) => ({ routes: updateRoute(state.routes, id, updates) })),
  moveRoute: (id, destination) => set((state) => ({ routes: moveRoute(state.routes, id, destination) })),
  moveRouteSibling: (id, offset) => {
    let changed = false;
    set((state) => {
      const next = moveRouteSibling(state.routes, id, offset);
      if (next !== state.routes) {
        changed = true;
        return { routes: next };
      }
      return state;
    });
    return changed;
  },
  deleteRoute: (id) => set((state) => ({ routes: deleteRoute(state.routes, id) })),
  resetMock: () => set({ routes: cloneConfig(MOCK_MANAGED_ROUTES) }),
}));
