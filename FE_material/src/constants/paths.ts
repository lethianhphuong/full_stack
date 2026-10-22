// Route paths
export const PATHS = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  // Dashboard
  dashboard: {
    root: '/dashboard',
    ecommerce: '/dashboard/ecommerce',
    analytics: '/dashboard/analytics',
    banking: '/dashboard/banking',
  },
  // User
  user: {
    list: '/dashboard/user/list',
    create: '/dashboard/user/create',
    edit: '/dashboard/user/edit',
    account: '/dashboard/user/account',
  },
  // Product
  product: {
    list: '/dashboard/product/list',
    create: '/dashboard/product/create',
  },
  // Order
  order: {
    list: '/dashboard/order/list',
    details: '/dashboard/order/details',
  },
  // Invoice
  invoice: {
    list: '/dashboard/invoice/list',
    create: '/dashboard/invoice/create',
  },
  demoProject: {
    appPageContainer: '/dashboard/demo-project/app-page-container',
    searchableProTable: '/dashboard/demo-project/searchable-pro-table',
    personList: '/dashboard/demo-project/con-nguoi',
    personCreate: '/dashboard/demo-project/con-nguoi/create',
    personEdit: (id: string) => `/dashboard/demo-project/con-nguoi/${id}/edit`,
  },
  // Error
  error: {
    page404: '/404',
    page500: '/500',
  },
} as const;
