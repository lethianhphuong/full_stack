import type { ReactNode } from 'react';

export type AddressValue = {
  street: string;
  ward: string;
  province: string;
  country: string;
};

export type AddressFieldConfig = {
  key: string;
  label: string;
  required?: boolean;
};

export type AddressSectionProps = {
  /** Prefix path trong react-hook-form (mặc định: 'addresses') */
  namePrefix?: string;
  /** Prefix path cho địa chỉ trước sáp nhập (mặc định: 'previousAddresses') */
  previousNamePrefix?: string;
  /** Tên trường boolean switch trong form (mặc định: 'hasPreviousAddresses') */
  hasPreviousSwitchName?: string;
  /** Bật/tắt switch địa chỉ trước sáp nhập (mặc định: true) */
  showPreviousSwitch?: boolean;
  /** Nhãn của switch (mặc định: 'Địa chỉ trước khi sáp nhập địa giới hành chính') */
  previousSwitchLabel?: string;
  /** Nhãn chú thích dòng địa chỉ cũ (mặc định: 'Trước đây là:') */
  previousTagLabel?: string;
  /** Danh sách các khối địa chỉ cần hiển thị (hỗ trợ mảng key string hoặc mảng config) */
  addressConfigs?: (string | AddressFieldConfig)[];
  /** Custom label mapping cho các key */
  labels?: Record<string, string>;
  /** Cho phép sao chép từ dòng địa chỉ phía trên (mặc định: true) */
  showCopyButton?: boolean;
  /** Ẩn/hiện trường số nhà, đường (mặc định: true) */
  showStreet?: boolean;
  /** Ẩn/hiện trường phường/xã (mặc định: true) */
  showWard?: boolean;
  /** Ẩn/hiện trường tỉnh/thành phố (mặc định: true) */
  showProvince?: boolean;
  /** Ẩn/hiện trường quốc gia (mặc định: true) */
  showCountry?: boolean;
  /** Placeholder cho số nhà, đường */
  streetPlaceholder?: string;
  /** Placeholder cho số nhà, đường cũ */
  previousStreetPlaceholder?: string;
  /** Danh sách lựa chọn phường/xã */
  wardOptions?: { value: string; label: string }[];
  /** Danh sách lựa chọn tỉnh/TP */
  provinceOptions?: { value: string; label: string }[];
  /** Danh sách lựa chọn quốc gia */
  countryOptions?: { value: string; label: string }[];
  /** Kích thước input (mặc định: 'small') */
  size?: 'small' | 'medium';
  /** Vô hiệu hóa chỉnh sửa */
  disabled?: boolean;
  /** Cột phụ bên phải trên desktop (ví dụ tệ nạn, lực lượng vũ trang...) */
  sideFields?: ReactNode;
  /** Khoảng cách giữa các dòng */
  spacing?: number;
};
