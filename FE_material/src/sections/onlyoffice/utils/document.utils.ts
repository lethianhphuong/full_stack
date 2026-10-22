import { FILE_TYPE_COLORS, FILE_TYPE_ICONS, FILE_TYPE_LABELS } from '../constants/document.constants';

export function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function getFileTypeColor(fileType: string): string {
  return FILE_TYPE_COLORS[fileType.toLowerCase()] || '#637381';
}

export function getFileTypeIcon(fileType: string): string {
  return FILE_TYPE_ICONS[fileType.toLowerCase()] || FILE_TYPE_ICONS.default;
}

export function getFileTypeLabel(fileType: string): string {
  return FILE_TYPE_LABELS[fileType.toLowerCase()] || fileType.toUpperCase();
}
