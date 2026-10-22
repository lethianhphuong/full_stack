import type { ReactNode } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Iconify } from '@/components';

// ----------------------------------------------------------------------

type Props = {
  /** Tên field array trong form */
  name: string;
  /** Tiêu đề danh sách */
  label?: string;
  /** Render nội dung mỗi item — dùng field name dạng `${name}.${index}.xxx` */
  renderItem: (index: number) => ReactNode;
  /** Giá trị mặc định khi thêm item mới */
  defaultItemValue?: Record<string, unknown>;
  /** Số item tối đa */
  maxItems?: number;
  /** Số item tối thiểu (không cho xóa dưới mức này) */
  minItems?: number;
};

/**
 * BaseFormList — tương đương ProFormList của Ant Design Pro.
 * Wrap useFieldArray của RHF: thêm / xóa / nhân bản item.
 *
 * @example
 * <BaseFormList
 *   name="addresses"
 *   label="Địa chỉ"
 *   defaultItemValue={{ city: '', street: '' }}
 *   renderItem={(index) => (
 *     <>
 *       <BaseTextField name={`addresses.${index}.city`} label="Thành phố" />
 *       <BaseTextField name={`addresses.${index}.street`} label="Đường" />
 *     </>
 *   )}
 * />
 */
export default function BaseFormList({
  name,
  label,
  renderItem,
  defaultItemValue = {},
  maxItems,
  minItems = 0,
}: Props) {
  const { control } = useFormContext();
  const { fields, append, remove, insert } = useFieldArray({ control, name: name as never });

  const canAdd = !maxItems || fields.length < maxItems;
  const canRemove = fields.length > minItems;

  return (
    <Stack spacing={1.5}>
      {label && <Typography variant="subtitle2">{label}</Typography>}

      {fields.map((field, index) => (
        <Card key={field.id} variant="outlined" sx={{ p: 2, position: 'relative' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              #{index + 1}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              {/* Nhân bản */}
              {canAdd && (
                <IconButton
                  size="small"
                  aria-label="Nhân bản"
                  onClick={() => {
                    const current = fields[index] as Record<string, unknown>;
                    const { id, ...values } = current;
                    insert(index + 1, values);
                  }}
                >
                  <Iconify icon="solar:copy-bold-duotone" width={18} />
                </IconButton>
              )}
              {/* Xóa */}
              {canRemove && (
                <IconButton size="small" aria-label="Xóa" onClick={() => remove(index)}>
                  <Iconify icon="solar:trash-bin-trash-bold" width={18} sx={{ color: 'error.main' }} />
                </IconButton>
              )}
            </Stack>
          </Stack>
          <Stack spacing={2}>{renderItem(index)}</Stack>
        </Card>
      ))}

      {canAdd && (
        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:add-circle-bold" width={18} />}
          onClick={() => append(defaultItemValue)}
          sx={{ alignSelf: 'flex-start' }}
        >
          Thêm mục
        </Button>
      )}
    </Stack>
  );
}
