import { useCallback, useEffect, useRef, useState } from 'react';
import type { BaseOption } from './types';

// ----------------------------------------------------------------------

type AsyncOptionsConfig = {
  /** Thời gian debounce (ms) */
  debounceTime?: number;
  /** Tham số truyền vào request — thay đổi sẽ tự fetch lại */
  params?: Record<string, unknown>;
  /** Bật/tắt fetch tự động (mặc định true) */
  enabled?: boolean;
};

type AsyncOptionsResult = {
  options: BaseOption[];
  loading: boolean;
  error: Error | null;
  /** Gọi lại request ngay lập tức */
  reload: () => void;
};

/**
 * Hook fetch options từ API — tương đương prop `request` của Ant Design Pro.
 *
 * - Debounce bằng setTimeout + cleanup (không cần thư viện ngoài)
 * - Abort request cũ khi unmount hoặc params đổi (tránh race condition)
 *
 * @example
 * const { options, loading } = useAsyncOptions(
 *   async (params) => fetchUsers(params?.keyword),
 *   { params: { keyword } }
 * );
 */
export function useAsyncOptions(
  request?: (params?: Record<string, unknown>) => Promise<BaseOption[]>,
  { debounceTime = 300, params, enabled = true }: AsyncOptionsConfig = {}
): AsyncOptionsResult {
  const [options, setOptions] = useState<BaseOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Đếm số request để loại bỏ response cũ (race condition)
  const requestIdRef = useRef(0);
  const paramsKey = JSON.stringify(params ?? {});

  const doFetch = useCallback(() => {
    if (!request) return;

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    request(params)
      .then((result) => {
        // Chỉ nhận kết quả của request mới nhất
        if (requestId !== requestIdRef.current) return;
        setOptions(result ?? []);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (requestId !== requestIdRef.current) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request, paramsKey]);

  useEffect(() => {
    if (!enabled || !request) return;

    const timer = setTimeout(doFetch, debounceTime);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doFetch, debounceTime, enabled]);

  // Abort khi unmount: tăng requestId để response về sau bị bỏ qua
  useEffect(() => () => {
    requestIdRef.current += 1;
  }, []);

  return { options, loading, error, reload: doFetch };
}
