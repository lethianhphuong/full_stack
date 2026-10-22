import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BaseSelect, BaseSwitch, BaseTextField, Iconify } from '@/components';
import {
  DEFAULT_ADDRESS_CONFIGS,
  DEFAULT_COUNTRY_OPTIONS,
  DEFAULT_EMPTY_ADDRESS,
  DEFAULT_PROVINCE_OPTIONS,
  DEFAULT_WARD_OPTIONS,
} from './constants';
import type { AddressFieldConfig, AddressSectionProps, AddressValue } from './types';

export default function AddressSection({
  namePrefix = 'addresses',
  previousNamePrefix = 'previousAddresses',
  hasPreviousSwitchName = 'hasPreviousAddresses',
  showPreviousSwitch = true,
  previousSwitchLabel = 'Địa chỉ trước khi sáp nhập địa giới hành chính',
  previousTagLabel = 'Trước đây là:',
  addressConfigs = DEFAULT_ADDRESS_CONFIGS,
  labels,
  showCopyButton = true,
  showStreet = true,
  showWard = true,
  showProvince = true,
  showCountry = true,
  streetPlaceholder = 'Số nhà, đường, thôn/xóm',
  previousStreetPlaceholder,
  wardOptions = DEFAULT_WARD_OPTIONS,
  provinceOptions = DEFAULT_PROVINCE_OPTIONS,
  countryOptions = DEFAULT_COUNTRY_OPTIONS,
  size = 'small',
  disabled = false,
  sideFields,
  spacing = 2.5,
}: AddressSectionProps) {
  const { control, getValues, setValue } = useFormContext();
  const { enqueueSnackbar } = useSnackbar();

  const showPrevious = useWatch({
    control,
    name: hasPreviousSwitchName,
    defaultValue: false,
  });

  const normalizedConfigs = useMemo<AddressFieldConfig[]>(() => {
    return addressConfigs.map((item) => {
      if (typeof item === 'string') {
        const fallback = DEFAULT_ADDRESS_CONFIGS.find((d) => d.key === item);
        return {
          key: item,
          label: labels?.[item] ?? fallback?.label ?? item,
        };
      }
      return {
        ...item,
        label: labels?.[item.key] ?? item.label,
      };
    });
  }, [addressConfigs, labels]);

  const copyAddress = (fromKey: string, toKey: string, label: string) => {
    const fromPath = namePrefix ? `${namePrefix}.${fromKey}` : fromKey;
    const toPath = namePrefix ? `${namePrefix}.${toKey}` : toKey;
    const sourceVal = getValues(fromPath) as AddressValue | undefined;

    if (sourceVal) {
      setValue(toPath, { ...sourceVal }, { shouldDirty: true, shouldValidate: true });
    }

    if (showPrevious) {
      const fromPrevPath = previousNamePrefix ? `${previousNamePrefix}.${fromKey}` : fromKey;
      const toPrevPath = previousNamePrefix ? `${previousNamePrefix}.${toKey}` : toKey;
      const sourcePrevVal = getValues(fromPrevPath) as AddressValue | undefined;
      if (sourcePrevVal) {
        setValue(toPrevPath, { ...sourcePrevVal }, { shouldDirty: true, shouldValidate: true });
      }
    }

    enqueueSnackbar(`Đã sao chép từ ${label}`, { variant: 'info' });
  };

  const handleTogglePrevious = (checked: boolean) => {
    setValue(hasPreviousSwitchName, checked, { shouldDirty: true });
    if (!checked) {
      normalizedConfigs.forEach((cfg) => {
        const path = previousNamePrefix ? `${previousNamePrefix}.${cfg.key}` : cfg.key;
        setValue(path, { ...DEFAULT_EMPTY_ADDRESS }, { shouldDirty: true });
      });
    }
  };

  const getFieldPath = (prefix: string, key: string, field: keyof AddressValue) => {
    return prefix ? `${prefix}.${key}.${field}` : `${key}.${field}`;
  };

  const addressInputs = (
    <Stack spacing={spacing}>
      {normalizedConfigs.map((item, index) => {
        const prevKey = index > 0 ? normalizedConfigs[index - 1].key : null;
        const prevLabel = index > 0 ? normalizedConfigs[index - 1].label : '';

        return (
          <Stack key={item.key} spacing={1.5}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2">
                {item.label}
                {item.required && <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>}
              </Typography>
              {showCopyButton && index > 0 && prevKey && (
                <Button
                  size="small"
                  disabled={disabled}
                  startIcon={<Iconify icon="solar:copy-bold" />}
                  onClick={() => copyAddress(prevKey, item.key, prevLabel)}
                >
                  Sao chép địa chỉ trên
                </Button>
              )}
            </Stack>

            <Grid container spacing={1.5}>
              {showStreet && (
                <Grid size={{ xs: 12, sm: showCountry ? 5 : 6 }}>
                  <BaseTextField
                    size={size}
                    disabled={disabled}
                    name={getFieldPath(namePrefix, item.key, 'street')}
                    label="Số nhà, đường, thôn/xóm"
                    placeholder={streetPlaceholder}
                  />
                </Grid>
              )}
              {showWard && (
                <Grid size={{ xs: 12, sm: 2 }}>
                  <BaseSelect
                    size={size}
                    disabled={disabled}
                    name={getFieldPath(namePrefix, item.key, 'ward')}
                    label="Phường/Xã"
                    options={wardOptions}
                  />
                </Grid>
              )}
              {showProvince && (
                <Grid size={{ xs: 12, sm: showCountry ? 3 : 4 }}>
                  <BaseSelect
                    size={size}
                    disabled={disabled}
                    name={getFieldPath(namePrefix, item.key, 'province')}
                    label="Tỉnh/TP"
                    options={provinceOptions}
                  />
                </Grid>
              )}
              {showCountry && (
                <Grid size={{ xs: 12, sm: 2 }}>
                  <BaseSelect
                    size={size}
                    disabled={disabled}
                    name={getFieldPath(namePrefix, item.key, 'country')}
                    label="Quốc gia"
                    options={countryOptions}
                  />
                </Grid>
              )}
            </Grid>

            {showPreviousSwitch && showPrevious && (
              <>
                <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
                  {previousTagLabel}
                </Typography>
                <Grid container spacing={1.5}>
                  {showStreet && (
                    <Grid size={{ xs: 12, sm: showCountry ? 5 : 6 }}>
                      <BaseTextField
                        size={size}
                        disabled={disabled}
                        name={getFieldPath(previousNamePrefix, item.key, 'street')}
                        label="Số nhà, đường, thôn/xóm"
                        placeholder={previousStreetPlaceholder ?? `${item.label} (trước sáp nhập)`}
                      />
                    </Grid>
                  )}
                  {showWard && (
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <BaseSelect
                        size={size}
                        disabled={disabled}
                        name={getFieldPath(previousNamePrefix, item.key, 'ward')}
                        label="Phường/Xã"
                        options={wardOptions}
                      />
                    </Grid>
                  )}
                  {showProvince && (
                    <Grid size={{ xs: 12, sm: showCountry ? 3 : 4 }}>
                      <BaseSelect
                        size={size}
                        disabled={disabled}
                        name={getFieldPath(previousNamePrefix, item.key, 'province')}
                        label="Tỉnh/TP"
                        options={provinceOptions}
                      />
                    </Grid>
                  )}
                  {showCountry && (
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <BaseSelect
                        size={size}
                        disabled={disabled}
                        name={getFieldPath(previousNamePrefix, item.key, 'country')}
                        label="Quốc gia"
                        options={countryOptions}
                      />
                    </Grid>
                  )}
                </Grid>
              </>
            )}

            {index < normalizedConfigs.length - 1 && <Divider />}
          </Stack>
        );
      })}
    </Stack>
  );

  return (
    <Stack spacing={3}>
      {showPreviousSwitch && (
        <BaseSwitch
          name={hasPreviousSwitchName}
          label={previousSwitchLabel}
          disabled={disabled}
          onChange={(event) => handleTogglePrevious(event.target.checked)}
        />
      )}

      {sideFields ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 9 }}>{addressInputs}</Grid>
          <Grid size={{ xs: 12, lg: 3 }}>{sideFields}</Grid>
        </Grid>
      ) : (
        addressInputs
      )}
    </Stack>
  );
}
