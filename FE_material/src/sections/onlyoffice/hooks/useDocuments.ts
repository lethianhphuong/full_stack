import { useState, useCallback, useEffect, useRef } from 'react';
import { documentService } from '@/services';
import type { DocumentItem, DocumentStats, SortOptionValue, ViewMode } from '../types/document.types';
import { DEBOUNCE_SEARCH_MS, SORT_MAP } from '../constants/document.constants';

export interface UseDocumentsOptions {
  initialPage?: number;
  initialRowsPerPage?: number;
  initialFilter?: string;
  initialSortBy?: SortOptionValue;
  initialViewMode?: ViewMode;
}

export function useDocuments(options: UseDocumentsOptions = {}) {
  const {
    initialPage = 0,
    initialRowsPerPage = 10,
    initialFilter = 'all',
    initialSortBy = 'newest',
    initialViewMode = 'table',
  } = options;

  // Data states
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [stats, setStats] = useState<DocumentStats>({ total: 0, docx: 0, xlsx: 0, pptx: 0, pdf: 0 });
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination states
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [sortBy, setSortBy] = useState<SortOptionValue>(initialSortBy);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  // References for abort and unmount protection
  const isMountedRef = useRef(true);
  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const statsAbortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      fetchAbortControllerRef.current?.abort();
      statsAbortControllerRef.current?.abort();
    };
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, DEBOUNCE_SEARCH_MS);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch document stats
  const fetchStats = useCallback(async () => {
    statsAbortControllerRef.current?.abort();
    const controller = new AbortController();
    statsAbortControllerRef.current = controller;

    try {
      const res = await documentService.getDocumentStats(
        { page, size: rowsPerPage },
        controller.signal
      );
      if (!isMountedRef.current) return;

      if (res?.success && res.data) {
        setStats({
          total: res.data.total || 0,
          docx: res.data.docx || 0,
          xlsx: res.data.xlsx || 0,
          pptx: res.data.pptx || 0,
          pdf: res.data.pdf || 0,
        });
      }
    } catch (err: unknown) {
      if ((err as { isCanceled?: boolean })?.isCanceled) return;
      console.warn('[useDocuments] Khong the tai thong ke:', err);
    }
  }, [page, rowsPerPage]);

  // Fetch document list
  const fetchDocuments = useCallback(async () => {
    fetchAbortControllerRef.current?.abort();
    const controller = new AbortController();
    fetchAbortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const sortParam = SORT_MAP[sortBy] || 'createdAt,desc';
      const res = await documentService.getDocuments(
        {
          page,
          size: rowsPerPage,
          search: debouncedSearch,
          fileType: selectedFilter,
          sort: sortParam,
        },
        controller.signal
      );

      if (!isMountedRef.current) return;

      if (res?.success && res.data) {
        setDocuments(res.data.content || []);
        setTotalElements(res.data.totalElements || 0);

        if (res.data.stats) {
          setStats({
            total: res.data.stats.total || 0,
            docx: res.data.stats.docx || 0,
            xlsx: res.data.stats.xlsx || 0,
            pptx: res.data.stats.pptx || 0,
            pdf: res.data.stats.pdf || 0,
          });
        }
      }
    } catch (err: unknown) {
      if ((err as { isCanceled?: boolean })?.isCanceled) return;
      if (!isMountedRef.current) return;
      const message = (err as { message?: string })?.message || 'Loi khi tai danh sach tai lieu';
      setError(message);
      console.warn('[useDocuments] Loi khi tai tai lieu:', err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [page, rowsPerPage, debouncedSearch, selectedFilter, sortBy]);

  // Trigger fetch whenever filter, sort, page, or rowsPerPage change
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Refresh both list and stats
  const refresh = useCallback(async () => {
    await Promise.all([fetchDocuments(), fetchStats()]);
  }, [fetchDocuments, fetchStats]);

  // Delete document
  const deleteDocument = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await documentService.deleteDocument(id);
        if (res?.success) {
          await refresh();
          return true;
        }
        return false;
      } catch (err) {
        console.error('[useDocuments] Loi khi xoa tai lieu:', err);
        return false;
      }
    },
    [refresh]
  );

  return {
    // States
    documents,
    stats,
    totalElements,
    loading,
    error,
    page,
    rowsPerPage,
    searchTerm,
    debouncedSearch,
    selectedFilter,
    sortBy,
    viewMode,

    // Setters
    setPage,
    setRowsPerPage,
    setSearchTerm,
    setSelectedFilter,
    setSortBy,
    setViewMode,

    // Actions
    fetchDocuments,
    fetchStats,
    refresh,
    deleteDocument,
  };
}

export default useDocuments;
