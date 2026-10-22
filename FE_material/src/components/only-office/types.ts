export interface OnlyOfficeConfig {
  documentServerUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>;
  displayName?: string;
}

export type OnlyOfficeTheme = 'theme-classic-light' | 'theme-light' | 'theme-dark';

export interface OnlyOfficeEditorProps {
  config: OnlyOfficeConfig;
  editorTheme?: OnlyOfficeTheme;
  readOnly?: boolean;
  onDocumentReady?: () => void;
  onError?: (error: unknown) => void;
  onSave?: (data: unknown) => void;
}

export type SupportedFileType = 'docx' | 'xlsx' | 'pptx' | 'pdf';

export const FILE_TYPE_LABELS: Record<SupportedFileType, string> = {
  docx: 'Word (.docx)',
  xlsx: 'Excel (.xlsx)',
  pptx: 'PowerPoint (.pptx)',
  pdf: 'PDF (.pdf)',
};

export const FILE_TYPE_ICONS: Record<SupportedFileType, string> = {
  docx: 'solar:document-text-bold-duotone',
  xlsx: 'solar:table-bold-duotone',
  pptx: 'solar:presentation-bold-duotone',
  pdf: 'solar:file-text-bold-duotone',
};
