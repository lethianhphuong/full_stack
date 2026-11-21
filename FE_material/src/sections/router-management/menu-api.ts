import { apiClient, type ApiResponse } from '@/services/apiClient';
import type { ManagedRoute, ManagedRouteSection } from './types';

// ---- Kiểu dữ liệu API trả về (khớp MenuVO / MenuItemDTO bên BE) ----
export type MenuItemApi = {
  id: string;
  sectionId: string;
  parentId?: string | null;
  title: string;
  path?: string | null;
  icon?: string | null;
  sortOrder?: number;
  isIndex?: boolean;
  isHidden?: boolean;
  isActive?: boolean;
  children?: MenuItemApi[];
};

export type MenuSectionApi = {
  id: string;
  title?: string | null;
  isActive?: string | boolean;
  children?: MenuItemApi[]; // Menu cấp 1 của nhóm, cấp 2, 3... nằm trong children của từng item
};

type SpringPage<T> = { content: T[]; totalElements: number; totalPages: number; number: number; size: number };

// ---- Map 1 item API -> ManagedRoute (đệ quy cho children) ----
function mapMenuItem(item: MenuItemApi): ManagedRoute {
  const children = (item.children ?? [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(mapMenuItem);

  return {
    id: item.id,
    title: item.title,
    path: item.path ?? '',
    ...(item.icon ? { icon: item.icon } : {}),
    ...(item.isIndex ? { index: true } : {}),
    ...(item.isHidden ? { hideInMenu: true } : {}),
    ...(children.length ? { children } : {}),
  };
}

// ---- Map danh sách nhóm API -> cấu trúc ManagedRouteSection[] ----
// section.title    -> subheader
// section.children -> items
export function mapMenuApiToManagedRoutes(sections: MenuSectionApi[]): ManagedRouteSection[] {
  return sections.map((section) => ({
    subheader: section.title ?? '',
    items: (section.children ?? [])
      .slice()
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(mapMenuItem),
  }));
}

// ---- Gọi API GET /api/v1/menu (interceptor đã trả thẳng response.data) ----
export async function fetchManagedRoutes(): Promise<ManagedRouteSection[]> {
  const res = (await apiClient.get('/menu', { params: { page: 0, size: 1000, sort: 'sortOrder,asc' } })) as unknown as ApiResponse<
    SpringPage<MenuSectionApi>
  >;
  return mapMenuApiToManagedRoutes(res.data?.content ?? []);
}
