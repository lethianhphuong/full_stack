// Re-export all stores
export { usePreferencesStore } from './preferences';
export type { PreferencesState } from './preferences';
export { useDemoPersonStore, selectDemoPeople, selectAddDemoPerson, selectUpdateDemoPerson, selectRemoveDemoPerson, selectResetDemoPeople } from './demo-person';

export { 
  useRouterStore,
  selectRoutesConfig,
  selectRouterVersion,
  selectIsLoading,
  selectIsInitialized,
  selectError,
} from './router';
