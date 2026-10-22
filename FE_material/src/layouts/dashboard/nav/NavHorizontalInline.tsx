import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { alpha, useTheme } from "@mui/material/styles";
import Iconify from "@/components/iconify";
import NavItemBase, { HorizontalNavItem } from "./NavItemBase";
import { useRouterStore, selectRoutesConfig } from "@/store";
import { generateNavConfig, flattenNavItems } from "@/router/generate-nav";
import type { NavItemConfig } from "@/router/generate-nav";

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 36;
const MORE_BUTTON_WIDTH = 48;

// ----------------------------------------------------------------------

// More dropdown button (for overflow items)
function MoreDropdown({ items }: { items: NavItemConfig[] }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 100);
  };

  const handleClose = () => setOpen(false);

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{ position: "relative" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: ITEM_HEIGHT,
          width: MORE_BUTTON_WIDTH,
          borderRadius: 1,
          cursor: "pointer",
          color: open ? "primary.main" : "text.secondary",
          bgcolor: open ? alpha(theme.palette.primary.main, 0.08) : "transparent",
          transition: theme.transitions.create(["background-color", "color"]),
          "&:hover": {
            bgcolor: alpha(theme.palette.grey[500], 0.08),
          },
        }}
      >
        <Iconify icon="eva:more-horizontal-fill" width={20} />
      </Box>

      {open && (
        <Box
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            position: "absolute",
            top: "100%",
            right: 0,
            pt: 0.5,
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              width: 220,
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: theme.customShadows?.dropdown || theme.shadows[8],
              border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
              p: 1,
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            {items.map((item) => (
              <HorizontalNavItem
                key={item.title}
                item={item}
                variant="horizontal"
                depth={1}
                onClose={handleClose}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

export default function NavHorizontalInline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [visibleCount, setVisibleCount] = useState<number>(0);

  // Lấy routes config từ store và generate navConfig
  const routesConfig = useRouterStore(selectRoutesConfig);
  const navConfig = useMemo(() => generateNavConfig(routesConfig), [routesConfig]);

  // Flatten nav items - include ALL items (with and without children)
  const navItems = useMemo(() => flattenNavItems(navConfig), [navConfig]);

  // Calculate how many items can fit
  const calculateVisibleItems = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    let totalWidth = 0;
    let count = 0;

    // Reserve space for "more" button if needed
    const reservedWidth = navItems.length > 1 ? MORE_BUTTON_WIDTH + 8 : 0;
    const availableWidth = containerWidth - reservedWidth;

    for (let i = 0; i < navItems.length; i++) {
      const itemEl = itemsRef.current[i];
      if (itemEl) {
        const itemWidth = itemEl.offsetWidth + 4; // 4px gap
        if (totalWidth + itemWidth <= availableWidth) {
          totalWidth += itemWidth;
          count++;
        } else {
          break;
        }
      }
    }

    // If all items fit, show all
    if (count === navItems.length) {
      setVisibleCount(navItems.length);
    } else {
      // Otherwise show count items + more button
      setVisibleCount(Math.max(1, count));
    }
  }, [navItems.length]);

  // Initial measurement - render all items hidden to measure
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    if (!measured) {
      const timer = setTimeout(() => {
        calculateVisibleItems();
        setMeasured(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [measured, calculateVisibleItems]);

  // Recalculate on resize using ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleItems();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateVisibleItems]);

  const visibleItems = navItems.slice(0, visibleCount);
  const hiddenItems = navItems.slice(visibleCount);
  const hasMore = hiddenItems.length > 0;

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        alignItems: "center",
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Hidden items for measurement */}
      <Box
        sx={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        {navItems.map((item, index) => (
          <Box
            key={`measure-${item.title}`}
            ref={(el: HTMLDivElement | null) => {
              itemsRef.current[index] = el;
            }}
            sx={{ display: "inline-flex" }}
          >
            <NavItemBase item={item} variant="horizontal" depth={0} />
          </Box>
        ))}
      </Box>

      {/* Visible items */}
      <Stack direction="row" spacing={0.5} sx={{ overflow: "visible" }}>
        {visibleItems.map((item) => (
          <NavItemBase key={item.title} item={item} variant="horizontal" depth={0} />
        ))}
      </Stack>

      {/* More dropdown - hover to show */}
      {hasMore && <MoreDropdown items={hiddenItems} />}
    </Box>
  );
}
