import { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import { alpha, styled, useTheme } from '@mui/material/styles';
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

const COVER_URL = 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-4.webp';
const AVATAR_URL = 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-25.webp';

const USER_PROFILE = {
  name: 'Jaydon Frankie',
  role: 'Full Stack Developer',
  location: 'Hồ Chí Minh, Việt Nam',
  email: 'demo@minimals.cc',
  company: 'Minimals Inc.',
  school: 'Đại học Bách Khoa TP.HCM',
  follower: 9734,
  following: 1238,
  friends: 3456,
  about: 'Tay đàn guitar, người làm vườn, người bác ái. Đam mê nâng cao sự sáng tạo của bạn thông qua mã hóa. Biến những ý tưởng thành các trang web chức năng với sự khéo léo và đổi mới. Từng pixel kể một câu chuyện — hãy để mã của bạn nói cho chính nó.',
};

const SOCIAL_LINKS = [
  { name: 'Facebook', icon: 'eva:facebook-fill', href: '#', color: '#1877F2' },
  { name: 'Instagram', icon: 'ant-design:instagram-filled', href: '#', color: '#E02D69' },
  { name: 'LinkedIn', icon: 'eva:linkedin-fill', href: '#', color: '#007EBB' },
  { name: 'Twitter', icon: 'eva:twitter-fill', href: '#', color: '#00AAEC' },
];

const TABS = [
  { value: 'profile', label: 'Hồ sơ', icon: 'solar:user-id-bold' },
  { value: 'followers', label: 'Người theo dõi', icon: 'solar:heart-bold' },
  { value: 'friends', label: 'Bạn bè', icon: 'solar:users-group-rounded-bold' },
  { value: 'gallery', label: 'Bộ sưu tập', icon: 'solar:gallery-wide-bold' },
];

const FRIENDS = Array.from({ length: 12 }, (_, index) => ({
  id: `friend-${index + 1}`,
  name: ['Lucian Obrien', 'Deja Brady', 'Harrison Stein', 'Reece Chung', 'Lainey Davidson', 'Cristopher Cardenas'][index % 6],
  role: ['Project Manager', 'UI Designer', 'Data Analyst', 'Full Stack Developer', 'HR Manager', 'UX Designer'][index % 6],
  avatar: `https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-${(index % 25) + 1}.webp`,
}));

const GALLERY_IMAGES = Array.from({ length: 12 }, (_, index) => ({
  id: `gallery-${index + 1}`,
  title: `Ảnh ${index + 1}`,
  url: `https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-${(index % 24) + 1}.webp`,
  date: `${Math.floor(Math.random() * 28) + 1} Th0${Math.floor(Math.random() * 9) + 1} 2025`,
}));

const POSTS = [
  {
    id: 1,
    content: 'Thiên nhiên luôn mang đến những khoảnh khắc đẹp nhất khi chúng ta biết dừng lại và quan sát. Hôm nay tôi đã có cơ hội chụp được bức ảnh tuyệt vời này trong chuyến đi cuối tuần.',
    image: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp',
    likes: 234,
    comments: 45,
    time: '3 giờ trước',
  },
  {
    id: 2,
    content: 'Vừa hoàn thành dự án mới! Rất hào hứng được chia sẻ với mọi người. Cảm ơn team đã cùng nhau làm việc chăm chỉ trong suốt 3 tháng qua.',
    likes: 567,
    comments: 89,
    time: '2 ngày trước',
  },
];

// ----------------------------------------------------------------------

const StyledCover = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 280,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(to bottom, ${alpha(theme.palette.grey[900], 0)} 0%, ${alpha(theme.palette.grey[900], 0.8)} 100%)`,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 128,
  height: 128,
  border: `4px solid ${theme.palette.background.paper}`,
  position: 'absolute',
  bottom: -64,
  left: 24,
  boxShadow: theme.shadows[8],
}));

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState('profile');

  const renderProfile = (
    <Grid container spacing={3}>
      {/* Left column - About & Social */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={3}>
          {/* About Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Giới thiệu</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {USER_PROFILE.about}
              </Typography>

              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Iconify icon="solar:point-on-map-bold" width={24} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Sống tại <strong>{USER_PROFILE.location}</strong>
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                  <Iconify icon="solar:letter-bold" width={24} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2">{USER_PROFILE.email}</Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                  <Iconify icon="solar:case-round-bold" width={24} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Làm việc tại <strong>{USER_PROFILE.company}</strong>
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                  <Iconify icon="solar:square-academic-cap-bold" width={24} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Học tại <strong>{USER_PROFILE.school}</strong>
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Social Links Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Mạng xã hội</Typography>
              <Stack spacing={2}>
                {SOCIAL_LINKS.map((link) => (
                  <Stack key={link.name} direction="row" alignItems="center" spacing={2}>
                    <Iconify icon={link.icon} width={24} sx={{ color: link.color }} />
                    <Typography
                      component="a"
                      href={link.href}
                      variant="body2"
                      color="text.primary"
                      sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {link.name.toLowerCase()}.com/jaydon.frankie
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Grid>

      {/* Right column - Posts */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack spacing={3}>
          {/* Post Input */}
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2}>
                <Avatar src={AVATAR_URL} sx={{ width: 40, height: 40 }} />
                <Box
                  sx={{
                    flex: 1,
                    px: 2,
                    py: 1.5,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.grey[500], 0.08),
                    cursor: 'pointer',
                    '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.12) },
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Bạn đang nghĩ gì?
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" justifyContent="space-around">
                <Button startIcon={<Iconify icon="solar:gallery-bold" />} color="inherit">
                  Ảnh/Video
                </Button>
                <Button startIcon={<Iconify icon="solar:users-group-rounded-bold" />} color="inherit">
                  Tag bạn bè
                </Button>
                <Button startIcon={<Iconify icon="solar:map-point-wave-bold" />} color="inherit">
                  Check in
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Posts */}
          {POSTS.map((post) => (
            <Card key={post.id}>
              <CardContent>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Avatar src={AVATAR_URL} sx={{ width: 48, height: 48 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">{USER_PROFILE.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{post.time}</Typography>
                  </Box>
                  <IconButton>
                    <Iconify icon="eva:more-vertical-fill" />
                  </IconButton>
                </Stack>

                <Typography variant="body2" sx={{ mb: 2 }}>{post.content}</Typography>

                {post.image && (
                  <Box
                    component="img"
                    src={post.image}
                    sx={{
                      width: '100%',
                      height: 300,
                      objectFit: 'cover',
                      borderRadius: 1.5,
                      mb: 2,
                    }}
                  />
                )}

                <Stack direction="row" alignItems="center" spacing={3}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconButton size="small" color="error">
                      <Iconify icon="solar:heart-bold" width={20} />
                    </IconButton>
                    <Typography variant="body2">{post.likes}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconButton size="small">
                      <Iconify icon="solar:chat-round-dots-bold" width={20} />
                    </IconButton>
                    <Typography variant="body2">{post.comments}</Typography>
                  </Stack>
                  <Box sx={{ flex: 1 }} />
                  <IconButton size="small">
                    <Iconify icon="solar:share-bold" width={20} />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Grid>
    </Grid>
  );

  const renderFollowers = (
    <Box sx={{ textAlign: 'center', py: 5 }}>
      <Iconify icon="solar:heart-bold" width={80} sx={{ color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        {USER_PROFILE.follower.toLocaleString()} người theo dõi
      </Typography>
      <Typography variant="body2" color="text.disabled">
        Tính năng đang được phát triển
      </Typography>
    </Box>
  );

  const renderFriends = (
    <Grid container spacing={3}>
      {FRIENDS.map((friend) => (
        <Grid key={friend.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={friend.avatar} sx={{ width: 48, height: 48 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap>{friend.name}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>{friend.role}</Typography>
                </Box>
                <IconButton>
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderGallery = (
    <Grid container spacing={2}>
      {GALLERY_IMAGES.map((image) => (
        <Grid key={image.id} size={{ xs: 6, sm: 4, md: 3 }}>
          <Box
            sx={{
              position: 'relative',
              paddingTop: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              cursor: 'pointer',
              '&:hover .overlay': { opacity: 1 },
            }}
          >
            <Box
              component="img"
              src={image.url}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              className="overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: alpha(theme.palette.grey[900], 0.64),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
            >
              <Iconify icon="solar:eye-bold" width={32} sx={{ color: 'common.white' }} />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ pb: 5 }}>
      {/* Cover & Profile Header */}
      <Card sx={{ mb: 3, overflow: 'visible' }}>
        <StyledCover sx={{ backgroundImage: `url(${COVER_URL})` }}>
          <StyledAvatar src={AVATAR_URL} alt={USER_PROFILE.name} />
        </StyledCover>

        <Box sx={{ pt: 2, pb: 3, px: 3, pl: { xs: 3, sm: 20 } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            spacing={2}
            sx={{ pt: { xs: 8, sm: 0 } }}
          >
            <Box>
              <Typography variant="h5">{USER_PROFILE.name}</Typography>
              <Typography variant="body2" color="text.secondary">{USER_PROFILE.role}</Typography>
            </Box>

            <Stack direction="row" spacing={3}>
              <Stack alignItems="center">
                <Typography variant="h6">{USER_PROFILE.follower.toLocaleString()}</Typography>
                <Typography variant="body2" color="text.secondary">Người theo dõi</Typography>
              </Stack>
              <Stack alignItems="center">
                <Typography variant="h6">{USER_PROFILE.following.toLocaleString()}</Typography>
                <Typography variant="body2" color="text.secondary">Đang theo dõi</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button variant="contained" startIcon={<Iconify icon="solar:user-plus-bold" />}>
                Theo dõi
              </Button>
              <Button variant="outlined" startIcon={<Iconify icon="solar:chat-round-dots-bold" />}>
                Nhắn tin
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Divider />

        <Tabs
          value={currentTab}
          onChange={(_, value) => setCurrentTab(value)}
          sx={{ px: 3, bgcolor: alpha(theme.palette.grey[500], 0.04) }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              icon={<Iconify icon={tab.icon} width={20} />}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Card>

      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {currentTab === 'profile' && renderProfile}
        {currentTab === 'followers' && renderFollowers}
        {currentTab === 'friends' && renderFriends}
        {currentTab === 'gallery' && renderGallery}
      </Box>
    </Container>
  );
}
