import type { FilterTabConfig, SortOption, SortOptionValue } from '../types/document.types';

export const FILE_TYPE_COLORS: Record<string, string> = {
  docx: '#2B579A',
  xlsx: '#217346',
  pptx: '#C43E1C',
  pdf: '#E53935',
};

export const FILE_TYPE_LABELS: Record<string, string> = {
  docx: 'Word (.docx)',
  xlsx: 'Excel (.xlsx)',
  pptx: 'PowerPoint (.pptx)',
  pdf: 'PDF (.pdf)',
};

export const FILE_TYPE_ICONS: Record<string, string> = {
  docx: 'solar:document-text-bold-duotone',
  xlsx: 'solar:chart-square-bold-duotone',
  pptx: 'solar:presentation-graph-bold-duotone',
  pdf: 'solar:file-text-bold-duotone',
  default: 'solar:document-bold-duotone',
};

export const ACTION_ICONS = {
  edit: 'solar:pen-new-square-bold',
  view: 'solar:eye-bold',
  download: 'solar:download-bold',
  delete: 'solar:trash-bin-trash-bold',
  upload: 'solar:cloud-upload-bold',
  create: 'solar:add-circle-bold',
  refresh: 'solar:refresh-linear',
  search: 'solar:magnifer-linear',
  clear: 'solar:close-circle-bold',
  table: 'solar:list-bold',
  grid: 'solar:widget-4-bold',
  menu: 'solar:menu-dots-bold',
  empty: 'solar:folder-open-broken',
  all: 'solar:folder-with-files-bold-duotone',
} as const;

export const SORT_MAP: Record<SortOptionValue, string> = {
  newest: 'createdAt,desc',
  oldest: 'createdAt,asc',
  name: 'title,asc',
  size: 'fileSize,desc',
};

export const SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: 'Mới nhất trước' },
  { value: 'oldest', label: 'Cũ nhất trước' },
  { value: 'name', label: 'Tên A - Z' },
  { value: 'size', label: 'Dung lượng giảm dần' },
];

export const FILTER_TABS: FilterTabConfig[] = [
  { value: 'all', label: 'Tất cả', countKey: 'total' },
  { value: 'docx', label: 'Word', countKey: 'docx', color: '#2B579A' },
  { value: 'xlsx', label: 'Excel', countKey: 'xlsx', color: '#217346' },
  { value: 'pptx', label: 'PowerPoint', countKey: 'pptx', color: '#C43E1C' },
  { value: 'pdf', label: 'PDF', countKey: 'pdf', color: '#E53935' },
];

export const DEBOUNCE_SEARCH_MS = 400;
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
