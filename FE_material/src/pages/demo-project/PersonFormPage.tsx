import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import { PersonForm } from '@/sections/demo-project/person';
import { usePreferencesStore } from '@/store';

export default function PersonFormPage() {
  const { id } = useParams();
  const themeCompact = usePreferencesStore((state) => state.themeCompact);
  return <Container maxWidth={themeCompact ? 'xl' : false}><PersonForm personId={id} /></Container>;
}
