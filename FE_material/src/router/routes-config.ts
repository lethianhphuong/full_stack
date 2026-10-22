import type { ComponentType } from "react";

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

// Lazy-loaded component type
export type LazyComponent = () => Promise<{ default: ComponentType<unknown> }>;

// Unified route config item - Single Source of Truth
export type RouteConfig = {
  id: string; // Unique ID cho route
  title: string; // Display title (Vietnamese)
  path: string; // URL path (relative, không có leading slash)
  icon?: string; // Iconify icon string
  element?: LazyComponent; // Page component loader
  children?: RouteConfig[]; // Child routes/nav items
  index?: boolean; // Là index route?
  hideInMenu?: boolean; // Ẩn khỏi navigation menu
  info?: string | number; // Badge info (số lượng, text)
};

// Section config (cho nav grouping)
export type RouteSectionConfig = {
  subheader: string; // Section header (Vietnamese)
  items: RouteConfig[];
};

// ----------------------------------------------------------------------
// Icons
// ----------------------------------------------------------------------

const ICONS = {
  dashboard: "solar:widget-5-bold-duotone",
  ecommerce: "solar:cart-large-2-bold-duotone",
  analytics: "solar:chart-square-bold-duotone",
  banking: "solar:card-bold-duotone",
  booking: "solar:calendar-bold-duotone",
  file: "solar:file-bold-duotone",
  course: "solar:notebook-bold-duotone",
  user: "solar:users-group-rounded-bold-duotone",
  product: "solar:box-bold-duotone",
  order: "solar:cart-check-bold-duotone",
  invoice: "solar:bill-list-bold-duotone",
  blog: "solar:pen-new-square-bold-duotone",
  job: "solar:case-round-bold-duotone",
  tour: "solar:map-point-wave-bold-duotone",
  mail: "solar:letter-bold-duotone",
  chat: "solar:chat-round-dots-bold-duotone",
  calendar: "solar:calendar-date-bold-duotone",
  kanban: "solar:widget-6-bold-duotone",
  components: "solar:code-square-bold-duotone",
  table: "solar:table-bold-duotone",
  editor: "solar:document-text-bold-duotone",
  demo: "solar:case-minimalistic-bold-duotone",
  person: "solar:user-id-bold-duotone",
  pageContainer: "solar:layers-minimalistic-bold-duotone",
  searchableTable: "solar:table-bold-duotone",
};

// ----------------------------------------------------------------------
// Static Routes Configuration - Single Source of Truth
// ----------------------------------------------------------------------

