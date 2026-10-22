import { useEffect } from 'react';
import { Outlet, useNavigation } from 'react-router';
import NProgress from 'nprogress';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { usePreferencesStore } from '@/store/preferences';
import ThemeProvider from '@/theme';
import { SettingsDrawer } from '@/components/settings';
import { NProgressStyles } from '@/components/progress';
import { SnackbarProvider } from 'notistack';
// ----------------------------------------------------------------------

// Pre-create emotion caches for LTR and RTL
const ltrCache = createCache({
  key: 'mui',
  prepend: true,
});

const rtlCache = createCache({
  key: 'muirtl',
  prepend: true,
  stylisPlugins: [prefixer, rtlPlugin],
});

// ----------------------------------------------------------------------

export default function RootLayout() {
  const themeDirection = usePreferencesStore((state) => state.themeDirection);
  const transitionProgress = usePreferencesStore((state) => state.transitionProgress);
  const navigation = useNavigation();

  // Configure NProgress once
  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      speed: 400,
      minimum: 0.08,
      easing: 'ease',
      trickleSpeed: 200,
    });
  }, []);

  // Handle NProgress based on navigation state
  useEffect(() => {
    if (!transitionProgress) return;
    
    if (navigation.state === 'loading') {
      NProgress.start();
    } else if (navigation.state === 'idle') {
      NProgress.done();
    }
  }, [navigation.state, transitionProgress]);

  // Update document direction
  useEffect(() => {
    document.dir = themeDirection;
  }, [themeDirection]);

  // Select cache based on direction
  const cache = themeDirection === 'rtl' ? rtlCache : ltrCache;

  return (
    <CacheProvider value={cache}>
      <ThemeProvider>
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <NProgressStyles />
          <Outlet />
          <SettingsDrawer />
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
