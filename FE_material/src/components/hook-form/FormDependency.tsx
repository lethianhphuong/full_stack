import type { ReactNode } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

type Props = {
  /** Danh sách tên field cần theo dõi */
  watch: string[];
  /** Render-prop nhận giá trị các field đang watch */
  children: (values: Record<string, unknown>) => ReactNode;
};

/**
 * FormDependency — tương đương ProFormDependency của Ant Design Pro.
 * Chỉ re-render khi giá trị được watch thay đổi (dùng useWatch để tối ưu).
 *
 * @example
 * <FormDependency watch={['role']}>
 *   {({ role }) => role === 'admin' && <BaseTextField name="permission" label="Quyền đặc biệt" />}
 * </FormDependency>
 */
export default function FormDependency({ watch, children }: Props) {
  const { control } = useFormContext();
  const values = useWatch({ control, name: watch as never });

  const result: Record<string, unknown> = {};
  watch.forEach((name, index) => {
    result[name] = Array.isArray(values) ? values[index] : values;
  });

  return <>{children(result)}</>;
}
