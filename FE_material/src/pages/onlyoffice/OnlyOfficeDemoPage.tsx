import Container from '@mui/material/Container';
import { usePreferencesStore } from '@/store';
import { DocumentListView } from '@/sections/onlyoffice';

// ----------------------------------------------------------------------

export default function OnlyOfficeDemoPage() {
  const themeCompact = usePreferencesStore((state) => state.themeCompact);

  return (
    <Container maxWidth={themeCompact ? 'xl' : false}>
      <DocumentListView />
    </Container>
  );
}
