import { create } from 'zustand';
import type { RouteSectionConfig } from '@/router/routes-config';
import { staticRoutesConfig } from '@/router/routes-config';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

type RouterState = {
  // Routes config (static + dynamic từ API)
  routesConfig: RouteSectionConfig[];
  
  // Loading state khi fetch từ API
  isLoading: boolean;
  error: string | null;
  
  // Version - tăng mỗi khi config thay đổi, dùng làm key cho RouterProvider
  version: number;
  
  // Đã load routes từ API chưa?
  isInitialized: boolean;
};

type RouterActions = {
  // Set routes config hoàn toàn mới (thay thế static)
  setRoutesConfig: (config: RouteSectionConfig[]) => void;
  
  // Merge API routes với static routes
  mergeRoutesConfig: (apiConfig: RouteSectionConfig[]) => void;
  
  // Reset về static config
  resetToStatic: () => void;
  
  // Loading states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Future: Load từ API
  // loadRoutesFromApi: () => Promise<void>;
};

// ----------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------

/**
 * Merge API config với static config
 * - Thêm items mới vào sections đã có
 * - Thêm sections mới nếu chưa tồn tại
 * - Tránh duplicate items (dựa trên id)
 */
function mergeConfigs(
  staticConfig: RouteSectionConfig[],
  apiConfig: RouteSectionConfig[]
): RouteSectionConfig[] {
  // Deep clone static config để tránh mutation
  const merged: RouteSectionConfig[] = staticConfig.map(section => ({
    subheader: section.subheader,
    items: section.items.map(item => ({
      ...item,
      children: item.children ? [...item.children] : undefined,
    })),
  }));

  for (const apiSection of apiConfig) {
    const existingSection = merged.find(s => s.subheader === apiSection.subheader);

    if (existingSection) {
      // Thêm items vào section đã có (tránh duplicate theo id)
      for (const apiItem of apiSection.items) {
        const existingItem = existingSection.items.find(i => i.id === apiItem.id);
        
        if (!existingItem) {
          // Item mới, thêm vào
          existingSection.items.push(apiItem);
        } else if (apiItem.children) {
          // Merge children nếu có
          existingItem.children = existingItem.children || [];
          for (const apiChild of apiItem.children) {
            if (!existingItem.children.some(c => c.id === apiChild.id)) {
              existingItem.children.push(apiChild);
            }
          }
        }
      }
    } else {
      // Section mới, thêm vào cuối
      merged.push(apiSection);
    }
  }

  return merged;
}

// ----------------------------------------------------------------------
// Initial State
// ----------------------------------------------------------------------

const initialState: RouterState = {
  routesConfig: staticRoutesConfig,
  isLoading: false,
  error: null,
  version: 0,
  isInitialized: false,
};

// ----------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------

export const useRouterStore = create<RouterState & RouterActions>((set, get) => ({
  ...initialState,

  setRoutesConfig: (config) => {
    set((state) => ({
      routesConfig: config,
      version: state.version + 1,
      isInitialized: true,
    }));
  },

  mergeRoutesConfig: (apiConfig) => {
    const { routesConfig } = get();
    const merged = mergeConfigs(routesConfig, apiConfig);

    set((state) => ({
      routesConfig: merged,
      version: state.version + 1,
      isInitialized: true,
    }));
  },

  resetToStatic: () => {
    set((state) => ({
      routesConfig: staticRoutesConfig,
      version: state.version + 1,
      isInitialized: false,
      error: null,
    }));
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  // Placeholder cho future API call
  // loadRoutesFromApi: async () => {
  //   const { setLoading, setError, mergeRoutesConfig } = get();
  //   
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     
  //     const response = await fetch('/api/routes');
  //     if (!response.ok) {
  //       throw new Error('Failed to load routes');
  //     }
  //     
  //     const apiConfig: RouteSectionConfig[] = await response.json();
  //     mergeRoutesConfig(apiConfig);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Failed to load routes');
  //   } finally {
  //     setLoading(false);
  //   }
  // },
}));

// ----------------------------------------------------------------------
// Selectors (for performance optimization)
// ----------------------------------------------------------------------

export const selectRoutesConfig = (state: RouterState & RouterActions) => state.routesConfig;
export const selectRouterVersion = (state: RouterState & RouterActions) => state.version;
export const selectIsLoading = (state: RouterState & RouterActions) => state.isLoading;
export const selectIsInitialized = (state: RouterState & RouterActions) => state.isInitialized;
export const selectError = (state: RouterState & RouterActions) => state.error;
