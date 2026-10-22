import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles";
import Logo from "../../../components/logo";
import Scrollbar from "../../../components/scrollbar";
import NavSection from "./NavSection";
import NavSectionMini from "./NavSectionMini";
import NavToggleButton from "./NavToggleButton";
import {
  usePreferencesStore,
  useRouterStore,
  selectRoutesConfig,
} from "@/store";
import { generateNavConfig } from "@/router/generate-nav";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;
const NAV_MINI_WIDTH = 88;

// ----------------------------------------------------------------------

type Props = {
  openNav: boolean;
  onCloseNav: () => void;
};

export default function Nav({ openNav, onCloseNav }: Props) {
  const { pathname } = useLocation();
  const theme = useTheme();
  const themeLayout = usePreferencesStore((state) => state.themeLayout);
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const isMini = themeLayout === "mini";

  // Lấy routes config từ store và generate navConfig
  const routesConfig = useRouterStore(selectRoutesConfig);
  const navConfig = useMemo(
    () => generateNavConfig(routesConfig),
    [routesConfig],
  );

  // Sidebar và Content cùng màu theo theme mode
  const isLight = theme.palette.mode === "light";
  const sidebarBgColor = isLight ? "#FFFFFF" : theme.palette.grey[900];
  const sidebarTextColor = isLight ? theme.palette.grey[800] : "#FFFFFF";

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Fixed header (Logo + Account)
  const renderHeader = (
    <Box sx={{ flexShrink: 0 }}>
      {/* Logo */}
      <Box
        sx={{
          px: isMini ? 1 : 2.5,
          py: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: isMini ? "center" : "flex-start",
        }}
      >
        <Logo />
        {!isMini && (
          <Typography
            variant="subtitle1"
            sx={{ ml: 1, fontWeight: 700, color: sidebarTextColor }}
          >
            DỰ ÁN ...
          </Typography>
        )}
      </Box>
    </Box>
  );

  // Scrollable navigation content
  const renderNavigation = (
    <Scrollbar
      sx={{
        flex: 1,
        overflow: "auto",
        // Ẩn scrollbar chỉ ở mini mode
        ...(isMini && {
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }),
      }}
    >
      {/* Navigation */}
      {isMini ? (
        <NavSectionMini data={navConfig} />
      ) : (
        <NavSection data={navConfig} />
      )}
    </Scrollbar>
  );

  // Fixed footer (Upgrade card)
  const renderFooter = !isMini && (
    <Box sx={{ flexShrink: 0, px: 2.5, pb: 3, pt: 2 }}>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          position: "relative",
          overflow: "hidden",
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        }}
      >
        <Box
          sx={{
            top: 0,
            right: 0,
            width: 80,
            height: 80,
            position: "absolute",
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.1)",
            transform: "translate(30%, -30%)",
          }}
        />
        <Box
          sx={{
            bottom: 0,
            right: 0,
            width: 120,
            height: 120,
            position: "absolute",
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.08)",
            transform: "translate(50%, 50%)",
          }}
        />
        <Stack spacing={1} sx={{ position: "relative", zIndex: 1 }}>
          <Box
            component="button"
            sx={{
              mt: 1,
              py: 0.75,
              px: 2,
              border: "none",
              borderRadius: 1,
              bgcolor: "white",
              color: "primary.main",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              width: "fit-content",
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            FOOTER
          </Box>
        </Stack>
      </Box>
    </Box>
  );

  const renderContent = (
    <Box sx={{ height: 1, display: "flex", flexDirection: "column" }}>
      {renderHeader}
      {renderNavigation}
      {renderFooter}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: isMini ? NAV_MINI_WIDTH : NAV_WIDTH },
        transition: (theme) =>
          theme.transitions.create("width", {
            duration: theme.transitions.duration.standard,
          }),
      }}
    >
      <NavToggleButton />

      {isDesktop ? (
        <Box
          sx={{
            height: 1,
            position: "fixed",
            width: isMini ? NAV_MINI_WIDTH : NAV_WIDTH,
            bgcolor: sidebarBgColor,
            borderRight: (theme) =>
              `dashed 1px ${alpha(theme.palette.grey[500], 0.24)}`,
            transition: (theme) =>
              theme.transitions.create(["width", "background-color"], {
                duration: theme.transitions.duration.standard,
              }),
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: sidebarBgColor,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
