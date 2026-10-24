export type ManagedRoute = {
  id: string;
  title: string;
  path: string;
  icon?: string;
  children?: ManagedRoute[];
  index?: boolean;
  hideInMenu?: boolean;
  info?: string | number;
};

export type ManagedRouteSection = { subheader: string; items: ManagedRoute[] };
export type RouteDestination = { section: string; parentId?: string; index?: number };

export type RouterRowItem = Omit<ManagedRoute, 'children'> & {
  inheritsIcon?: boolean;
  level: number;
  sectionId: string;
  sectionTitle: string;
  parentId?: string;
  stt: string;
  children?: RouterRowItem[];
  isIndex?: boolean;
  hideInMenu?: boolean;
  info?: string | number;
};

export type SubheaderSection = {
  id: string;
  title: string;
  routeCount: number;
  items: RouterRowItem[];
};

export type FilterState = {
  search: string;
  subheader: string;
};

export type RouteEditorValues = {
  title: string;
  path: string;
  section: string;
  parentId: string;
  icon: string;
  info: string;
  index: boolean;
  hideInMenu: boolean;
  newSectionName?: string;
};
