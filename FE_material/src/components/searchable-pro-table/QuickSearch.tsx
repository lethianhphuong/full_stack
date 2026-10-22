import { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Iconify from '@/components/iconify';

interface QuickSearchProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  placeholder?: string;
}

export default function QuickSearch({ keywords, onChange, placeholder = 'Tìm kiếm nhanh họ tên, số CCCD, SĐT...' }: QuickSearchProps) {
  const [input, setInput] = useState('');

  const addKeyword = () => {
    const keyword = input.trim();
    if (!keyword) return;
    if (!keywords.includes(keyword)) onChange([...keywords, keyword]);
    setInput('');
  };

  return (
    <Stack spacing={1} sx={{ minWidth: 0, width: { xs: 1, sm: 340 } }}>
      <Box component="form" onSubmit={(event) => { event.preventDefault(); addKeyword(); }}>
        <TextField
          size="small"
          fullWidth
          placeholder={placeholder}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:magnifer-linear" width={18} sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      {keywords.length > 0 && (
        <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
          {keywords.map((keyword) => (
            <Chip key={keyword} size="small" label={keyword} onDelete={() => onChange(keywords.filter((item) => item !== keyword))} />
          ))}
          <Tooltip title="Xóa tất cả từ khóa">
            <IconButton size="small" aria-label="Xóa tất cả từ khóa" onClick={() => onChange([])}>
              <Iconify icon="solar:trash-bin-trash-bold-duotone" width={18} />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Stack>
  );
}
