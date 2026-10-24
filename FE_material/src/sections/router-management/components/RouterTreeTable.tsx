import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Scrollbar from '@/components/scrollbar';
import RouterSubheaderBanner from './RouterSubheaderBanner';
import RouterTreeRow from './RouterTreeRow';
import type { ManagedRoute, RouterRowItem, SubheaderSection } from '../types';

interface RouterTreeTableProps {
  sections: SubheaderSection[];
  collapsedMap: Record<string, boolean>;
  onToggleCollapse: (id: string) => void;
  onAddChild: (item: RouterRowItem) => void;
  onEdit: (item: RouterRowItem) => void;
  onMove: (item: RouterRowItem) => void;
  onMoveSibling: (item: RouterRowItem, offset: -1 | 1) => void;
  onDelete: (item: RouterRowItem) => void;
  onMoveSection?: (sectionTitle: string, offset: -1 | 1) => void;
  onRenameSection?: (oldTitle: string, newTitle: string) => boolean | void;
  onSaveInlineRow?: (id: string, updates: Partial<ManagedRoute>) => boolean | void;
}

export default function RouterTreeTable({
  sections,
  collapsedMap,
  onToggleCollapse,
  onAddChild,
  onEdit,
  onMove,
  onMoveSibling,
  onDelete,
  onMoveSection,
  onRenameSection,
  onSaveInlineRow,
}: RouterTreeTableProps) {
  const theme = useTheme();
  const allSubheaderTitles = React.useMemo(() => sections.map((s) => s.title), [sections]);

  const existingPaths = React.useMemo(() => {
    const paths = new Set<string>();
    const collect = (items: RouterRowItem[]) => {
      items.forEach((item) => {
        paths.add(item.path.replace(/^\/+/, ''));
        if (item.children) collect(item.children);
      });
    };
    sections.forEach((s) => collect(s.items));
    return paths;
  }, [sections]);

  // Recursive render for row and its children
  const renderItemAndChildren = (item: RouterRowItem): React.ReactNode => {
    const isCollapsed = Boolean(collapsedMap[item.id]);

    return (
      <React.Fragment key={item.id}>
        <RouterTreeRow
          item={item}
          isCollapsed={isCollapsed}
          existingPaths={existingPaths}
          onToggleCollapse={onToggleCollapse}
          onAddChild={onAddChild}
          onEdit={onEdit}
          onMove={onMove}
          onMoveSibling={onMoveSibling}
          onDelete={onDelete}
          onSaveInline={onSaveInlineRow}
        />
        {!isCollapsed &&
          item.children &&
          item.children.map((child) => renderItemAndChildren(child))}
      </React.Fragment>
    );
  };

  return (
    <TableContainer component={Scrollbar} sx={{ maxHeight: 'calc(100vh - 280px)' }}>
      <Table stickyHeader size="small" sx={{ minWidth: 1080 }}>
        <TableHead>
          <TableRow
            sx={{
              '& th': {
                backgroundColor: 'background.neutral',
                color: 'text.secondary',
                fontWeight: 700,
                fontSize: 12,
                borderBottom: `1px solid ${theme.palette.divider}`,
                py: 1.5,
                px: 1.5,
              },
            }}
          >
            <TableCell sx={{ minWidth: 260 }}>Cấu trúc cây menu & tiêu đề</TableCell>
            <TableCell sx={{ width: 170 }}>Icon</TableCell>
            <TableCell sx={{ minWidth: 140 }}>Đường dẫn route (Path)</TableCell>
            <TableCell sx={{ minWidth: 170 }}>Thuộc tính</TableCell>
            <TableCell align="right" sx={{ width: 210 }}>Thao tác</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sections.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                <Typography variant="subtitle2">Không tìm thấy route phù hợp</Typography>
                <Typography variant="body2" color="text.secondary">
                  Hãy thay đổi từ khóa hoặc đặt lại bộ lọc.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            sections.map((section, sIdx) => (
              <React.Fragment key={section.id}>
                <RouterSubheaderBanner
                  section={section}
                  colSpan={5}
                  canMoveUp={sIdx > 0}
                  canMoveDown={sIdx < sections.length - 1}
                  existingTitles={allSubheaderTitles}
                  onMoveUp={() => onMoveSection?.(section.title, -1)}
                  onMoveDown={() => onMoveSection?.(section.title, 1)}
                  onRename={onRenameSection}
                />
                {section.items.map((item) => renderItemAndChildren(item))}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
