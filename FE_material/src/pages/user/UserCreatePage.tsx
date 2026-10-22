import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { usePreferencesStore } from '@/store';
import { UserCreateForm } from '@/sections/user';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  const themeCompact = usePreferencesStore((state) => state.themeCompact);

  return (
    <Container maxWidth={themeCompact ? 'xl' : false}>
      <Stack spacing={3}>
        <UserCreateForm />
      </Stack>
    </Container>
  );
}