export const staticRoutesConfig: RouteSectionConfig[] = [
  // TỔNG QUAN
  {
    subheader: "Tổng quan",
    items: [
      {
        id: "trang-chu",
        title: "Trang chủ",
        path: "trang-chu",
        icon: ICONS.dashboard,
        element: () => import("@/pages/dashboard"),
        index: true, // Đây cũng là index route cho /dashboard
      },
      {
        id: "analytics",
        title: "Phân tích",
        path: "analytics",
        icon: ICONS.analytics,
        element: () => import("@/pages/dashboard/AnalyticsPage"),
      },
    ],
  },
  // QUẢN LÝ
  {
    subheader: "Quản lý",
    items: [
      {
        id: "user",
        title: "Người dùng",
        path: "user",
        icon: ICONS.user,
        children: [
          {
            id: "user-profile",
            title: "Hồ sơ",
            path: "user/profile",
            element: () => import("@/pages/user/UserProfilePage"),
          },
          {
            id: "user-cards",
            title: "Thẻ",
            path: "user/cards",
            element: () => import("@/pages/dashboard"),
          },
          {
            id: "user-list",
            title: "Danh sách",
            path: "user/list",
            element: () => import("@/pages/user/UserListPage"),
          },
          {
            id: "user-create",
            title: "Tạo mới",
            path: "user/create",
            element: () => import("@/pages/user/UserCreatePage"),
          },
          {
            id: "user-edit",
            title: "Chỉnh sửa",
            path: "user/edit",
            element: () => import("@/pages/dashboard"),
          },
          {
            id: "user-account",
            title: "Tài khoản",
            path: "user/account",
            element: () => import("@/pages/dashboard"),
          },
        ],
      },
      {
        id: "invoice",
        title: "Hóa đơn chi tiêu cần  thanh toán",
        path: "invoice",
        icon: ICONS.invoice,
        children: [
          {
            id: "invoice-list",
            title: "Danh sách chờ thanh toán",
            path: "invoice/list",
            element: () => import("@/pages/invoice/InvoiceListPage"),
            children: [
              {
                id: "invoice-details",
                title: "Chi tiết",
                path: "invoice/list/details",
                element: () => import("@/pages/invoice/InvoiceDetailsPage"),
                hideInMenu: true,
              },
            ],
          },
        ],
      },
    ],
  },
  // TIỆN ÍCH
  {
    subheader: "Tiện ích",
    items: [
      {
        id: "mail",
        title: "Thư",
        path: "mail",
        icon: ICONS.mail,
        info: 32,
        element: () => import("@/pages/mail/MailPage"),
      },
      {
        id: "chat",
        title: "Trò chuyện",
        path: "chat",
        icon: ICONS.chat,
        element: () => import("@/pages/chat/ChatPage"),
      },
      {
        id: "calendar",
        title: "Lịch",
        path: "calendar",
        icon: ICONS.calendar,
        element: () => import("@/pages/calendar/CalendarPage"),
      },
    ],
  },
  // COMPONENTS
  {
    subheader: "Components",
    items: [
      {
        id: "components",
        title: "Components",
        path: "components",
        icon: ICONS.components,
        children: [
          {
            id: "data-table",
            title: "Data Table",
            path: "components/data-table",
            icon: ICONS.table,
            element: () => import("@/pages/grid-demo"),
          },
          {
            id: "form-fields",
            title: "Form Fields",
            path: "components/form-fields",
            icon: ICONS.components,
            element: () => import("@/pages/form-fields-demo"),
          },
          {
            id: "onlyoffice-editor",
            title: "OnlyOffice Editor",
            path: "components/onlyoffice-editor",
            icon: ICONS.editor,
            element: () => import("@/pages/onlyoffice"),
          },
        ],
      },
    ],
  },
  {
    subheader: "DEMO PROJECT",
    items: [
      {
        id: "demo-project",
        title: "DEMO PROJECT",
        path: "dashboard/demo-project",
        icon: ICONS.demo,
        children: [
          {
            id: "demo-app-page-container",
            title: "AppPageContainer Demo",
            path: "dashboard/demo-project/app-page-container",
            icon: ICONS.pageContainer,
            element: () => import("@/pages/demo-project/AppPageContainerDemoPage"),
          },
          {
            id: "demo-searchable-pro-table",
            title: "SearchableProTable Demo",
            path: "dashboard/demo-project/searchable-pro-table",
            icon: ICONS.searchableTable,
            element: () => import("@/pages/demo-project/SearchableProTableDemoPage"),
          },
          {
            id: "demo-person-list",
            title: "Con Người",
            path: "dashboard/demo-project/con-nguoi",
            icon: ICONS.person,
            element: () => import("@/pages/demo-project/PersonListPage"),
            children: [
              {
                id: "demo-person-create",
                title: "Thêm mới Con Người",
                path: "dashboard/demo-project/con-nguoi/create",
                element: () => import("@/pages/demo-project/PersonFormPage"),
                hideInMenu: true,
              },
              {
                id: "demo-person-edit",
                title: "Chỉnh sửa Con Người",
                path: "dashboard/demo-project/con-nguoi/:id/edit",
                element: () => import("@/pages/demo-project/PersonFormPage"),
                hideInMenu: true,
              },
            ],
          },
        ],
      },
    ],
  },
];
