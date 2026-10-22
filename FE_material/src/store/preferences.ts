import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ThemeMode,
  ThemeLayout,
  ThemeColorPresets,
  ThemeDirection,
  ThemeContrast,
  ThemeNavColor,
  ThemeFontFamily,
  ThemeTransition,
} from '@/types/settings';

// ----------------------------------------------------------------------

export interface PreferencesState {
  // Theme
  themeMode: ThemeMode;
  themeColorPresets: ThemeColorPresets;
  themeContrast: ThemeContrast;
  themeDirection: ThemeDirection;

  // Layout
  themeLayout: ThemeLayout;
  themeStretch: boolean;
  themeNavColor: ThemeNavColor;

  // Typography
  themeFontFamily: ThemeFontFamily;
  themeFontSize: number;

  // Features
  transitionProgress: boolean;

  // Page Transition
  transitionEnabled: boolean;
  themeTransition: ThemeTransition;

  // Compact
  themeCompact: boolean;

  // Drawer state
  settingsOpen: boolean;
}

interface PreferencesActions {
  // Update single setting
  onUpdate: <K extends keyof PreferencesState>(key: K, value: PreferencesState[K]) => void;
  
  // Reset to defaults
  onReset: () => void;
  
  // Toggle theme mode
  onToggleMode: () => void;
  
  // Settings drawer
  onToggle: () => void;
  onClose: () => void;
  
  // Computed
  canReset: () => boolean;
}

// ----------------------------------------------------------------------

const defaultState: PreferencesState = {
  // Theme
  themeMode: 'dark',
  themeColorPresets: 'default',
  themeContrast: 'default',
  themeDirection: 'ltr',

  // Layout
  themeLayout: 'vertical',
  themeStretch: false,
  themeNavColor: 'apparent',

  // Typography
  themeFontFamily: 'Public Sans',
  themeFontSize: 16,

  // Features
  transitionProgress: true,

  // Page Transition
  transitionEnabled: true,
  themeTransition: 'fade-slide',

  // Compact
  themeCompact: false,

  // Drawer
  settingsOpen: false,
};

// ----------------------------------------------------------------------

export const usePreferencesStore = create<PreferencesState & PreferencesActions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      onUpdate: (key, value) => set({ [key]: value }),

      onReset: () => set({ ...defaultState, settingsOpen: get().settingsOpen }),

      onToggleMode: () =>
        set((state) => ({
          themeMode: state.themeMode === 'dark' ? 'light' : 'dark',
        })),

      onToggle: () => set((state) => ({ settingsOpen: !state.settingsOpen })),

      onClose: () => set({ settingsOpen: false }),

      canReset: () => {
        const state = get();
        const { settingsOpen, ...currentSettings } = state;
        const { settingsOpen: _, ...defaults } = defaultState;
        return JSON.stringify(currentSettings) !== JSON.stringify(defaults);
      },
    }),
    {
      name: 'preferences',
      // Only persist these keys (exclude drawer state and actions)
      partialize: (state) => ({
        themeMode: state.themeMode,
        themeColorPresets: state.themeColorPresets,
        themeContrast: state.themeContrast,
        themeDirection: state.themeDirection,
        themeLayout: state.themeLayout,
        themeStretch: state.themeStretch,
        themeNavColor: state.themeNavColor,
        themeFontFamily: state.themeFontFamily,
        themeFontSize: state.themeFontSize,
        transitionProgress: state.transitionProgress,
        transitionEnabled: state.transitionEnabled,
        themeTransition: state.themeTransition,
        themeCompact: state.themeCompact,
      }),
    }
  )
);

// ----------------------------------------------------------------------
