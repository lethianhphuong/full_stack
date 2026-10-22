import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '@/components/iconify';
import { WorkspacePage } from '@/components/workspace';

// ----------------------------------------------------------------------

const CONTACTS = [
  { id: '1', name: 'Lucian Obrien', lastMessage: 'You: The waves crashed aga...', time: '6 phút', online: true, unread: 0 },
  { id: '2', name: 'Deja Brady', lastMessage: 'You: The scent of blooming...', time: 'một giờ', online: false, unread: 0 },
  { id: '3', name: 'Harrison Stein', lastMessage: 'Sent a photo', time: '2 giờ', online: false, unread: 0 },
  { id: '4', name: 'Reece Chung', lastMessage: 'She gazed up at the night ...', time: '11 phút', online: true, unread: 1 },
  { id: '5', name: 'Lainey Davidson', lastMessage: 'The concert was a mesmeriz...', time: '7 phút', online: false, unread: 0 },
  { id: '6', name: 'Cristopher Cardenas', lastMessage: 'The waves crashed against...', time: 'một giờ', online: false, unread: 0 },
  { id: '7', name: 'Cristopher Group', lastMessage: 'The delicate butterfly grace...', time: '7 phút', online: true, unread: 1 },
  { id: '8', name: 'Melanie Noble', lastMessage: 'The scent of blooming flow...', time: '3 ngày', online: false, unread: 0 },
  { id: '9', name: 'Chase Day', lastMessage: '', time: '8 giờ', online: false, unread: 0 },
];

const MESSAGES = [
  { id: '1', content: 'She eagerly opened the gift, her eyes sparkling with excitement.', time: '5 giờ', isMe: false },
  { id: '2', content: 'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.', time: '4 giờ', isMe: true },
  { id: '3', content: 'The aroma of freshly brewed coffee filled the air, awakening my senses.', time: '3 giờ', isMe: false },
  { id: '4', content: 'The children giggled with joy as they ran through the sprinklers on a hot summer day.', time: '2 giờ', isMe: true },
  { id: '5', content: 'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.', time: 'một giờ', isMe: false },
];

const ATTACHMENTS = [
  { id: '1', name: 'cover-2.jpg', time: '05 Th04 2026 5:22 pm', type: 'image' },
  { id: '2', name: 'design-surname-2015.mp3', time: '04 Th04 2026 4:22 pm', type: 'audio' },
  { id: '3', name: 'expertise-2015-conakry-sao-tom...', time: '03 Th04 2026 3:22 pm', type: 'video' },
  { id: '4', name: 'money-popup-crack.pdf', time: '02 Th04 2026 2:22 pm', type: 'pdf' },
];

// ----------------------------------------------------------------------

