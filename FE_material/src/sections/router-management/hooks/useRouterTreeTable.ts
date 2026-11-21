import { useCallback, useMemo, useState } from 'react';
import { useManagedRouterStore } from '../store';
import { buildRouterSections } from '../route-config-adapter';
import type { FilterState, RouterRowItem } from '../types';

function countItems(items: RouterRowItem[]): number {
  return items.reduce(
    (total, item) => total + 1 + (item.children ? countItems(item.children) : 0),
    0,
  );
}

export function useRouterTreeTable() {
  const routesConfig = useManagedRouterStore((state) => state.routes);
  const sections = useMemo(() => buildRouterSections(routesConfig), [routesConfig]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    subheader: 'all',
  });

  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});

  const toggleCollapse = useCallback((id: string) => {
    setCollapsedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      subheader: 'all',
    });
    setCollapsedMap({});
  }, []);

  const handleSearchChange = useCallback((val: string) => {
    setFilters((prev) => ({ ...prev, search: val }));
  }, []);

  const handleSubheaderChange = useCallback((val: string) => {
    setFilters((prev) => ({ ...prev, subheader: val }));
  }, []);

  // Helper filter function for a single item
  const itemMatches = (item: RouterRowItem, searchLower: string) => {
    const matchesSearch =
      !searchLower ||
      item.title.toLowerCase().includes(searchLower) ||
      item.id.toLowerCase().includes(searchLower) ||
      item.path.toLowerCase().includes(searchLower);

    return matchesSearch;
  };

  // Filter recursively
  const filteredSections = useMemo(() => {
    const searchLower = filters.search.trim().toLowerCase();

    return sections.filter((section) => {
      if (filters.subheader !== 'all' && section.id !== filters.subheader) {
        return false;
      }
      return true;
    })
      .map((section) => {
        const filterTree = (items: RouterRowItem[]): RouterRowItem[] => {
          const result: RouterRowItem[] = [];
          for (const item of items) {
            const directMatch = itemMatches(item, searchLower);
            const filteredChildren = item.children ? filterTree(item.children) : [];

            if (directMatch || filteredChildren.length > 0) {
              result.push({
                ...item,
                children:
                  searchLower
                    ? filteredChildren.length > 0
                      ? filteredChildren
                      : undefined
                    : item.children,
              });
            }
          }
          return result;
        };

        const matchingItems = filterTree(section.items);
        return {
          ...section,
          routeCount: countItems(matchingItems),
          items: matchingItems,
        };
      })
      .filter((section) => {
        if (!section.title && section.items.length === 0) return false;
        if (!searchLower) return true;
        return section.items.length > 0 || section.title.toLowerCase().includes(searchLower);
      });
  }, [filters, sections]);

  // Total visible route entries
  const totalEntries = useMemo(() => {
    return filteredSections.reduce((total, section) => total + countItems(section.items), 0);
  }, [filteredSections]);

  return {
    routesConfig,
    sections,
    filters,
    collapsedMap,
    toggleCollapse,
    resetFilters,
    handleSearchChange,
    handleSubheaderChange,
    filteredSections,
    totalEntries,
    totalConfiguredEntries: sections.reduce((total, section) => total + section.routeCount, 0),
  };
}
