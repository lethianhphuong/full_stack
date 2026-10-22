import { useAsyncOptions } from '../src/atoms/fields/shared/use-async-options';
import type { BaseOption } from '../src/atoms/fields/shared/types';

// ----------------------------------------------------------------------
// Test runner tối giản + mock React hooks
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

// Hook React cần runtime thật để test đầy đủ (cần Vitest + Testing Library).
// Ở đây test 2 pattern lõi mà hook sử dụng: requestId chống race-condition và debounce.

async function main() {
console.log('\n[useAsyncOptions] Module import:');
assert(typeof useAsyncOptions === 'function', 'useAsyncOptions là function');

// ----------------------------------------------------------------------
// Test logic race-condition pattern (mô phỏng requestIdRef)
// ----------------------------------------------------------------------

console.log('\n[race-condition pattern] Request cũ về sau request mới bị bỏ qua:');
{
  let requestIdRef = 0;
  const results: string[] = [];

  const simulateRequest = (id: string, delay: number) => {
    const requestId = ++requestIdRef;
    setTimeout(() => {
      if (requestId !== requestIdRef) return; // bỏ qua response cũ
      results.push(id);
    }, delay);
  };

  // Request 1 chậm (200ms), request 2 nhanh (50ms) — request 2 phải thắng
  simulateRequest('slow-first', 200);
  simulateRequest('fast-second', 50);

  await new Promise((resolve) => setTimeout(resolve, 300));
  assert(results.length === 1, 'chỉ nhận 1 kết quả');
  assert(results[0] === 'fast-second', 'request mới nhất thắng (bỏ qua response cũ)');
}

console.log('\n[debounce pattern] Chỉ gọi 1 lần sau khoảng debounce:');
{
  let callCount = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debouncedFetch = (debounceTime: number) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callCount += 1;
    }, debounceTime);
  };

  // Gõ nhanh 5 lần liên tiếp
  debouncedFetch(50);
  debouncedFetch(50);
  debouncedFetch(50);
  debouncedFetch(50);
  debouncedFetch(50);

  await new Promise((resolve) => setTimeout(resolve, 120));
  assert(callCount === 1, 'chỉ fetch 1 lần sau 5 lần trigger liên tiếp');
}

// ----------------------------------------------------------------------
// Tổng kết
// ----------------------------------------------------------------------

console.log(`\n${'='.repeat(50)}`);
console.log(`Kết quả: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
}

main();
