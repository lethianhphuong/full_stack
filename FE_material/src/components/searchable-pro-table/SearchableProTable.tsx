import { memo, useCallback, useEffect, useId, useImperativeHandle, useMemo, useState } from 'react';
import { FormProvider as RHFFormProvider, useForm } from 'react-hook-form';
import type { DefaultValues, FieldValues } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import type {
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_RowData,
  MRT_SortingState,
} from 'material-react-table';
import { DataTable } from '@/atoms';
import Iconify from '@/components/iconify';
import QuickSearch from './QuickSearch';
import type { SearchableProTableProps } from './types';

const mergeSx = (theme: any, sxProp: any): Record<string, any> => {
  if (!sxProp) return {};
  if (typeof sxProp === 'function') return sxProp(theme) ?? {};
  if (Array.isArray(sxProp)) {
    return sxProp.reduce((acc, item) => Object.assign(acc, mergeSx(theme, item)), {});
  }
  if (typeof sxProp === 'object') return sxProp;
  return {};
};

function SearchableProTable<TData extends MRT_RowData, TFilters extends FieldValues = Record<string, never>>({
  columns,
  request,
  getRowId,
  ref,
  defaultPageSize = 10,
  showSTT = true,
  sttConfig,
  enableColumnTooltip = true,
  quickSearchPlaceholder,
  hideQuickSearch = false,
  onQuickSearch,
  advancedSearchForm,
  initialAdvancedFilters,
  advancedSearchTitle = 'Tìm kiếm nâng cao',
  defaultShowAdvanced = false,
  onAdvancedSearch,
  onAdvancedReset,
  toolbarActions,
  advancedActions,
  emptyMessage = 'Không có dữ liệu phù hợp',
  minTableHeight = 360,
  tableProps,
}: SearchableProTableProps<TData, TFilters>) {
  const advancedId = useId();
  const [rows, setRows] = useState<TData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<MRT_PaginationState>({ pageIndex: 0, pageSize: defaultPageSize });
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [keywords, setKeywords] = useState<string[]>([]);
  const methods = useForm<TFilters>({
    defaultValues: (initialAdvancedFilters ?? {}) as DefaultValues<TFilters>,
    shouldUnregister: false,
  });
  const [appliedAdvanced, setAppliedAdvanced] = useState<TFilters | null>((initialAdvancedFilters as TFilters) ?? null);
  const [advancedOpen, setAdvancedOpen] = useState(defaultShowAdvanced);
  const resolvedMinHeight = advancedOpen ? 0 : minTableHeight;
  const [reloadKey, setReloadKey] = useState(0);

  const resetAdvanced = useCallback(() => {
    setRows([]);
    setLoading(true);
    methods.reset((initialAdvancedFilters ?? {}) as DefaultValues<TFilters>);
    setAppliedAdvanced((initialAdvancedFilters as TFilters) ?? null);
    setPagination((value) => ({ ...value, pageIndex: 0 }));
    setRowSelection({});
    setReloadKey((value) => value + 1);
    onAdvancedReset?.();
  }, [initialAdvancedFilters, methods, onAdvancedReset]);

  useEffect(() => {
    const controller = new AbortController();
    let current = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      setRows([]);
      try {
        const result = await request({
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          keywords,
          advancedFilters: appliedAdvanced,
          sorting,
          columnFilters,
          signal: controller.signal,
        });
        if (!current) return;
        if (result.success === false) throw new Error('Không thể tải dữ liệu bảng.');
        setRows(result.data);
        setTotal(result.total);
      } catch {
        if (!current) return;
        setRows([]);
        setTotal(0);
        setError('Không thể tải dữ liệu bảng. Vui lòng thử lại.');
      } finally {
        if (current) setLoading(false);
      }
    };

    void load();
    return () => {
      current = false;
      controller.abort();
    };
  }, [request, pagination, keywords, appliedAdvanced, sorting, columnFilters, reloadKey]);

  useImperativeHandle(ref, () => ({
    reload: () => setReloadKey((value) => value + 1),
    resetPage: () => {
      setRows([]);
      setLoading(true);
      if (pagination.pageIndex === 0) setReloadKey((value) => value + 1);
      else setPagination((value) => ({ ...value, pageIndex: 0 }));
    },
    getSelected: () => {
      const selected = rows.map((row, index) => ({ row, key: getRowId?.(row) ?? String(index) }))
        .filter(({ key }) => rowSelection[key]);
      return { keys: selected.map(({ key }) => key), rows: selected.map(({ row }) => row) };
    },
    clearSelection: () => setRowSelection({}),
    getAdvancedForm: () => methods,
    getAdvancedDraft: () => methods.getValues(),
    getAdvancedFilters: () => appliedAdvanced,
    resetAdvanced,
  }), [getRowId, methods, appliedAdvanced, pagination.pageIndex, resetAdvanced, rowSelection, rows]);

  const displayColumns = useMemo<MRT_ColumnDef<TData>[]>(() => {
    const sttAlign = sttConfig?.align ?? 'center';
    const rawColumns: MRT_ColumnDef<TData>[] = (!showSTT || columns.some((column) => column.id === '__searchableProTableStt' || column.header === 'STT'))
      ? columns
      : [
        {
          id: '__searchableProTableStt',
          header: sttConfig?.header ?? 'STT',
          size: sttConfig?.size ?? 80,
          minSize: 60,
          maxSize: 100,
          enableSorting: false,
          enableColumnFilter: false,
          enableColumnActions: false,
          enableResizing: false,
          enableHiding: false,
          muiTableHeadCellProps: {
            align: sttAlign,
            sx: (theme: any) => ({
              bgcolor: alpha(theme.palette.grey[500], 0.08),
              fontWeight: 600,
              textAlign: sttAlign,
              '& .Mui-TableHeadCell-Content': {
                justifyContent: sttAlign === 'center' ? 'center' : sttAlign === 'right' ? 'flex-end' : 'flex-start',
                width: '100%',
              },
              '& .Mui-TableHeadCell-Content-Wrapper': {
                textAlign: sttAlign,
                width: '100%',
              },
              '& .Mui-TableHeadCell-Content-Actions': {
                display: 'none !important',
              },
            }),
          },
          muiTableBodyCellProps: {
            align: sttAlign,
            sx: {
              textAlign: sttAlign,
            },
          },
          Cell: ({ row }) => (
            <Box sx={{ textAlign: sttAlign, width: '100%' }}>
              {pagination.pageIndex * pagination.pageSize + row.index + 1}
            </Box>
          ),
        },
        ...columns,
      ];

    return rawColumns.map((col) => {
      const decoratedCol: MRT_ColumnDef<TData> = { ...col };
      const isStt = col.id === '__searchableProTableStt';
      const isGrow = Boolean(col.grow);
      const minSizeVal = typeof col.minSize === 'number' ? col.minSize : undefined;
      const minSizeCss = minSizeVal ? `${minSizeVal}px` : undefined;

      if (isGrow) {
        const originalHeadProps = col.muiTableHeadCellProps;
        const originalBodyProps = col.muiTableBodyCellProps;
        decoratedCol.grow = true;
        decoratedCol.size = minSizeVal ?? (typeof col.size === 'number' ? col.size : 0);
        decoratedCol.minSize = minSizeVal ?? 0;

        decoratedCol.muiTableHeadCellProps = (cellParams) => {
          const userProps = typeof originalHeadProps === 'function' ? originalHeadProps(cellParams) : originalHeadProps;
          return {
            ...userProps,
            style: {
              ...userProps?.style,
              width: 'auto',
              minWidth: minSizeCss ?? 0,
            },
            sx: (theme: any) => ({
              ...mergeSx(theme, userProps?.sx),
              width: 'auto !important',
              minWidth: `${minSizeCss ?? '0px'} !important`,
            }),
          };
        };

        decoratedCol.muiTableBodyCellProps = (cellParams) => {
          const userProps = typeof originalBodyProps === 'function' ? originalBodyProps(cellParams) : originalBodyProps;
          return {
            ...userProps,
            style: {
              ...userProps?.style,
              width: 'auto',
              minWidth: minSizeCss ?? 0,
            },
            sx: (theme: any) => ({
              ...mergeSx(theme, userProps?.sx),
              width: 'auto !important',
              minWidth: `${minSizeCss ?? '0px'} !important`,
            }),
          };
        };
      } else if (minSizeVal) {
        const originalHeadProps = col.muiTableHeadCellProps;
        const originalBodyProps = col.muiTableBodyCellProps;

        decoratedCol.muiTableHeadCellProps = (cellParams) => {
          const userProps = typeof originalHeadProps === 'function' ? originalHeadProps(cellParams) : originalHeadProps;
          return {
            ...userProps,
            style: {
              ...userProps?.style,
              minWidth: minSizeCss,
            },
            sx: (theme: any) => ({
              ...mergeSx(theme, userProps?.sx),
              minWidth: `${minSizeCss} !important`,
            }),
          };
        };

        decoratedCol.muiTableBodyCellProps = (cellParams) => {
          const userProps = typeof originalBodyProps === 'function' ? originalBodyProps(cellParams) : originalBodyProps;
          return {
            ...userProps,
            style: {
              ...userProps?.style,
              minWidth: minSizeCss,
            },
            sx: (theme: any) => ({
              ...mergeSx(theme, userProps?.sx),
              minWidth: `${minSizeCss} !important`,
            }),
          };
        };
      }

      if (enableColumnTooltip && col.enableTooltip !== false) {
        if (!col.Header && typeof col.header === 'string' && col.header.trim() !== '') {
          const headerText = col.header;
          decoratedCol.Header = () => (
            isStt ? (
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: '100%',
                  textAlign: sttAlign,
                  fontWeight: 600,
                  verticalAlign: 'middle',
                }}
              >
                {headerText}
              </Box>
            ) : (
              <Tooltip title={headerText} arrow placement="top" disableInteractive enterDelay={300}>
                <Box
                  component="span"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                    maxWidth: '100%',
                    verticalAlign: 'middle',
                  }}
                >
                  {headerText}
                </Box>
              </Tooltip>
            )
          );
        }

        if (!isStt) {
          const originalCell = col.Cell;
          decoratedCol.Cell = (cellProps) => {
            const rendered = originalCell ? originalCell(cellProps) : cellProps.renderedCellValue;
            if (rendered == null || rendered === '') return null;

            let tooltipTitle: string | undefined;
            const rawValue = cellProps.cell.getValue();
            if (typeof rawValue === 'string' || typeof rawValue === 'number') {
              tooltipTitle = String(rawValue);
            } else if (typeof rendered === 'string' || typeof rendered === 'number') {
              tooltipTitle = String(rendered);
            }

            if (!tooltipTitle) return rendered;

            return (
              <Tooltip title={tooltipTitle} arrow placement="top-start" disableInteractive enterDelay={300}>
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                  }}
                >
                  {rendered}
                </Box>
              </Tooltip>
            );
          };
        }
      }

      return decoratedCol;
    });
  }, [columns, enableColumnTooltip, pagination.pageIndex, pagination.pageSize, showSTT, sttConfig]);

  const calculatedTableMinWidth = useMemo(() => {
    let total = 0;
    for (const col of displayColumns) {
      const isGrow = Boolean(col.grow);
      if (isGrow) {
        const minW = typeof col.minSize === 'number' ? col.minSize : (typeof col.size === 'number' ? col.size : 0);
        total += minW;
      } else {
        const w = typeof col.size === 'number'
          ? col.size
          : (typeof col.minSize === 'number' ? col.minSize : 150);
        total += w;
      }
    }
    if (tableProps?.enableRowActions) {
      const actionsSize = (tableProps?.displayColumnDefOptions as any)?.['mrt-row-actions']?.size ?? 80;
      total += actionsSize;
    }
    return total;
  }, [displayColumns, tableProps?.displayColumnDefOptions, tableProps?.enableRowActions]);

  const handleKeywordsChange = (next: string[]) => {
    setRows([]);
    setLoading(true);
    setKeywords(next);
    setPagination((value) => ({ ...value, pageIndex: 0 }));
    setRowSelection({});
    onQuickSearch?.(next);
  };

  const handleAdvancedSearch = async (formValues: TFilters) => {
    try {
      const converted = await onAdvancedSearch?.(formValues);
      const finalFilters = converted == null ? formValues : converted;
      setError(null);
      setRows([]);
      setLoading(true);
      setAppliedAdvanced(finalFilters);
      setPagination((value) => ({ ...value, pageIndex: 0 }));
      setRowSelection({});
      setReloadKey((value) => value + 1);
    } catch {
      setError('Không thể áp dụng bộ lọc. Vui lòng thử lại.');
    }
  };

  return (
    <Stack
      spacing={1.5}
      sx={{
        width: '100%',
        height: '100%',
        minWidth: 0,
        minHeight: 0,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {!advancedOpen && (
        <Card
          variant="outlined"
          sx={{
            flexShrink: 0,
            p: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            bgcolor: 'background.paper',
            borderColor: 'divider',
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
            spacing={1.5}
            sx={{ minWidth: 0 }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              spacing={1.5}
              sx={{ minWidth: 0 }}
            >
              {!hideQuickSearch && (
                <QuickSearch keywords={keywords} onChange={handleKeywordsChange} placeholder={quickSearchPlaceholder} />
              )}

            </Stack>

            <Stack
              direction="row"
              flexWrap="wrap"
              alignItems="center"
              justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
              gap={1}
              sx={{ flexShrink: 0, ml: { sm: 'auto' } }}
            >
              {toolbarActions}
              <Button
                color="inherit"
                variant="outlined"
                startIcon={<Iconify icon="solar:restart-bold" width={18} />}
                onClick={() => setReloadKey((value) => value + 1)}
                disabled={loading}
              >
                Làm mới
              </Button>
              {advancedSearchForm && (
                <Button
                  color="inherit"
                  variant="outlined"
                  startIcon={<Iconify icon="solar:filter-bold-duotone" width={18} sx={{ color: 'primary.main' }} />}
                  onClick={() => setAdvancedOpen(true)}
                  aria-expanded={false}
                  aria-controls={advancedId}
                  sx={{ flexShrink: 0 }}
                >
                  {advancedSearchTitle}
                </Button>
              )}
            </Stack>
          </Stack>
        </Card>
      )}

      {advancedSearchForm && (
        <Collapse in={advancedOpen} unmountOnExit id={advancedId} sx={{ flexShrink: 0 }}>
          <Card
            variant="outlined"
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: 2,
              bgcolor: 'background.paper',
              borderColor: 'divider',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ pb: 1.5 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:filter-bold-duotone" width={22} sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {advancedSearchTitle}
                </Typography>
              </Stack>
              <Button
                type="button"
                color="inherit"
                variant="text"
                size="small"
                startIcon={<Iconify icon="solar:alt-arrow-up-bold" width={16} />}
                onClick={() => setAdvancedOpen(false)}
                aria-expanded={true}
                aria-controls={advancedId}
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
              >
                Thu gọn
              </Button>
            </Stack>

            <RHFFormProvider {...methods}>
              <Box component="form" onSubmit={methods.handleSubmit(handleAdvancedSearch)}>
                <Box sx={{ pb: 2 }}>
                  {advancedSearchForm}
                </Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  flexWrap="wrap"
                  gap={1}
                  sx={{ minWidth: 0 }}
                >
                  <Button
                    type="button"
                    color="inherit"
                    variant="outlined"
                    startIcon={<Iconify icon="solar:restart-bold" width={18} />}
                    onClick={resetAdvanced}
                    disabled={methods.formState.isSubmitting}
                  >
                    Làm mới
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    loading={methods.formState.isSubmitting}
                    startIcon={<Iconify icon="solar:magnifer-bold-duotone" width={18} />}
                  >
                    Tìm kiếm
                  </Button>
                  {toolbarActions}
                  {advancedActions}
                </Stack>
              </Box>
            </RHFFormProvider>
          </Card>
        </Collapse>
      )}

      {error && <Alert severity="error" sx={{ flexShrink: 0 }} action={<Button color="inherit" size="small" onClick={() => setReloadKey((value) => value + 1)}>Thử lại</Button>}>{error}</Alert>}

      <Box
        sx={{
          flex: '1 1 0px',
          minHeight: resolvedMinHeight,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          '& > div': {
            flex: '1 1 0px',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
          },
        }}
      >
        <DataTable
          layoutMode={tableProps?.layoutMode ?? 'semantic'}
          height="100%"
          stickyHeader
          {...tableProps}
          getRowId={getRowId}
          columns={displayColumns}
          data={rows}
          loading={loading}
          emptyMessage={emptyMessage}
          manualPagination
          manualSorting
          manualFiltering
          enableGlobalFilter={false}
          rowCount={total}
          onPaginationChange={(updater) => {
            setRows([]);
            setLoading(true);
            setPagination(updater);
            setRowSelection({});
          }}
          onSortingChange={(updater) => {
            setRows([]);
            setLoading(true);
            setSorting(updater);
            setPagination((value) => ({ ...value, pageIndex: 0 }));
            setRowSelection({});
          }}
          onColumnFiltersChange={(updater) => {
            setRows([]);
            setLoading(true);
            setColumnFilters(updater);
            setPagination((value) => ({ ...value, pageIndex: 0 }));
            setRowSelection({});
          }}
          onRowSelectionChange={setRowSelection}
          state={{ pagination, sorting, columnFilters, rowSelection, isLoading: loading, showProgressBars: loading }}
          muiTablePaperProps={(params) => {
            const userPaperProps = typeof tableProps?.muiTablePaperProps === 'function'
              ? tableProps.muiTablePaperProps(params)
              : tableProps?.muiTablePaperProps;
            return {
              elevation: 0,
              ...userPaperProps,
              sx: ((theme: any) => ({
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
                display: 'flex',
                flexDirection: 'column',
                flex: '1 1 0px',
                minHeight: resolvedMinHeight,
                height: '100%',
                width: '100%',
                maxWidth: '100%',
                minWidth: 0,
                overflow: 'hidden',
                '& [data-column-id="mrt-row-spacer"], & th[data-index="mrt-row-spacer"], & td[data-index="mrt-row-spacer"], & .MuiTableCell-root[data-index="mrt-row-spacer"]': {
                  display: 'none !important',
                  width: '0 !important',
                  minWidth: '0 !important',
                  flex: '0 0 0 !important',
                  padding: '0 !important',
                  border: 'none !important',
                },
                '& .MuiTableHead-root .MuiTableCell-root': {
                  bgcolor: alpha(theme.palette.grey[500], 0.08),
                  fontWeight: 600,
                },
                ...mergeSx(theme, userPaperProps?.sx),
              })) as any,
            };
          }}
          muiTableContainerProps={(params) => {
            const userContainerProps = typeof tableProps?.muiTableContainerProps === 'function'
              ? tableProps.muiTableContainerProps(params)
              : tableProps?.muiTableContainerProps;
            return {
              ...userContainerProps,
              style: {
                maxHeight: '100%',
                width: '100%',
                overflowX: 'auto',
                ...userContainerProps?.style,
              },
              sx: ((theme: any) => ({
                flex: '1 1 0px',
                minHeight: 0,
                maxHeight: '100%',
                width: '100%',
                maxWidth: '100%',
                minWidth: 0,
                overflowY: 'auto',
                overflowX: 'auto',
                ...mergeSx(theme, userContainerProps?.sx),
              })) as any,
            };
          }}
          muiTableProps={(params) => {
            const userTableProps = typeof tableProps?.muiTableProps === 'function'
              ? tableProps.muiTableProps(params)
              : tableProps?.muiTableProps;
            return {
              ...userTableProps,
              sx: ((theme: any) => ({
                width: '100% !important',
                minWidth: calculatedTableMinWidth > 0 ? `${calculatedTableMinWidth}px !important` : '100% !important',
                tableLayout: 'fixed !important',
                ...mergeSx(theme, userTableProps?.sx),
              })) as any,
            };
          }}
          muiBottomToolbarProps={(params) => {
            const userToolbarProps = typeof tableProps?.muiBottomToolbarProps === 'function'
              ? tableProps.muiBottomToolbarProps(params)
              : tableProps?.muiBottomToolbarProps;
            return {
              ...userToolbarProps,
              sx: ((theme: any) => ({
                flexShrink: 0,
                ...mergeSx(theme, userToolbarProps?.sx),
              })) as any,
            };
          }}
        />
      </Box>
    </Stack>
  );
}

export default memo(SearchableProTable) as typeof SearchableProTable;
