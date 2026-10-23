import type { ManagedRouteSection } from './types';

// Bản sao dữ liệu hiển thị từ staticRoutesConfig với UUID cố định, độc lập router thật.
export const MOCK_MANAGED_ROUTES: ManagedRouteSection[] = [
  { subheader: 'Tổng quan', items: [
    { id: '00000000-0000-4000-8000-000000000001', title: 'Trang chủ', path: 'trang-chu', icon: 'solar:widget-5-bold-duotone', index: true },
    { id: '00000000-0000-4000-8000-000000000002', title: 'Phân tích', path: 'analytics', icon: 'solar:chart-square-bold-duotone' },
  ] },
  { subheader: 'Quản lý', items: [
    { id: '00000000-0000-4000-8000-000000000003', title: 'Người dùng', path: 'user', icon: 'solar:users-group-rounded-bold-duotone', children: [
      { id: '00000000-0000-4000-8000-000000000004', title: 'Hồ sơ', path: 'user/profile' },
      { id: '00000000-0000-4000-8000-000000000005', title: 'Thẻ', path: 'user/cards' },
      { id: '00000000-0000-4000-8000-000000000006', title: 'Danh sách', path: 'user/list' },
      { id: '00000000-0000-4000-8000-000000000007', title: 'Tạo mới', path: 'user/create' },
      { id: '00000000-0000-4000-8000-000000000008', title: 'Chỉnh sửa', path: 'user/edit' },
      { id: '00000000-0000-4000-8000-000000000009', title: 'Tài khoản', path: 'user/account' },
    ] },
    { id: '00000000-0000-4000-8000-000000000010', title: 'Hóa đơn chi tiêu cần thanh toán', path: 'invoice', icon: 'solar:bill-list-bold-duotone', children: [
      { id: '00000000-0000-4000-8000-000000000011', title: 'Danh sách chờ thanh toán', path: 'invoice/list', children: [
        { id: '00000000-0000-4000-8000-000000000012', title: 'Chi tiết', path: 'invoice/list/details', hideInMenu: true },
      ] },
    ] },
  ] },
  { subheader: 'Tiện ích', items: [
    { id: '00000000-0000-4000-8000-000000000013', title: 'Thư', path: 'mail', icon: 'solar:letter-bold-duotone', info: 32 },
    { id: '00000000-0000-4000-8000-000000000014', title: 'Trò chuyện', path: 'chat', icon: 'solar:chat-round-dots-bold-duotone' },
    { id: '00000000-0000-4000-8000-000000000015', title: 'Lịch', path: 'calendar', icon: 'solar:calendar-date-bold-duotone' },
  ] },
  { subheader: 'Components', items: [
    { id: '00000000-0000-4000-8000-000000000016', title: 'Components', path: 'components', icon: 'solar:code-square-bold-duotone', children: [
      { id: '00000000-0000-4000-8000-000000000017', title: 'Data Table', path: 'components/data-table', icon: 'solar:table-bold-duotone' },
      { id: '00000000-0000-4000-8000-000000000018', title: 'Form Fields', path: 'components/form-fields', icon: 'solar:code-square-bold-duotone' },
      { id: '00000000-0000-4000-8000-000000000019', title: 'OnlyOffice Editor', path: 'components/onlyoffice-editor', icon: 'solar:document-text-bold-duotone' },
    ] },
  ] },
  { subheader: 'DEMO PROJECT', items: [
    { id: '00000000-0000-4000-8000-000000000020', title: 'DEMO PROJECT', path: 'dashboard/demo-project', icon: 'solar:case-minimalistic-bold-duotone', children: [
      { id: '00000000-0000-4000-8000-000000000021', title: 'AppPageContainer Demo', path: 'dashboard/demo-project/app-page-container', icon: 'solar:layers-minimalistic-bold-duotone' },
      { id: '00000000-0000-4000-8000-000000000022', title: 'SearchableProTable Demo', path: 'dashboard/demo-project/searchable-pro-table', icon: 'solar:table-bold-duotone' },
      { id: '00000000-0000-4000-8000-000000000023', title: 'Con Người', path: 'dashboard/demo-project/con-nguoi', icon: 'solar:user-id-bold-duotone', children: [
        { id: '00000000-0000-4000-8000-000000000024', title: 'Thêm mới Con Người', path: 'dashboard/demo-project/con-nguoi/create', hideInMenu: true },
        { id: '00000000-0000-4000-8000-000000000025', title: 'Chỉnh sửa Con Người', path: 'dashboard/demo-project/con-nguoi/:id/edit', hideInMenu: true },
      ] },
      { id: '00000000-0000-4000-8000-000000000026', title: 'Quản lý router', path: 'dashboard/demo-project/router-management', icon: 'solar:tuning-2-bold-duotone' },
    ] },
  ] },
];
