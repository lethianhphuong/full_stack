import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import { alpha } from '@mui/material/styles';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Đơn hàng của bạn đã được đặt',
    description: 'đang chờ vận chuyển',
    avatar: null,
    type: 'order_placed',
    createdAt: new Date(),
    isUnRead: true,
  },
  {
    id: '2',
    title: 'Sylvan King',
    description: 'đã trả lời bình luận của bạn trên Minimal',
    avatar: '/assets/images/avatar/avatar_2.jpg',
    type: 'friend_interactive',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isUnRead: true,
  },
  {
    id: '3',
    title: 'Bạn có tin nhắn mới',
    description: '5 tin nhắn chưa đọc',
    avatar: null,
    type: 'chat_message',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isUnRead: false,
  },
  {
    id: '4',
    title: 'Bạn có thư mới',
    description: 'gửi từ Guido Padberg',
    avatar: null,
    type: 'mail',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isUnRead: false,
  },
  {
    id: '5',
    title: 'Đang xử lý giao hàng',
    description: 'Đơn hàng của bạn đang được vận chuyển',
    avatar: null,
    type: 'order_shipped',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    isUnRead: false,
  },
];

function renderIconByType(type: string) {
  switch (type) {
    case 'order_placed':
      return <Iconify icon="solar:bag-check-bold" width={24} sx={{ color: 'primary.main' }} />;
    case 'order_shipped':
      return <Iconify icon="solar:delivery-bold" width={24} sx={{ color: 'info.main' }} />;
    case 'mail':
      return <Iconify icon="solar:letter-bold" width={24} sx={{ color: 'warning.main' }} />;
    case 'chat_message':
      return <Iconify icon="solar:chat-round-dots-bold" width={24} sx={{ color: 'error.main' }} />;
    default:
      return null;
  }
}

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const totalUnRead = notifications.filter((item) => item.isUnRead).length;

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(null);
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  }, [notifications]);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          }),
        }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
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
              mt: 1.5,
              ml: 0.75,
              width: 360,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Thông báo</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Bạn có {totalUnRead} tin nhắn chưa đọc
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <IconButton color="primary" onClick={handleMarkAllAsRead}>
              <Iconify icon="solar:check-read-bold" width={20} />
            </IconButton>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <List disablePadding sx={{ maxHeight: 340, overflow: 'auto' }}>
          {notifications.map((notification) => (
            <ListItemButton
              key={notification.id}
              sx={{
                py: 1.5,
                px: 2.5,
                ...(notification.isUnRead && {
                  bgcolor: 'action.selected',
                }),
              }}
            >
              <ListItemAvatar>
                {notification.avatar ? (
                  <Avatar src={notification.avatar} sx={{ bgcolor: 'background.neutral' }} />
                ) : (
                  <Avatar sx={{ bgcolor: 'background.neutral' }}>
                    {renderIconByType(notification.type)}
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={notification.title}
                secondary={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    <Iconify icon="solar:clock-circle-outline" width={14} sx={{ mr: 0.5 }} />
                    {formatTimeAgo(notification.createdAt)}
                  </Typography>
                }
                primaryTypographyProps={{ typography: 'subtitle2' }}
                secondaryTypographyProps={{ component: 'div' }}
              />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <MenuItem
            sx={{
              borderRadius: 1,
              typography: 'body2',
              fontWeight: 600,
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            Xem tất cả
          </MenuItem>
        </Box>
      </Popover>
    </>
  );
}

// Helper function
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return `${days} ngày trước`;
}
