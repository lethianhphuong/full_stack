import { useState, useRef } from "react";
import { NavLink as RouterLink, useLocation } from "react-router";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { alpha, styled, useTheme } from "@mui/material/styles";
import type { Theme, SxProps } from "@mui/material/styles";
import Iconify from "@/components/iconify";
import type { NavItemConfig } from "@/router/generate-nav";

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type NavVariant = "vertical" | "mini" | "horizontal";

export type NavItemBaseProps = {
  item: NavItemConfig;
  variant: NavVariant;
  depth?: number;
  onClose?: () => void;
};

// ----------------------------------------------------------------------
// Utility
// ----------------------------------------------------------------------

const normalizeNavPath = (path?: string) => {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
};

export function isNestedChildActive(item: NavItemConfig, pathname: string): boolean {
  const norm = normalizeNavPath(item.path);
  if (norm && (pathname === norm || pathname.startsWith(norm + "/"))) return true;
  if (item.children) return item.children.some((child) => isNestedChildActive(child, pathname));
  return false;
}

// ----------------------------------------------------------------------
// Styled Components
// ----------------------------------------------------------------------

const StyledVerticalItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "depth",
})<{ active?: boolean; depth?: number; component?: React.ElementType; to?: string }>(
  ({ theme, active, depth = 0 }) => ({
    height: depth > 0 ? 36 : 44,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1.5),
    borderRadius: Number(theme.shape.borderRadius),
    marginBottom: theme.spacing(0.5),
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    backgroundColor: active ? alpha(theme.palette.primary.main, 0.08) : "transparent",
    "&:hover": {
      backgroundColor: active
        ? alpha(theme.palette.primary.main, 0.16)
        : alpha(theme.palette.grey[500], 0.08),
    },
  })
);

const StyledVerticalSubItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean; component?: React.ElementType; to?: string }>(({ theme, active }) => ({
  height: 36,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1.5),
  borderRadius: Number(theme.shape.borderRadius),
  marginLeft: 20,
  marginBottom: theme.spacing(0.5),
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  position: "relative",
  overflow: "visible",
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.08) : "transparent",
  "&::after": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: -20,
    width: 20,
    height: 20,
    borderLeft: `1px solid ${alpha(theme.palette.grey[500], 0.24)}`,
    borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.24)}`,
    borderBottomLeftRadius: 12,
    transform: "translateY(-100%)",
  },
  "&:hover": {
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.16)
      : alpha(theme.palette.grey[500], 0.08),
  },
}));

const StyledSubMenuContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  marginLeft: 28,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "1px",
    height: "calc(100% - 18px)",
    backgroundColor: alpha(theme.palette.grey[500], 0.24),
    zIndex: 1,
  },
}));

const StyledMiniItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean; component?: React.ElementType; to?: string }>(({ theme, active }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: 72,
  height: 72,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  cursor: "pointer",
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.08) : "transparent",
  transition: theme.transitions.create(["background-color", "color"], {
    duration: theme.transitions.duration.shorter,
  }),
  "&:hover": {
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.16)
      : alpha(theme.palette.grey[500], 0.08),
  },
}));

const StyledPopoverItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean; component?: React.ElementType; to?: string }>(({ theme, active }) => ({
  height: 36,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  borderRadius: Number(theme.shape.borderRadius),
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.08) : "transparent",
  "&:hover": {
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.16)
      : alpha(theme.palette.grey[500], 0.08),
  },
}));

const StyledHorizontalItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean; component?: React.ElementType | string; to?: string }>(({ theme, active }) => ({
  height: 40,
  minWidth: 0,
  borderRadius: Number(theme.shape.borderRadius),
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.08) : "transparent",
  "&:hover": {
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.16)
      : alpha(theme.palette.grey[500], 0.08),
  },
}));

const NavItemIcon = styled(ListItemIcon)(({ theme }) => ({
  width: 24,
  height: 24,
  minWidth: 24,
  marginRight: theme.spacing(1.5),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

// ----------------------------------------------------------------------
// Badge Components
// ----------------------------------------------------------------------

function NavBadge({ info }: { info?: string | number }) {
  if (!info) return null;
  return (
    <Box
      component="span"
      sx={{
        ml: 1,
        px: 0.75,
        py: 0.25,
        minWidth: 22,
        height: 22,
        borderRadius: "6px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        color: "primary.contrastText",
        bgcolor: "primary.main",
      }}
    >
      +{info}
    </Box>
  );
}

function NavBadgeMini({ info }: { info?: string | number }) {
  if (!info) return null;
  return (
    <Box
      component="span"
      sx={{
        position: "absolute",
        top: 4,
        right: 4,
        minWidth: 18,
        height: 18,
        px: 0.5,
        borderRadius: "9px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        fontWeight: 700,
        color: "primary.contrastText",
        bgcolor: "primary.main",
      }}
    >
      {info}
    </Box>
  );
}

// ----------------------------------------------------------------------
// Dropdown Paper
// ----------------------------------------------------------------------

function DropdownPaper({ children, sx }: { children: React.ReactNode; sx?: SxProps<Theme> }) {
  const theme = useTheme();
  return (
    <Paper
      elevation={8}
      sx={{
        p: 1,
        minWidth: 180,
        maxWidth: 220,
        borderRadius: 1.5,
        bgcolor: "background.paper",
        boxShadow: theme.customShadows?.dropdown || theme.shadows[8],
        border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}

// ----------------------------------------------------------------------
// VERTICAL SIDEBAR
// ----------------------------------------------------------------------

function VerticalNavItem({ item, depth = 0 }: NavItemBaseProps) {
  const { pathname } = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const norm = normalizeNavPath(item.path);
  const active = !!norm && (pathname === norm || pathname.startsWith(norm + "/"));
  const isChildActive = hasChildren && isNestedChildActive(item, pathname);
  const [open, setOpen] = useState(isChildActive || false);

  // Top-level item with children
  if (depth === 0 && hasChildren) {
    return (
      <>
        <Tooltip title={item.title} placement="right" arrow>
          <StyledVerticalItem active={active || isChildActive} depth={depth} onClick={() => setOpen(!open)}>
            {item.icon && (
              <NavItemIcon>
                <Iconify icon={item.icon} width={24} />
              </NavItemIcon>
            )}
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{ variant: "body2", fontWeight: active || isChildActive ? 600 : 400, noWrap: true }}
            />
            <Iconify
              icon={open ? "eva:arrow-ios-downward-fill" : "eva:arrow-ios-forward-fill"}
              width={16}
              sx={{ ml: 1, flexShrink: 0 }}
            />
          </StyledVerticalItem>
        </Tooltip>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <StyledSubMenuContainer>
            {item.children?.map((child) => (
              <VerticalNavItem key={child.title} item={child} variant="vertical" depth={depth + 1} />
            ))}
          </StyledSubMenuContainer>
        </Collapse>
      </>
    );
  }

  // Top-level leaf item
  if (depth === 0) {
    return (
      <Tooltip title={item.title} placement="right" arrow>
        <StyledVerticalItem component={RouterLink} to={norm} active={active} depth={depth}>
          {item.icon && (
            <NavItemIcon>
              <Iconify icon={item.icon} width={24} />
            </NavItemIcon>
          )}
          <ListItemText
            primary={item.title}
            primaryTypographyProps={{ variant: "body2", fontWeight: active ? 600 : 400, noWrap: true }}
          />
          <NavBadge info={item.info} />
        </StyledVerticalItem>
      </Tooltip>
    );
  }

  // Sub-item with children
  if (hasChildren) {
    return (
      <>
        <Tooltip title={item.title} placement="right" arrow>
          <StyledVerticalSubItem active={active || isChildActive} onClick={() => setOpen(!open)} sx={{ pr: 1 }}>
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{ variant: "body2", fontWeight: active || isChildActive ? 600 : 400, noWrap: true }}
            />
            <Iconify
              icon={open ? "eva:arrow-ios-downward-fill" : "eva:arrow-ios-forward-fill"}
              width={16}
              sx={{ ml: 1, flexShrink: 0 }}
            />
          </StyledVerticalSubItem>
        </Tooltip>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ pl: 2 }}>
            {item.children?.map((child) => (
              <VerticalNavItem key={child.title} item={child} variant="vertical" depth={depth + 1} />
            ))}
          </Box>
        </Collapse>
      </>
    );
  }

  // Sub-item leaf
  return (
    <Tooltip title={item.title} placement="right" arrow>
      <StyledVerticalSubItem component={RouterLink} to={norm} active={active}>
        <ListItemText
          primary={item.title}
          primaryTypographyProps={{ variant: "body2", fontWeight: active ? 600 : 400, noWrap: true }}
        />
      </StyledVerticalSubItem>
    </Tooltip>
  );
}

// ----------------------------------------------------------------------
// MINI SIDEBAR
// ----------------------------------------------------------------------

function MiniPopoverItem({ item, onClose }: NavItemBaseProps) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasChildren = item.children && item.children.length > 0;
  const norm = normalizeNavPath(item.path);
  const active = !!norm && (pathname === norm || pathname.startsWith(norm + "/"));
  const isChildActive = hasChildren && isNestedChildActive(item, pathname);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (hasChildren) setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  if (!hasChildren) {
    return (
      <Tooltip title={item.title} placement="top" arrow>
        <StyledPopoverItem component={RouterLink} to={norm} active={active} onClick={() => onClose?.()}>
          <ListItemText
            primary={item.title}
            primaryTypographyProps={{
              variant: "body2",
              fontWeight: active ? 600 : 400,
              noWrap: true,
              sx: { overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 },
            }}
          />
        </StyledPopoverItem>
      </Tooltip>
    );
  }

  return (
    <Box ref={anchorRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Tooltip title={item.title} placement="top" arrow>
        <StyledPopoverItem active={active || isChildActive || open} sx={{ pr: 1 }}>
          <ListItemText
            primary={item.title}
            primaryTypographyProps={{
              variant: "body2",
              fontWeight: active || isChildActive ? 600 : 400,
              noWrap: true,
              sx: { overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 },
            }}
          />
          <Iconify icon="eva:arrow-ios-forward-fill" width={16} sx={{ flexShrink: 0 }} />
        </StyledPopoverItem>
      </Tooltip>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="right-start"
        transition
        sx={{ zIndex: 1400 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Box 
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
              sx={{ pl: 0.5 }}
            >
              <DropdownPaper>
                {item.children?.map((child) => (
                  <MiniPopoverItem key={child.title} item={child} variant="mini" onClose={onClose} />
                ))}
              </DropdownPaper>
            </Box>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}

function MiniNavItem({ item }: NavItemBaseProps) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = hasChildren && isNestedChildActive(item, pathname);
  const norm = normalizeNavPath(item.path);
  const active = (!!norm && (pathname === norm || pathname.startsWith(norm + "/"))) || isChildActive;

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (hasChildren) setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  const handleClose = () => setOpen(false);

  if (!hasChildren) {
    return (
      <Tooltip title={item.title} placement="right" arrow>
        <StyledMiniItem component={RouterLink} to={norm} active={active} sx={{ textDecoration: "none", position: "relative" }}>
          {item.icon && <Iconify icon={item.icon} width={24} sx={{ mb: 0.5 }} />}
          <Typography
            variant="caption"
            sx={{ fontSize: 10, fontWeight: active ? 600 : 400, lineHeight: 1.2, textAlign: "center", maxWidth: 64, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {item.title}
          </Typography>
          <NavBadgeMini info={item.info} />
        </StyledMiniItem>
      </Tooltip>
    );
  }

  return (
    <Box ref={anchorRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Tooltip title={item.title} placement="right" arrow>
        <StyledMiniItem active={active} sx={{ position: "relative" }}>
          {item.icon && <Iconify icon={item.icon} width={24} sx={{ mb: 0.5 }} />}
          <Typography
            variant="caption"
            sx={{ fontSize: 10, fontWeight: active ? 600 : 400, lineHeight: 1.2, textAlign: "center", maxWidth: 64, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {item.title}
          </Typography>
          <Iconify icon="eva:chevron-right-fill" width={16} sx={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", opacity: 0.48 }} />
        </StyledMiniItem>
      </Tooltip>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="right-start"
        transition
        sx={{ zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Box 
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
              sx={{ pl: 0.5 }}
            >
              <DropdownPaper>
                {item.children?.map((child) => (
                  <MiniPopoverItem key={child.title} item={child} variant="mini" onClose={handleClose} />
                ))}
              </DropdownPaper>
            </Box>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}

// ----------------------------------------------------------------------
// HORIZONTAL HEADER
// ----------------------------------------------------------------------

function HorizontalNavItem({ item, depth = 0, onClose }: NavItemBaseProps) {
  const { pathname } = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasChildren = item.children && item.children.length > 0;
  const norm = normalizeNavPath(item.path);
  const active = !!norm && (pathname === norm || pathname.startsWith(norm + "/"));
  const isChildActive = hasChildren && isNestedChildActive(item, pathname);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (hasChildren) setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  const handleClick = () => {
    if (!hasChildren && onClose) onClose();
  };

  // Top-level item
  if (depth === 0) {
    const content = (
      <Box
        component={hasChildren ? "div" : RouterLink}
        to={hasChildren ? undefined : norm}
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          height: 36,
          px: 1.5,
          borderRadius: 1,
          textDecoration: "none",
          whiteSpace: "nowrap",
          cursor: "pointer",
          color: active || isChildActive || open ? "primary.main" : "text.secondary",
          fontSize: 14,
          fontWeight: active || isChildActive ? 600 : 500,
          bgcolor: active || isChildActive || open ? alpha(theme.palette.primary.main, 0.08) : "transparent",
          transition: theme.transitions.create(["background-color", "color"]),
          "&:hover": { bgcolor: alpha(theme.palette.grey[500], 0.08) },
        }}
      >
        {item.icon && <Iconify icon={item.icon} width={20} sx={{ mr: 1, flexShrink: 0 }} />}
        {item.title}
        {hasChildren && (
          <Iconify icon={open ? "eva:arrow-ios-upward-fill" : "eva:arrow-ios-downward-fill"} width={16} sx={{ ml: 0.5, flexShrink: 0 }} />
        )}
      </Box>
    );

    if (!hasChildren) return content;

    return (
      <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ position: "relative" }}>
        {content}
        {open && (
          <Box 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave} 
            sx={{ position: "absolute", top: "100%", left: 0, pt: 0.5, zIndex: 9999 }}
          >
            <DropdownPaper sx={{ width: 200 }}>
              {item.children?.map((child) => (
                <HorizontalNavItem key={child.title} item={child} variant="horizontal" depth={depth + 1} onClose={onClose || (() => setOpen(false))} />
              ))}
            </DropdownPaper>
          </Box>
        )}
      </Box>
    );
  }

  // Dropdown item
  const dropdownItem = (
    <Tooltip title={item.title} placement="right" arrow>
      <StyledHorizontalItem
        component={hasChildren ? "div" : RouterLink}
        to={hasChildren ? undefined : norm}
        onClick={handleClick}
        active={active || isChildActive || open}
      >
        {item.icon && (
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Iconify icon={item.icon} width={20} />
          </ListItemIcon>
        )}
        <ListItemText
          primary={item.title}
          primaryTypographyProps={{
            variant: "body2",
            fontWeight: active || isChildActive ? 600 : 400,
            noWrap: true,
            sx: { overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 },
          }}
        />
        {hasChildren && <Iconify icon="eva:arrow-ios-forward-fill" width={16} sx={{ flexShrink: 0 }} />}
      </StyledHorizontalItem>
    </Tooltip>
  );

  if (!hasChildren) return dropdownItem;

  return (
    <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ position: "relative" }}>
      {dropdownItem}
      {open && (
        <Box 
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave} 
          sx={{ position: "absolute", top: 0, left: "100%", pl: 0.5, zIndex: 9999 + depth }}
        >
          <DropdownPaper sx={{ width: 200 }}>
            {item.children?.map((child) => (
              <HorizontalNavItem key={child.title} item={child} variant="horizontal" depth={depth + 1} onClose={onClose} />
            ))}
          </DropdownPaper>
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------
// MAIN EXPORT
// ----------------------------------------------------------------------

export default function NavItemBase(props: NavItemBaseProps) {
  switch (props.variant) {
    case "vertical":
      return <VerticalNavItem {...props} />;
    case "mini":
      return <MiniNavItem {...props} />;
    case "horizontal":
      return <HorizontalNavItem {...props} />;
    default:
      return <VerticalNavItem {...props} />;
  }
}

export { VerticalNavItem, MiniNavItem, MiniPopoverItem, HorizontalNavItem };
