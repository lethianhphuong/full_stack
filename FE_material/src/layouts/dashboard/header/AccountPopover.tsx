import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

// Mock user data
const USER = {
  displayName: 'Jaydon Frankie',
  email: 'demo@minimals.cc',
  role: 'Admin',
  photoURL: '',
};

const MENU_OPTIONS = [
  {
    label: 'Trang chủ',
    icon: 'solar:home-2-bold-duotone',
    linkTo: '/',
  },
  {
    label: 'Hồ sơ',
    icon: 'solar:user-bold-duotone',
    linkTo: '/user/profile',
  },
  {
    label: 'Cài đặt',
    icon: 'solar:settings-bold-duotone',
    linkTo: '/user/account',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(null);
  }, []);

  const handleClickItem = useCallback(
    (path: string) => {
      handleClose();
      navigate(path);
    },
    [handleClose, navigate]
  );

  const handleLogout = useCallback(() => {
    handleClose();
    navigate('/auth/login');
  }, [handleClose, navigate]);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          width: 40,
          height: 40,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar
          alt={USER.displayName}
          src={USER.photoURL}
          sx={{
            width: 36,
            height: 36,
            border: `solid 2px ${theme.palette.background.default}`,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {USER.displayName.charAt(0)}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              p: 0,
              mt: 1.5,
              width: 200,
              borderRadius: 1.5,
              boxShadow: theme.customShadows?.dropdown || theme.shadows[20],
            },
          },
        }}
      >
        {/* User info header */}
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
            {USER.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {USER.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* Menu items */}
        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              onClick={() => handleClickItem(option.linkTo)}
              sx={{
                px: 1,
                py: 1,
                borderRadius: 1,
                typography: 'body2',
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Iconify icon={option.icon} width={22} sx={{ color: 'text.secondary' }} />
              </ListItemIcon>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* Logout */}
        <Stack sx={{ p: 1 }}>
          <MenuItem
            onClick={handleLogout}
            sx={{
              px: 1,
              py: 1,
              borderRadius: 1,
              typography: 'body2',
              color: 'error.main',
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Iconify icon="solar:logout-2-bold-duotone" width={22} sx={{ color: 'error.main' }} />
            </ListItemIcon>
            Đăng xuất
          </MenuItem>
        </Stack>
      </Popover>
    </>
  );
}
