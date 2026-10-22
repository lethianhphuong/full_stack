import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { BoxProps } from '@mui/material/Box';
import type { ReactNode } from 'react';

type WorkspacePageProps = {
  title: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  contentSx?: BoxProps['sx'];
};

export default function WorkspacePage({
  title,
  actions,
  children,
  contentSx,
}: WorkspacePageProps) {
  return (
    <Box sx={{ height: 'calc(100vh - 88px)', display: 'flex', flexDirection: 'column' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, py: 2, flexShrink: 0 }}
      >
        <Typography variant="h4">{title}</Typography>
        {actions}
      </Stack>

      <Box
        sx={[
          {
            flex: 1,
            minHeight: 0,
            mx: 3,
            mb: 3,
          },
          ...(Array.isArray(contentSx) ? contentSx : [contentSx]),
        ]}
      >
        {children}
      </Box>
    </Box>
  );
}
