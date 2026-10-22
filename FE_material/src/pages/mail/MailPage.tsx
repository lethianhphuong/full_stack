import { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '@/components/iconify';
import { WorkspacePage } from '@/components/workspace';

// ----------------------------------------------------------------------

// Mock data cho mail folders
const MAIL_FOLDERS = [
  { id: 'all', label: 'Tất cả', icon: 'solar:letter-bold', count: 3 },
  { id: 'inbox', label: 'Hộp thư đến', icon: 'solar:inbox-bold', count: 1 },
  { id: 'sent', label: 'Đã gửi', icon: 'solar:plain-bold' },
  { id: 'drafts', label: 'Nháp', icon: 'solar:file-text-bold' },
  { id: 'trash', label: 'Thùng rác', icon: 'solar:trash-bin-2-bold' },
  { id: 'spam', label: 'Spam', icon: 'solar:danger-triangle-bold', count: 1 },
  { id: 'important', label: 'Quan trọng', icon: 'solar:bookmark-bold', count: 1 },
  { id: 'starred', label: 'Gắn sao', icon: 'solar:star-bold', count: 1 },
];

const MAIL_LABELS = [
  { id: 'social', label: 'Mạng xã hội', color: '#00AB55' },
  { id: 'promotions', label: 'Khuyến mãi', color: '#FF5630', count: 2 },
  { id: 'forums', label: 'Diễn đàn', color: '#FF5630', count: 1 },
];

// Mock data cho emails
const EMAILS = [
  {
    id: '1',
    from: { name: 'Jayvion Simon', email: 'jayvion.simon@gmail.com', avatar: '' },
    subject: 'Re: The Future of Renewable Energy: Innovations and Challenges Ahead',
    preview: 'Occaecati est et illo quibus...',
    date: 'vài giây',
    isRead: true,
    isStarred: false,
  },
  {
    id: '2',
    from: { name: 'Lainey Davidson', email: 'lainey@gmail.com', avatar: '' },
    subject: 'Non rerum modi',
    preview: 'Non rerum modi. Accusamu...',
    date: '5 ngày',
    isRead: false,
    isStarred: false,
  },
  {
    id: '3',
    from: { name: 'Cristopher Cardenas', email: 'cristopher@gmail.com', avatar: '' },
    subject: 'Est enim et sit non impedit',
    preview: 'Est enim et sit non impedit ...',
    date: '6 ngày',
    isRead: false,
    isStarred: false,
  },
  {
    id: '4',
    from: { name: 'Melanie Noble', email: 'melanie@gmail.com', avatar: '' },
    subject: 'Unde a inventore et',
    preview: 'Unde a inventore et. Sed es...',
    date: '7 ngày',
    isRead: false,
    isStarred: false,
  },
  {
    id: '5',
    from: { name: 'Chase Day', email: 'chase@gmail.com', avatar: '' },
    subject: 'Eaque natus adipisci soluta',
    preview: 'Eaque natus adipisci soluta ...',
    date: '8 ngày',
    isRead: false,
    isStarred: false,
  },
];

// ----------------------------------------------------------------------

export default function MailPage() {
  const theme = useTheme();
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(EMAILS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = theme.palette.mode === 'dark';
  const bgColor = isDark ? alpha(theme.palette.grey[900], 0.8) : alpha(theme.palette.grey[100], 0.8);
  const paperBg = isDark ? theme.palette.grey[900] : theme.palette.background.paper;

  return (
    <WorkspacePage
      title="Thư"
      contentSx={{
        display: 'flex',
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: paperBg,
      }}
    >
      {/* Main content - 3 columns */}
      {/* Left sidebar - Folders */}
        <Box
          sx={{
            width: 260,
            flexShrink: 0,
            borderRight: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Compose button */}
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Iconify icon="solar:pen-new-square-bold" />}
              sx={{ borderRadius: 1.5 }}
            >
              Soạn thư
            </Button>
          </Box>

          {/* Folders list */}
          <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
            <List disablePadding>
              {MAIL_FOLDERS.map((folder) => (
                <ListItemButton
                  key={folder.id}
                  selected={selectedFolder === folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    color: selectedFolder === folder.id ? 'primary.main' : 'text.secondary',
                    bgcolor: selectedFolder === folder.id ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    '&:hover': {
                      bgcolor: selectedFolder === folder.id 
                        ? alpha(theme.palette.primary.main, 0.16) 
                        : alpha(theme.palette.grey[500], 0.08),
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                    <Iconify icon={folder.icon} width={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={folder.label}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: selectedFolder === folder.id ? 600 : 400,
                    }}
                  />
                  {folder.count && (
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {folder.count}
                    </Typography>
                  )}
                </ListItemButton>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Labels */}
            <List disablePadding>
              {MAIL_LABELS.map((label) => (
                <ListItemButton
                  key={label.id}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    color: 'text.secondary',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: label.color,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={label.label}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                  {label.count && (
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {label.count}
                    </Typography>
                  )}
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Box>

        {/* Middle - Email list */}
        <Box
          sx={{
            width: 320,
            flexShrink: 0,
            borderRight: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: bgColor,
          }}
        >
          {/* Search */}
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                },
              }}
            />
          </Box>

          {/* Email list */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {EMAILS.map((email) => (
              <Box
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                sx={{
                  px: 2,
                  py: 1.5,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  bgcolor: selectedEmail?.id === email.id ? 'background.paper' : 'transparent',
                  borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
                  '&:hover': {
                    bgcolor: 'background.paper',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: email.from.avatar ? 'transparent' : 'primary.main',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {email.from.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography
                      variant="subtitle2"
                      noWrap
                      sx={{ fontWeight: email.isRead ? 400 : 600 }}
                    >
                      {email.from.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled', flexShrink: 0 }}>
                      {email.date}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{ color: 'text.secondary' }}
                  >
                    {email.preview}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right - Email detail */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {selectedEmail ? (
            <>
              {/* Email header actions */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
                sx={{ p: 1, borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.16)}` }}
              >
                <IconButton size="small">
                  <Iconify icon="solar:star-bold" width={20} />
                </IconButton>
                <IconButton size="small">
                  <Iconify icon="solar:reply-bold" width={20} />
                </IconButton>
                <IconButton size="small">
                  <Iconify icon="solar:archive-bold" width={20} />
                </IconButton>
                <IconButton size="small">
                  <Iconify icon="solar:flag-bold" width={20} />
                </IconButton>
                <IconButton size="small">
                  <Iconify icon="solar:trash-bin-2-bold" width={20} />
                </IconButton>
                <IconButton size="small">
                  <Iconify icon="eva:more-vertical-fill" width={20} />
                </IconButton>
              </Stack>

              {/* Email content */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                {/* Subject and navigation */}
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {selectedEmail.subject}
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                    <IconButton size="small">
                      <Iconify icon="solar:alt-arrow-left-bold" width={20} />
                    </IconButton>
                    <IconButton size="small">
                      <Iconify icon="solar:refresh-bold" width={20} />
                    </IconButton>
                    <IconButton size="small">
                      <Iconify icon="solar:alt-arrow-right-bold" width={20} />
                    </IconButton>
                  </Stack>
                </Stack>

                {/* Sender info */}
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                    {selectedEmail.from.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1">
                      {selectedEmail.from.name}{' '}
                      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                        &lt;{selectedEmail.from.email}&gt;
                      </Typography>
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      Đến: demo@minimals.cc, tyrel.greenholt@gmail.com
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    05 Th04 2026 5:21 pm
                  </Typography>
                </Stack>

                {/* Email body */}
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  Occaecati est et illo quibusdam accusamus qui. Incidunt aut et molestiae ut facere aut. Est quidem iusto praesentium excepturi harum nihil tenetur facilis. Ut omnis voluptates nihil accusantium doloribus eaque debitis.
                </Typography>
              </Box>

              {/* Reply area */}
              <Box
                sx={{
                  p: 2,
                  borderTop: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  placeholder="Viết gì đó thú vị..."
                  sx={{ mb: 2 }}
                />
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small">
                      <Iconify icon="solar:gallery-add-bold" width={20} />
                    </IconButton>
                    <IconButton size="small">
                      <Iconify icon="solar:paperclip-bold" width={20} />
                    </IconButton>
                  </Stack>
                  <Button
                    variant="contained"
                    endIcon={<Iconify icon="iconamoon:send-fill" />}
                  >
                    Gửi
                  </Button>
                </Stack>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                Chọn một email để xem
              </Typography>
            </Box>
          )}
        </Box>
    </WorkspacePage>
  );
}