export default function ChatPage() {
  const theme = useTheme();
  const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  const isDark = theme.palette.mode === 'dark';
  const paperBg = isDark ? theme.palette.grey[900] : theme.palette.background.paper;
  const sidebarBg = isDark ? alpha(theme.palette.grey[900], 0.8) : alpha(theme.palette.grey[100], 0.8);

  return (
    <WorkspacePage
      title="Trò chuyện"
      contentSx={{
        display: 'flex',
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: paperBg,
      }}
    >
      {/* Left - Contacts */}
        <Box sx={{ width: 320, flexShrink: 0, borderRight: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`, display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
            <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} badgeContent={<Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main', border: `2px solid ${paperBg}` }} />}>
              <Avatar sx={{ width: 48, height: 48 }}>U</Avatar>
            </Badge>
            <Box sx={{ flex: 1 }} />
            <IconButton size="small"><Iconify icon="solar:arrow-left-bold" width={20} /></IconButton>
            <IconButton size="small"><Iconify icon="solar:users-group-rounded-bold" width={20} /></IconButton>
          </Stack>

          <Box sx={{ px: 2, pb: 2 }}>
            <TextField fullWidth size="small" placeholder="Tìm liên hệ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} /></InputAdornment> }}
            />
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {CONTACTS.map((contact) => (
              <Box key={contact.id} onClick={() => setSelectedContact(contact)}
                sx={{ px: 2, py: 1.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2,
                  bgcolor: selectedContact?.id === contact.id ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  '&:hover': { bgcolor: selectedContact?.id === contact.id ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.grey[500], 0.08) },
                }}
              >
                <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={contact.online ? <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main', border: `2px solid ${paperBg}` }} /> : null}
                >
                  <Avatar sx={{ width: 48, height: 48 }}>{contact.name.charAt(0)}</Avatar>
                </Badge>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2" noWrap>{contact.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled', flexShrink: 0 }}>{contact.time}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>{contact.lastMessage}</Typography>
                    {contact.unread > 0 && (
                      <Box sx={{ minWidth: 20, height: 20, borderRadius: '50%', bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {contact.unread}
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Middle - Messages */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {selectedContact && (
            <>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.16)}` }}>
                <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={selectedContact.online ? <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main', border: `2px solid ${paperBg}` }} /> : null}
                >
                  <Avatar sx={{ width: 40, height: 40 }}>{selectedContact.name.charAt(0)}</Avatar>
                </Badge>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">{selectedContact.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>{selectedContact.online ? 'online' : 'offline'}</Typography>
                </Box>
                <IconButton size="small"><Iconify icon="solar:phone-bold" width={20} /></IconButton>
                <IconButton size="small"><Iconify icon="solar:videocamera-bold" width={20} /></IconButton>
                <IconButton size="small"><Iconify icon="solar:sidebar-minimalistic-bold" width={20} /></IconButton>
                <IconButton size="small"><Iconify icon="eva:more-vertical-fill" width={20} /></IconButton>
              </Stack>

              <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                {MESSAGES.map((msg) => (
                  <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.isMe ? 'flex-end' : 'flex-start', mb: 2 }}>
                    <Stack direction={msg.isMe ? 'row-reverse' : 'row'} spacing={1.5} alignItems="flex-end" sx={{ maxWidth: '70%' }}>
                      {!msg.isMe && <Avatar sx={{ width: 32, height: 32 }}>{selectedContact.name.charAt(0)}</Avatar>}
                      <Box>
                        {!msg.isMe && <Typography variant="caption" sx={{ color: 'text.disabled', mb: 0.5, display: 'block' }}>{selectedContact.name}, {msg.time}</Typography>}
                        <Box sx={{ px: 2, py: 1.5, borderRadius: 1.5, bgcolor: msg.isMe ? 'primary.main' : alpha(theme.palette.grey[500], 0.16), color: msg.isMe ? 'primary.contrastText' : 'text.primary' }}>
                          <Typography variant="body2">{msg.content}</Typography>
                        </Box>
                        {msg.isMe && <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5, display: 'block', textAlign: 'right' }}>{msg.time}</Typography>}
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Box>

              <Box sx={{ px: 2, py: 1.5, borderTop: `1px solid ${alpha(theme.palette.grey[500], 0.16)}` }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton size="small"><Iconify icon="solar:sticker-smile-circle-bold" width={24} /></IconButton>
                  <TextField fullWidth size="small" placeholder="Nhập tin nhắn..." value={message} onChange={(e) => setMessage(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                  <IconButton size="small"><Iconify icon="solar:gallery-add-bold" width={24} /></IconButton>
                  <IconButton size="small"><Iconify icon="solar:paperclip-bold" width={24} /></IconButton>
                  <IconButton size="small"><Iconify icon="solar:microphone-bold" width={24} /></IconButton>
                </Stack>
              </Box>
            </>
          )}
        </Box>

        {/* Right - Contact Info */}
        <Box sx={{ width: 280, flexShrink: 0, borderLeft: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`, display: 'flex', flexDirection: 'column', bgcolor: sidebarBg }}>
          {selectedContact && (
            <>
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ width: 96, height: 96, mx: 'auto', mb: 2, fontSize: 32 }}>{selectedContact.name.charAt(0)}</Avatar>
                <Typography variant="h6">{selectedContact.name}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>CTO</Typography>
              </Box>

              <Divider />

              <Box sx={{ p: 2 }}>
                <Typography variant="overline" sx={{ color: 'text.disabled', display: 'block', mb: 1 }}>Thông tin</Typography>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Iconify icon="solar:point-on-map-bold" sx={{ color: 'text.disabled' }} />
                    <Typography variant="body2">1147 Rohan Drive Suite 819 - Burlington, VT / 82021</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Iconify icon="solar:phone-bold" sx={{ color: 'text.disabled' }} />
                    <Typography variant="body2">+1 416-555-0198</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Iconify icon="solar:letter-bold" sx={{ color: 'text.disabled' }} />
                    <Typography variant="body2">ashlynn.ohara62@gmail.com</Typography>
                  </Stack>
                </Stack>
              </Box>

              <Divider />

              <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
                <Typography variant="overline" sx={{ color: 'text.disabled', display: 'block', mb: 1 }}>Tệp đính kèm ({ATTACHMENTS.length})</Typography>
                <Stack spacing={1.5}>
                  {ATTACHMENTS.map((file) => (
                    <Stack key={file.id} direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: alpha(theme.palette.primary.main, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Iconify icon={file.type === 'image' ? 'solar:gallery-bold' : file.type === 'audio' ? 'solar:music-note-2-bold' : file.type === 'video' ? 'solar:video-frame-bold' : 'solar:document-bold'} sx={{ color: 'primary.main' }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap>{file.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>{file.time}</Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </>
          )}
        </Box>
    </WorkspacePage>
  );
}
