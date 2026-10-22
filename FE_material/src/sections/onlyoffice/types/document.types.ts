export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  documentKey: string;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentStats {
  total: number;
  docx: number;
  xlsx: number;
  pptx: number;
  pdf: number;
}

export type SupportedFileType = 'docx' | 'xlsx' | 'pptx' | 'pdf';
export type SortOptionValue = 'newest' | 'oldest' | 'name' | 'size';
export type ViewMode = 'table' | 'grid';
export type FilterTypeValue = 'all' | 'docx' | 'xlsx' | 'pptx' | 'pdf';

export interface SortOption {
  value: SortOptionValue;
  label: string;
}

export interface FilterTabConfig {
  value: FilterTypeValue;
  label: string;
  countKey: keyof DocumentStats;
  color?: string;
}
