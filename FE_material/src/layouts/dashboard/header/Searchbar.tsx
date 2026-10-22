import { useState, useCallback, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { alpha, styled } from "@mui/material/styles";
import { useNavigate } from "react-router";
import Iconify from "../../../components/iconify";
import { useRouterStore, selectRoutesConfig } from "@/store";
import type { RouteConfig, RouteSectionConfig } from "@/router/routes-config";

// ----------------------------------------------------------------------

type SearchItem = {
  title: string;
  path: string;
  icon?: string;
  breadcrumb: string; // Đường dẫn menu cha > con
};

// ----------------------------------------------------------------------

const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  paddingTop: theme.spacing(12),
}));

const StyledSearchContainer = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 560,
  backgroundColor: theme.palette.background.paper,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  boxShadow: theme.customShadows.dialog,
  overflow: "hidden",
}));

const StyledSearchInput = styled(InputBase)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2, 2.5),
  borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.24)}`,
  "& input": {
    fontSize: 16,
  },
}));

// ----------------------------------------------------------------------

/**
 * Flatten routes config to search items (recursive)
 */
function flattenRoutesToSearchItems(
  sections: RouteSectionConfig[],
  basePath: string = "",
): SearchItem[] {
  const items: SearchItem[] = [];

  function processRoute(
    route: RouteConfig,
    parentIcon?: string,
    parentPath: string[] = [], // Track parent titles for breadcrumb
  ) {
    // Skip hidden items
    if (route.hideInMenu) return;

    const path = `${basePath}/${route.path}`;
    const icon = route.icon || parentIcon;
    const currentPath = [...parentPath, route.title];

    // Add this item to search
    items.push({
      title: route.title,
      path,
      icon,
      breadcrumb: parentPath.length > 0 ? parentPath.join(" > ") : path,
    });

    // Process children with updated breadcrumb path
    if (route.children) {
      route.children.forEach((child) => processRoute(child, icon, currentPath));
    }
  }

  sections.forEach((section) => {
    section.items.forEach((item) => processRoute(item, undefined, []));
  });

  return items;
}

// ----------------------------------------------------------------------

export default function Searchbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Get routes config from store
  const routesConfig = useRouterStore(selectRoutesConfig);

  // Generate search items from routes config
  const searchItems = useMemo(
    () => flattenRoutesToSearchItems(routesConfig),
    [routesConfig],
  );

  // Suggested items (first 6)
  const suggestedItems = useMemo(() => searchItems.slice(0, 6), [searchItems]);

  // Detect OS for keyboard shortcut display
  const isMac = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearchQuery("");
    setSelectedIndex(0);
  }, []);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      setSelectedIndex(0);
    },
    [],
  );

  const handleClick = useCallback(
    (path: string) => {
      handleClose();
      navigate(path);
    },
    [handleClose, navigate],
  );

  // Filter items based on search query
  const filteredItems = searchQuery
    ? searchItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.breadcrumb.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : suggestedItems;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        if (open) {
          handleClose();
        } else {
          handleOpen();
        }
        return;
      }

      if (!open) return;

      // Close with Escape
      if (event.key === "Escape") {
        handleClose();
        return;
      }

      // Navigate with arrow keys
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0,
        );
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1,
        );
      }

      // Select with Enter
      if (event.key === "Enter" && filteredItems.length > 0) {
        event.preventDefault();
        handleClick(filteredItems[selectedIndex].path);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    open,
    handleOpen,
    handleClose,
    handleClick,
    filteredItems,
    selectedIndex,
  ]);

  return (
    <>
      {/* Search Trigger Button */}
      <Box
        onClick={handleOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.25,
          py: 0.75,
          borderRadius: 1.5,
          cursor: "pointer",
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          border: (theme) =>
            `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
          transition: (theme) =>
            theme.transitions.create(["background-color", "box-shadow"]),
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16),
          },
        }}
      >
        <Iconify
          icon="eva:search-fill"
          width={20}
          sx={{ color: "text.disabled" }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.25,
            px: 0.75,
            py: 0.25,
            borderRadius: 0.75,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
            typography: "caption",
            fontWeight: 700,
            color: "text.secondary",
            fontSize: 11,
          }}
        >
          {isMac ? "⌘" : "Ctrl"}
          <Box component="span" sx={{ ml: 0.125 }}>K</Box>
        </Box>
      </Box>

      <StyledModal open={open} onClose={handleClose}>
        <StyledSearchContainer>
          <StyledSearchInput
            autoFocus
            fullWidth
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={handleSearch}
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  width={20}
                  sx={{ color: "text.disabled" }}
                />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 0.75,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                    typography: "caption",
                    color: "text.secondary",
                    fontWeight: 600,
                  }}
                >
                  ESC
                </Box>
              </InputAdornment>
            }
          />

          {/* Scrollable Results Area */}
          <Box sx={{ maxHeight: 320, overflow: "auto", p: 1 }}>
            {/* Section Header */}
            <Typography
              variant="caption"
              sx={{
                display: "block",
                px: 1.5,
                py: 1,
                color: "text.secondary",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {searchQuery ? `Kết quả cho "${searchQuery}"` : "Gợi ý"}
            </Typography>

            {/* Results List */}
            <List disablePadding>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <ListItemButton
                    key={item.path}
                    onClick={() => handleClick(item.path)}
                    selected={index === selectedIndex}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      border: "dashed 1px transparent",
                      borderBottom: (theme) =>
                        `dashed 1px ${alpha(theme.palette.grey[500], 0.24)}`,
                      "&:hover": {
                        border: (theme) =>
                          `dashed 1px ${alpha(theme.palette.grey[500], 0.48)}`,
                      },
                      "&.Mui-selected": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.08),
                        border: (theme) =>
                          `dashed 1px ${alpha(theme.palette.primary.main, 0.48)}`,
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.16),
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 1,
                          bgcolor: (theme) =>
                            alpha(theme.palette.grey[500], 0.08),
                        }}
                      >
                        <Iconify
                          icon={item.icon || "solar:document-bold-duotone"}
                          width={20}
                          sx={{
                            color:
                              index === selectedIndex
                                ? "primary.main"
                                : "text.secondary",
                          }}
                        />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      secondary={item.breadcrumb}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: index === selectedIndex ? 600 : 400,
                      }}
                      secondaryTypographyProps={{
                        variant: "caption",
                        sx: { color: "text.disabled" },
                      }}
                    />
                    {index === selectedIndex && (
                      <Box
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: 0.5,
                          bgcolor: (theme) =>
                            alpha(theme.palette.grey[500], 0.12),
                          typography: "caption",
                          color: "text.secondary",
                          fontWeight: 600,
                          fontSize: 10,
                        }}
                      >
                        Enter
                      </Box>
                    )}
                  </ListItemButton>
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Iconify
                    icon="solar:magnifer-zoom-in-bold-duotone"
                    width={48}
                    sx={{ color: "text.disabled", mb: 1 }}
                  />
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Không tìm thấy kết quả cho "{searchQuery}"
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    Thử tìm kiếm trang, người dùng hoặc cài đặt
                  </Typography>
                </Box>
              )}
            </List>
          </Box>

          {/* Fixed Keyboard hints footer */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              px: 2.5,
              py: 1.5,
              borderTop: (theme) =>
                `dashed 1px ${alpha(theme.palette.grey[500], 0.24)}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 0.5,
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                  typography: "caption",
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                ↑↓
              </Box>
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                Di chuyển
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 0.5,
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                  typography: "caption",
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                Enter
              </Box>
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                Chọn
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 0.5,
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                  typography: "caption",
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                Esc
              </Box>
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                Đóng
              </Typography>
            </Box>
          </Box>
        </StyledSearchContainer>
      </StyledModal>
    </>
  );
}
