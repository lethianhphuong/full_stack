import Stack from "@mui/material/Stack";
import NavItemBase from "./NavItemBase";
import type { NavSectionConfig } from "@/router/generate-nav";

// ----------------------------------------------------------------------

type NavSectionMiniProps = {
  data: NavSectionConfig[];
};

export default function NavSectionMini({ data }: NavSectionMiniProps) {
  // Flatten all items from all sections for mini view
  const allItems = data.flatMap((section) => section.items);

  return (
    <Stack
      spacing={0.5}
      sx={{
        px: 1,
        py: 1,
        alignItems: "center",
      }}
    >
      {allItems.map((item) => (
        <NavItemBase key={item.title} item={item} variant="mini" />
      ))}
    </Stack>
  );
}
