import type { Theme } from '@mui/material/styles';
import { button } from './components/button';
import { card } from './components/card';
import { paper } from './components/paper';
import { input } from './components/input';
import { table } from './components/table';
import { drawer } from './components/drawer';
import { dialog } from './components/dialog';
import { avatar } from './components/avatar';
import { tooltip } from './components/tooltip';
import { popover } from './components/popover';
import { appBar } from './components/appbar';
import { list } from './components/list';
import { tabs } from './components/tabs';
import { chip } from './components/chip';
import { menu } from './components/menu';
import { link } from './components/link';
import { badge } from './components/badge';
import { cssBaseline } from './components/css-baseline';
import { svgIcon } from './components/svg-icon';
import { fab } from './components/fab';
import { accordion } from './components/accordion';
import { typography } from './components/typography';
import { pagination } from './components/pagination';
import { breadcrumbs } from './components/breadcrumbs';
import { backdrop } from './components/backdrop';

// ----------------------------------------------------------------------

export function componentsOverrides(theme: Theme) {
  return Object.assign(
    fab(theme),
    tabs(theme),
    chip(theme),
    card(theme),
    menu(theme),
    link(theme),
    input(theme),
    table(theme),
    paper(theme),
    badge(theme),
    button(theme),
    dialog(theme),
    drawer(theme),
    avatar(theme),
    appBar(theme),
    tooltip(theme),
    popover(theme),
    svgIcon(theme),
    backdrop(theme),
    accordion(theme),
    typography(theme),
    pagination(theme),
    breadcrumbs(theme),
    cssBaseline(theme),
    list(theme),
  );
}
