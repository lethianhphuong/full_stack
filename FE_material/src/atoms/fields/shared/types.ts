// ----------------------------------------------------------------------
// Types dùng chung cho toàn bộ hệ thống Base Fields
// ----------------------------------------------------------------------

/**
 * Option chuẩn cho Select / Radio / Checkbox / Autocomplete.
 * Cho phép đính kèm dữ liệu tùy ý (avatar, màu...) để dùng trong renderOption.
 */
export type BaseOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
};

/**
 * ValueEnum kiểu Ant Design Pro: map value → label.
 * Value có thể là string ngắn hoặc object đầy đủ.
 *
 * @example
 * const STATUS_ENUM = { active: 'Hoạt động', banned: { label: 'Bị cấm', disabled: true } };
 */
export type ValueEnum = Record<string | number, string | { label: string; disabled?: boolean }>;

/**
 * Props chuẩn chung cho mọi Base field.
 * Người dùng học 1 field là biết dùng tất cả.
 */
export type FieldCommonProps = {
  /** Tên field trong React Hook Form */
  name: string;
  /** Nhãn hiển thị */
  label?: string;
  /** Text trợ giúp (bị thay thế bởi message lỗi nếu có) */
  helperText?: string;
  /** Vô hiệu hóa field */
  disabled?: boolean;
  /** Chỉ đọc — hiển thị text thay vì input */
  readonly?: boolean;
  /** Hiện nút xóa giá trị */
  allowClear?: boolean;
  /** Kích thước field */
  size?: 'small' | 'medium';
};
