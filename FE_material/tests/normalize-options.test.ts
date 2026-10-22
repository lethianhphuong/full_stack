import { normalizeOptions, getOptionLabel } from '../src/atoms/fields/shared/normalize-options';
import type { BaseOption } from '../src/atoms/fields/shared/types';

// ----------------------------------------------------------------------
// Test runner tối giản
// ----------------------------------------------------------------------

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed += 1;
    console.log(`  ✓ ${message}`);
  } else {
    failed += 1;
    console.error(`  ✗ ${message}`);
  }
}

function assertEqual(actual: unknown, expected: unknown, message: string) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    console.error(`    expected: ${JSON.stringify(expected)}`);
    console.error(`    actual:   ${JSON.stringify(actual)}`);
  }
  assert(ok, message);
}

// ----------------------------------------------------------------------
// normalizeOptions
// ----------------------------------------------------------------------

console.log('\n[normalizeOptions] Dạng mảng object:');
{
  const input: BaseOption[] = [
    { label: 'Hoạt động', value: 'active' },
    { label: 'Bị cấm', value: 'banned', disabled: true },
  ];
  assertEqual(normalizeOptions(input), input, 'giữ nguyên mảng object chuẩn');
}

console.log('\n[normalizeOptions] Dạng tuple [value, label]:');
{
  const result = normalizeOptions([
    ['active', 'Hoạt động'],
    ['banned', 'Bị cấm'],
  ]);
  assertEqual(
    result,
    [
      { label: 'Hoạt động', value: 'active' },
      { label: 'Bị cấm', value: 'banned' },
    ],
    'convert tuple sang BaseOption'
  );
}

console.log('\n[normalizeOptions] Dạng valueEnum object:');
{
  const result = normalizeOptions({ active: 'Hoạt động', banned: 'Bị cấm' });
  assertEqual(
    result,
    [
      { label: 'Hoạt động', value: 'active' },
      { label: 'Bị cấm', value: 'banned' },
    ],
    'convert enum string sang BaseOption'
  );
}

console.log('\n[normalizeOptions] valueEnum với object value:');
{
  const result = normalizeOptions({
    active: { label: 'Hoạt động' },
    banned: { label: 'Bị cấm', disabled: true },
  });
  assertEqual(
    result,
    [
      { label: 'Hoạt động', value: 'active' },
      { label: 'Bị cấm', value: 'banned', disabled: true },
    ],
    'giữ disabled từ object value'
  );
}

console.log('\n[normalizeOptions] Trường hợp biên:');
{
  assertEqual(normalizeOptions(undefined), [], 'undefined → mảng rỗng');
  assertEqual(normalizeOptions(null), [], 'null → mảng rỗng');
  assertEqual(normalizeOptions([]), [], 'mảng rỗng → mảng rỗng');
  assertEqual(normalizeOptions({}), [], 'object rỗng → mảng rỗng');
}

console.log('\n[normalizeOptions] Value là số:');
{
  const result = normalizeOptions([
    { label: 'Một', value: 1 },
    { label: 'Hai', value: 2 },
  ]);
  assertEqual(result[0].value, 1, 'giữ nguyên value số');
  assertEqual(typeof result[0].value, 'number', 'kiểu value vẫn là number');
}

console.log('\n[normalizeOptions] Giữ dữ liệu bổ sung (dùng cho renderOption):');
{
  const result = normalizeOptions([{ label: 'Nguyễn Văn A', value: 'nv1', department: 'Kỹ thuật' }]);
  assertEqual(result[0].department, 'Kỹ thuật', 'giữ field tùy ý department');
}

console.log('\n[normalizeOptions] Lọc phần tử không hợp lệ trong mảng:');
{
  const result = normalizeOptions([
    { label: 'Hợp lệ', value: 'ok' },
    null as unknown as BaseOption,
    { label: 'Thiếu value' } as unknown as BaseOption,
  ]);
  assertEqual(result.length, 1, 'chỉ giữ phần tử hợp lệ');
  assertEqual(result[0].value, 'ok', 'phần tử hợp lệ được giữ đúng');
}

// ----------------------------------------------------------------------
// getOptionLabel
// ----------------------------------------------------------------------

console.log('\n[getOptionLabel] Map value → label:');
{
  const options: BaseOption[] = [
    { label: 'Hoạt động', value: 'active' },
    { label: 'Bị cấm', value: 'banned' },
  ];
  assertEqual(getOptionLabel(options, 'active'), 'Hoạt động', 'tìm đúng label theo value');
  assertEqual(getOptionLabel(options, 'unknown'), 'unknown', 'value không tồn tại → trả về chính nó');
  assertEqual(getOptionLabel(options, null), '', 'null → chuỗi rỗng');
  assertEqual(getOptionLabel(options, undefined), '', 'undefined → chuỗi rỗng');
}

console.log('\n[getOptionLabel] Mảng value (multiple):');
{
  const options: BaseOption[] = [
    { label: 'Hà Nội', value: 'hanoi' },
    { label: 'Đà Nẵng', value: 'danang' },
  ];
  assertEqual(getOptionLabel(options, ['hanoi', 'danang']), 'Hà Nội, Đà Nẵng', 'ghép label bằng dấu phẩy');
  assertEqual(getOptionLabel(options, []), '', 'mảng rỗng → chuỗi rỗng');
}

// ----------------------------------------------------------------------
// Tổng kết
// ----------------------------------------------------------------------

console.log(`\n${'='.repeat(50)}`);
console.log(`Kết quả: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
