import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

export interface BreadcrumbItem {
  title: ReactNode;
  path?: string;
}

export interface AppPageTabItem {
  key: string;
  tab: ReactNode;
  disabled?: boolean;
  badge?: number | string;
}

export interface AppPageContainerProps {
  title?: ReactNode;
  hideTitle?: boolean;
  subTitle?: ReactNode;
  content?: ReactNode;
  extra?: ReactNode;
  onBack?: () => void;
  breadcrumb?: BreadcrumbItem[] | false;
  tabList?: AppPageTabItem[];
  tabActiveKey?: string;
  onTabChange?: (key: string) => void;
  tabBarExtraContent?: ReactNode;
  /** Header luôn nằm ngoài vùng cuộn; bật hiệu ứng nền mờ và viền phân cách. */
  fixedHeader?: boolean;
  loading?: boolean;
  footer?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  children?: ReactNode;
  sx?: SxProps<Theme>;
  className?: string;
}
