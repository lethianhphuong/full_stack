import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import ToggleButton from '@mui/material/ToggleButton';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '@/components/iconify';
import { WorkspacePage } from '@/components/workspace';

// ----------------------------------------------------------------------

type CalendarView = 'month' | 'week' | 'day' | 'agenda';

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  allDay?: boolean;
};

// Mock events data - April 2026
const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Hội nghị Công nghệ',
    start: new Date(2026, 3, 30, 15, 22),
    end: new Date(2026, 3, 30, 17, 0),
    color: '#00AB55',
  },
  {
    id: '2',
    title: 'Tiệc từ thiện',
    start: new Date(2026, 3, 2, 0, 0),
    end: new Date(2026, 3, 2, 23, 59),
    color: '#FFAB00',
    allDay: true,
  },
  {
    id: '3',
    title: 'Triển lãm Nghệ thuật Mùa Xuân',
    start: new Date(2026, 3, 5, 16, 52),
    end: new Date(2026, 3, 5, 19, 0),
    color: '#00B8D9',
  },
  {
    id: '4',
    title: 'Workshop Đào tạo Doanh nghiệp',
    start: new Date(2026, 3, 7, 8, 7),
    end: new Date(2026, 3, 7, 12, 0),
    color: '#637381',
  },
  {
    id: '5',
    title: 'Hội chợ Sức khỏe Cộng đồng',
    start: new Date(2026, 3, 7, 22, 7),
    end: new Date(2026, 3, 7, 23, 59),
    color: '#FF5630',
  },
  {
    id: '6',
    title: 'Đêm Startup Pitch',
    start: new Date(2026, 3, 8, 12, 7),
    end: new Date(2026, 3, 8, 15, 0),
    color: '#00AB55',
  },
  {
    id: '7',
    title: 'Giải đấu Thể thao Khu vực',
    start: new Date(2026, 3, 8, 14, 7),
    end: new Date(2026, 3, 8, 18, 0),
    color: '#00B8D9',
  },
  {
    id: '8',
    title: 'Sự kiện Ra mắt Sách',
    start: new Date(2026, 3, 11, 18, 52),
    end: new Date(2026, 3, 11, 21, 0),
    color: '#FFAB00',
  },
];

const DAYS_FULL_VI = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
const MONTHS_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

const VIEW_OPTIONS: { value: CalendarView; icon: string; label: string }[] = [
  { value: 'month', icon: 'solar:calendar-bold', label: 'Tháng' },
  { value: 'week', icon: 'solar:calendar-minimalistic-bold', label: 'Tuần' },
  { value: 'day', icon: 'solar:calendar-date-bold', label: 'Ngày' },
  { value: 'agenda', icon: 'solar:list-bold', label: 'Lịch trình' },
];

// ----------------------------------------------------------------------

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const suffix = hours >= 12 ? 'p' : 'a';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')}${suffix}`;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  
  // Get the Monday of the first week
  const startDate = new Date(firstDay);
  const dayOfWeek = firstDay.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
  startDate.setDate(startDate.getDate() - diff);
  
  // Generate 6 weeks of days (42 days)
  const days: Date[] = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return days;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

// ----------------------------------------------------------------------

