import type { MRT_ColumnDef, MRT_RowData, MRT_TableOptions } from 'material-react-table';

// ----------------------------------------------------------------------
// DataTable Types
// ----------------------------------------------------------------------

export type { MRT_ColumnDef, MRT_RowData };

// Localization keys for Vietnamese
export type LocalizationKey =
  | 'actions'
  | 'cancel'
  | 'clearFilter'
  | 'clearSearch'
  | 'clearSort'
  | 'columnActions'
  | 'copiedToClipboard'
  | 'copy'
  | 'collapse'
  | 'collapseAll'
  | 'columns'
  | 'edit'
  | 'expand'
  | 'expandAll'
  | 'export'
  | 'filterByColumn'
  | 'filterMode'
  | 'filters'
  | 'goToFirstPage'
  | 'goToLastPage'
  | 'goToNextPage'
  | 'goToPreviousPage'
  | 'grab'
  | 'groupByColumn'
  | 'groupedBy'
  | 'hideAll'
  | 'hideColumn'
  | 'max'
  | 'min'
  | 'move'
  | 'noRecordsToDisplay'
  | 'noResultsFound'
  | 'of'
  | 'pinToLeft'
  | 'pinToRight'
  | 'resetColumnSize'
  | 'resetOrder'
  | 'rowActions'
  | 'rowNumber'
  | 'rowNumbers'
  | 'rowsPerPage'
  | 'save'
  | 'search'
  | 'selectedCountOfRowCountRowsSelected'
  | 'showAll'
  | 'showAllColumns'
  | 'showHideColumns'
  | 'showHideFilters'
  | 'showHideSearch'
  | 'sortByColumnAsc'
  | 'sortByColumnDesc'
  | 'sortedByColumnAsc'
  | 'sortedByColumnDesc'
  | 'thenBy'
  | 'toggleDensity'
  | 'toggleFullScreen'
  | 'toggleSelectAll'
  | 'toggleSelectRow'
  | 'toggleVisibility'
  | 'ungroupByColumn'
  | 'unpin'
  | 'unpinAll'
  | 'unsorted';

// DataTable Props - extends MRT options with custom props
export interface DataTableProps<TData extends MRT_RowData>
  extends Omit<MRT_TableOptions<TData>, 'data' | 'columns'> {
  /**
   * Table columns definition
   */
  columns: MRT_ColumnDef<TData>[];
  /**
   * Table data
   */
  data: TData[];
  /**
   * Enable loading state
   * @default false
   */
  loading?: boolean;
  /**
   * Enable dense mode
   * @default false
   */
  dense?: boolean;
  /**
   * Enable striped rows
   * @default false
   */
  striped?: boolean;
  /**
   * Sticky header
   * @default true
   */
  stickyHeader?: boolean;
  /**
   * Table height (when stickyHeader is true)
   * @default 'auto'
   */
  height?: number | string;
  /**
   * Custom empty state message
   */
  emptyMessage?: string;
}

// Export options for DataTable
export interface ExportOptions {
  csv?: boolean;
  excel?: boolean;
  pdf?: boolean;
  filename?: string;
}

// Pagination state
export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

// Sorting state
export interface SortingState {
  id: string;
  desc: boolean;
}[]

// Column visibility state
export type ColumnVisibilityState = Record<string, boolean>;
