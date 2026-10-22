import type { MRT_RowData } from 'material-react-table';

declare module 'material-react-table' {
  interface MRT_ColumnDef<TData extends MRT_RowData, TValue = unknown> {
    /**
     * Bật/tắt tooltip cho cột này (mặc định SearchableProTable tự động bật).
     */
    enableTooltip?: boolean;
  }
}