export default function CalendarPage() {
  const theme = useTheme();
  const [view, setView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 5)); // April 2026
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');

  const isDark = theme.palette.mode === 'dark';

  const calendarDays = useMemo(
    () => getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate]
  );

  const getEventsForDay = (date: Date): CalendarEvent[] => {
    return MOCK_EVENTS.filter((event) => isSameDay(event.start, date));
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: CalendarView | null) => {
    if (newView) setView(newView);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseEventDialog = () => {
    setSelectedEvent(null);
  };

  const handleAddEvent = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
    setNewEventTitle('');
  };

  const renderMonthView = (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Days header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
        }}
      >
        {DAYS_FULL_VI.map((day, index) => (
          <Box
            key={day}
            sx={{
              py: 1.5,
              textAlign: 'center',
              borderRight: index < 6 ? `1px solid ${alpha(theme.palette.grey[500], 0.16)}` : 'none',
              bgcolor: index >= 5 ? alpha(theme.palette.grey[500], 0.04) : 'transparent',
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {day}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Calendar grid */}
      <Box
        sx={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridTemplateRows: 'repeat(6, 1fr)',
          overflow: 'hidden',
        }}
      >
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isTodayDate = isToday(day);
          const dayEvents = getEventsForDay(day);
          const isWeekend = index % 7 >= 5;

          return (
            <Box
              key={day.toISOString()}
              sx={{
                p: 0.5,
                minHeight: 100,
                borderRight: (index + 1) % 7 !== 0 ? `1px solid ${alpha(theme.palette.grey[500], 0.16)}` : 'none',
                borderBottom: index < 35 ? `1px solid ${alpha(theme.palette.grey[500], 0.16)}` : 'none',
                bgcolor: isWeekend ? alpha(theme.palette.grey[500], 0.04) : 'transparent',
                opacity: isCurrentMonth ? 1 : 0.4,
              }}
            >
              {/* Day number */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    bgcolor: isTodayDate ? 'error.main' : 'transparent',
                    color: isTodayDate ? 'common.white' : 'text.primary',
                  }}
                >
                  <Typography variant="body2" fontWeight={isTodayDate ? 700 : 400}>
                    {day.getDate()}
                  </Typography>
                </Box>
              </Box>

              {/* Events */}
              <Stack spacing={0.25}>
                {dayEvents.slice(0, 3).map((event) => (
                  <Tooltip key={event.id} title={event.title} arrow>
                    <Box
                      onClick={() => handleEventClick(event)}
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 0.5,
                        bgcolor: alpha(event.color, 0.16),
                        color: isDark ? event.color : theme.palette.getContrastText(alpha(event.color, 0.8)),
                        cursor: 'pointer',
                        overflow: 'hidden',
                        '&:hover': {
                          bgcolor: alpha(event.color, 0.24),
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          color: event.color,
                        }}
                      >
                        {!event.allDay && `${formatTime(event.start)} `}
                        {event.title}
                      </Typography>
                    </Box>
                  </Tooltip>
                ))}
                {dayEvents.length > 3 && (
                  <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
                    +{dayEvents.length - 3} sự kiện khác
                  </Typography>
                )}
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  const renderAgendaView = (
    <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
      <Stack spacing={2}>
        {MOCK_EVENTS.sort((a, b) => a.start.getTime() - b.start.getTime()).map((event) => (
          <Card
            key={event.id}
            onClick={() => handleEventClick(event)}
            sx={{
              p: 2,
              cursor: 'pointer',
              borderLeft: `4px solid ${event.color}`,
              '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">{event.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.start.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  {!event.allDay && ` • ${formatTime(event.start)} - ${formatTime(event.end)}`}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: event.color,
                }}
              />
            </Stack>
          </Card>
        ))}
      </Stack>
    </Box>
  );

  const renderPlaceholderView = (viewName: string) => (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Iconify icon="solar:calendar-bold-duotone" width={80} sx={{ color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        Chế độ xem {viewName}
      </Typography>
      <Typography variant="body2" color="text.disabled">
        Tính năng đang được phát triển
      </Typography>
    </Box>
  );

  return (
    <WorkspacePage
      title="Lịch"
      actions={
        <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleAddEvent}>
          Thêm sự kiện
        </Button>
      }
      contentSx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {/* Calendar Card */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Toolbar */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              p: 2,
              borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
            }}
          >
            {/* View toggle */}
            <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} size="small">
              {VIEW_OPTIONS.map((option) => (
                <ToggleButton key={option.value} value={option.value}>
                  <Tooltip title={option.label}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Iconify icon={option.icon} width={20} />
                    </Box>
                  </Tooltip>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            {/* Month navigation */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton onClick={handlePrevMonth}>
                <Iconify icon="eva:arrow-ios-back-fill" />
              </IconButton>
              <Typography variant="h6" sx={{ minWidth: 160, textAlign: 'center' }}>
                {MONTHS_VI[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Typography>
              <IconButton onClick={handleNextMonth}>
                <Iconify icon="eva:arrow-ios-forward-fill" />
              </IconButton>
            </Stack>

            {/* Today button */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Button variant="contained" color="primary" onClick={handleToday}>
                Hôm nay
              </Button>
              <IconButton>
                <Iconify icon="solar:filter-bold" />
              </IconButton>
            </Stack>
          </Stack>

          {/* Calendar Content */}
          {view === 'month' && renderMonthView}
          {view === 'agenda' && renderAgendaView}
          {view === 'week' && renderPlaceholderView('Tuần')}
          {view === 'day' && renderPlaceholderView('Ngày')}
        </Card>
      </Box>

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onClose={handleCloseEventDialog} maxWidth="xs" fullWidth>
        {selectedEvent && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: selectedEvent.color }} />
              {selectedEvent.title}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Iconify icon="solar:calendar-bold" width={20} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {selectedEvent.start.toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Typography>
                </Stack>
                {!selectedEvent.allDay && (
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Iconify icon="solar:clock-circle-bold" width={20} sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button color="error" startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}>
                Xóa
              </Button>
              <Button variant="contained" startIcon={<Iconify icon="solar:pen-bold" />}>
                Chỉnh sửa
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={isAddDialogOpen} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm sự kiện mới</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Tiêu đề"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
            />
            <TextField
              fullWidth
              label="Ngày bắt đầu"
              type="datetime-local"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              fullWidth
              label="Ngày kết thúc"
              type="datetime-local"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleCloseAddDialog}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </WorkspacePage>
  );
}
