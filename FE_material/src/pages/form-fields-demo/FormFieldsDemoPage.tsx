import { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { usePreferencesStore } from '@/store';
import Iconify from '@/components/iconify';
import BasicFieldsDemo from './tabs/BasicFieldsDemo';
import SelectFieldsDemo from './tabs/SelectFieldsDemo';
import DateMoneyDemo from './tabs/DateMoneyDemo';
import AdvancedFormDemo from './tabs/AdvancedFormDemo';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'basic',
    label: 'Cơ bản',
    icon: 'solar:widget-bold-duotone',
    description: 'TextField, TextArea, Number, Money, Radio, Checkbox, Switch',
    component: BasicFieldsDemo,
  },
  {
    value: 'select',
    label: 'Select & Autocomplete',
    icon: 'solar:sort-from-bottom-to-top-bold-duotone',
    description: 'options, valueEnum, multiple, showSearch, async, tags',
    component: SelectFieldsDemo,
  },
  {
    value: 'date',
    label: 'Date & Money',
    icon: 'solar:calendar-bold-duotone',
    description: 'DatePicker, DateRangePicker, MoneyField',
    component: DateMoneyDemo,
  },
  {
    value: 'advanced',
    label: 'Nâng cao',
    icon: 'solar:layers-bold-duotone',
    description: 'Upload, FormDependency, FormList — form đầy đủ',
    component: AdvancedFormDemo,
  },
];

// ----------------------------------------------------------------------

export default function FormFieldsDemoPage() {
  const themeCompact = usePreferencesStore((state) => state.themeCompact);
  const [currentTab, setCurrentTab] = useState('basic');

  const activeTab = TABS.find((tab) => tab.value === currentTab);
  const ActiveComponent = activeTab?.component;

  return (
    <Container maxWidth={themeCompact ? 'xl' : false}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4">Form Fields</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Bộ Base Fields kiểu Ant Design Pro — truyền options / valueEnum / request là dùng được ngay
          </Typography>
        </Stack>

        <Card sx={{ px: 2 }}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => setCurrentTab(newValue)}
            variant="scrollable"
            allowScrollButtonsMobile
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

        {activeTab && (
          <Box sx={{ color: 'text.secondary', typography: 'body2' }}>{activeTab.description}</Box>
        )}

        {ActiveComponent && <ActiveComponent />}
      </Stack>
    </Container>
  );
}
