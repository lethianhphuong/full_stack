import type { ReactNode, Ref } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import type {
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_RowData,
  MRT_SortingState,
} from 'material-react-table';
import type { DataTableProps } from '@/atoms/data-table/types';

export interface SearchableProTableQuery<TFilters extends object> {
  pageIndex: number;
  pageSize: number;
  keywords: string[];
  advancedFilters: TFilters | null;
  sorting: MRT_SortingState;
  columnFilters: MRT_ColumnFiltersState;
  signal: AbortSignal;
}

export interface SearchableProTableResult<TData> {
  data: TData[];
  total: number;
  success?: boolean;
}

export interface STTConfig {
  header?: string;
  size?: number;
  align?: 'left' | 'center' | 'right';
}

export interface SearchableProTableRef<TData, TFilters extends FieldValues = Record<string, never>> {
  reload: () => void;
  resetPage: () => void;
  getSelected: () => { keys: string[]; rows: TData[] };
  clearSelection: () => void;
  getAdvancedForm: () => UseFormReturn<TFilters>;
  getAdvancedDraft: () => TFilters;
  getAdvancedFilters: () => TFilters | null;
  resetAdvanced: () => void;
}

export type OnAdvancedSearchFn<TFilters extends FieldValues> =
  (values: TFilters) => TFilters | void | Promise<TFilters | void>;

interface SearchableProTableBaseProps<TData extends MRT_RowData, TFilters extends FieldValues> {
  columns: MRT_ColumnDef<TData>[];
  request: (query: SearchableProTableQuery<TFilters>) => Promise<SearchableProTableResult<TData>>;
  getRowId?: (row: TData) => string;
  ref?: Ref<SearchableProTableRef<TData, TFilters>>;
  defaultPageSize?: number;
  showSTT?: boolean;
  sttConfig?: STTConfig;
  enableColumnTooltip?: boolean;
  quickSearchPlaceholder?: string;
  hideQuickSearch?: boolean;
  onQuickSearch?: (keywords: string[]) => void;
  advancedSearchTitle?: string;
  defaultShowAdvanced?: boolean;
  onAdvancedSearch?: OnAdvancedSearchFn<TFilters>;
  onAdvancedReset?: () => void;
  toolbarActions?: ReactNode;
  advancedActions?: ReactNode;
  emptyMessage?: string;
  minTableHeight?: number | string;
  tableProps?: Partial<Omit<DataTableProps<TData>,
    | 'columns' | 'data' | 'loading' | 'state' | 'getRowId' | 'emptyMessage'
    | 'manualPagination' | 'manualSorting' | 'manualFiltering' | 'rowCount'
    | 'onPaginationChange' | 'onSortingChange' | 'onColumnFiltersChange'
    | 'onRowSelectionChange' | 'enableGlobalFilter'>>;
}

export type SearchableProTableProps<TData extends MRT_RowData, TFilters extends FieldValues = Record<string, never>> =
  SearchableProTableBaseProps<TData, TFilters> & (
    | { advancedSearchForm: ReactNode; initialAdvancedFilters?: Partial<TFilters> }
    | { advancedSearchForm?: undefined; initialAdvancedFilters?: undefined }
  );
