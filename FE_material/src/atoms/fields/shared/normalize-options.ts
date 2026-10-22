import type { BaseOption, ValueEnum } from './types';

// ----------------------------------------------------------------------

type OptionsInput = BaseOption[] | [string | number, string][] | ValueEnum | undefined | null;

/**
 * Chuẩn hóa đầu vào options về dạng BaseOption[] duy nhất.
 *
 * Hỗ trợ 3 dạng đầu vào:
 * 1. Mảng object: [{ label, value }]
 * 2. Mảng tuple: [['active', 'Hoạt động']]
 * 3. Object enum: { active: 'Hoạt động' }
 *
 * @example
 * normalizeOptions([{ label: 'A', value: 'a' }])
 * normalizeOptions([['a', 'A'], ['b', 'B']])
 * normalizeOptions({ a: 'A', b: 'B' })
 */
export function normalizeOptions(input: OptionsInput): BaseOption[] {
  if (!input) return [];

  // Dạng mảng
  if (Array.isArray(input)) {
    return input
      .filter((item) => item != null)
      .map((item): BaseOption | null => {
        // Dạng tuple [value, label]
        if (Array.isArray(item)) {
          const [value, label] = item;
          if (value == null || label == null) return null;
          return { label: String(label), value };
        }
        // Dạng object { label, value }
        if (typeof item === 'object' && 'value' in item && 'label' in item) {
          return { ...item, label: String(item.label), value: item.value };
        }
        return null;
      })
      .filter((option): option is BaseOption => option !== null);
  }

  // Dạng object enum
  if (typeof input === 'object') {
    return Object.entries(input).map(([key, val]): BaseOption => {
      if (typeof val === 'string') {
        return { label: val, value: key };
      }
      return { label: val.label, value: key, disabled: val.disabled };
    });
  }

  return [];
}

// ----------------------------------------------------------------------

/**
 * Map value → label để hiển thị (dùng cho chế độ readonly).
 */
export function getOptionLabel(options: BaseOption[], value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((v) => getOptionLabel(options, v)).filter(Boolean).join(', ');
  }
  const found = options.find((option) => option.value === value);
  return found ? found.label : value == null ? '' : String(value);
}
