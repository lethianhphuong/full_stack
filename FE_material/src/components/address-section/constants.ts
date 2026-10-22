import type { AddressFieldConfig, AddressValue } from './types';

const toOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }));

export const DEFAULT_ADDRESS_CONFIGS: AddressFieldConfig[] = [
  { key: 'birthPlace', label: 'Nơi sinh' },
  { key: 'homeTown', label: 'Quê quán' },
  { key: 'permanent', label: 'Nơi ĐKTT' },
  { key: 'temporary', label: 'Nơi tạm trú' },
  { key: 'current', label: 'Nơi ở hiện nay' },
];

export const DEFAULT_WARD_OPTIONS = toOptions([
  'Phường Ba Đình',
  'Phường Hoàn Kiếm',
  'Phường Cầu Giấy',
  'Phường Đống Đa',
  'Xã Đông Anh',
  'Xã Sóc Sơn',
  'Phường Thanh Xuân',
  'Xã Gia Lâm',
]);

export const DEFAULT_PROVINCE_OPTIONS = toOptions([
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Hải Phòng',
  'Đà Nẵng',
  'Cần Thơ',
  'Huế',
  'Quảng Ninh',
  'Thanh Hóa',
  'Nghệ An',
  'Lâm Đồng',
  'Đồng Nai',
  'Khánh Hòa',
]);

export const DEFAULT_COUNTRY_OPTIONS = toOptions([
  'Việt Nam',
  'Lào',
  'Campuchia',
  'Trung Quốc',
  'Khác',
]);

export const DEFAULT_EMPTY_ADDRESS: AddressValue = {
  street: '',
  ward: '',
  province: '',
  country: 'Việt Nam',
};
