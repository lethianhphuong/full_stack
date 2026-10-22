// ----------------------------------------------------------------------

// Simulate network delay for testing (set to true to test NProgress)
const SIMULATE_DELAY = false;
const DELAY_MS = 500;

/**
 * Helper to wrap lazy imports for route configuration
 * Returns the component in the format expected by React Router's lazy prop
 */
export function lazyWithProgress<T extends { default: React.ComponentType }>(
  importFn: () => Promise<T>
): () => Promise<{ Component: React.ComponentType }> {
  return async () => {
    if (SIMULATE_DELAY) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
    const module = await importFn();
    return { Component: module.default };
  };
}
