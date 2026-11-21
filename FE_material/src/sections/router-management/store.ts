import { create } from 'zustand';
import { fetchManagedRoutes } from './menu-api';
import { addSection, deleteRoute, deleteSection, insertRoute, moveRoute, moveRouteSibling, moveSection, renameSection, updateRoute } from './route-tree';
import type { ManagedRoute, ManagedRouteSection, RouteDestination } from './types';

type State = { routes: ManagedRouteSection[]; loading: boolean; error?: string };
type Actions = {
  loadFromApi: () => Promise<boolean>;
  addSection: (subheader: string) => void;
  renameSection: (oldSubheader: string, newSubheader: string) => boolean;
  moveSection: (subheader: string, offset: -1 | 1) => boolean;
  deleteSection: (subheader: string) => void;
  addRoute: (route: ManagedRoute, destination: RouteDestination) => void;
  updateRoute: (id: string, updates: Partial<ManagedRoute>) => void;
  moveRoute: (id: string, destination: RouteDestination) => void;
  moveRouteSibling: (id: string, offset: -1 | 1) => boolean;
  deleteRoute: (id: string) => void;
  reload: () => Promise<boolean>;
};

export const useManagedRouterStore = create<State & Actions>((set, get) => ({
  routes: [],
  loading: false,
  error: undefined,
  // Gọi GET /api/v1/menu, map sang cấu trúc ManagedRouteSection rồi đổ vào store.
  // Lỗi API -> giữ nguyên dữ liệu đang có, lưu message vào error.
  loadFromApi: async () => {
    set({ loading: true, error: undefined });
    try {
      const routes = await fetchManagedRoutes();
      set({ routes, loading: false });
      return true;
    } catch (err) {
      const message = (err as { message?: string })?.message ?? 'Không tải được danh sách menu';
      set({ loading: false, error: message });
      return false;
    }
  },
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
  deleteSection: (subheader) => set((state) => ({ routes: deleteSection(state.routes, subheader) })),
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
  // Bỏ mọi thay đổi chưa lưu, tải lại dữ liệu từ API
  reload: () => get().loadFromApi(),
}));
