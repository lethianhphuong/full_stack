import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import NavItemBase from "./NavItemBase";
import type { NavSectionConfig } from "@/router/generate-nav";

// ----------------------------------------------------------------------

type NavSectionProps = {
  data: NavSectionConfig[];
};

export default function NavSection({ data }: NavSectionProps) {
  return (
    <Stack spacing={3} sx={{ px: 2 }}>
      {data.map((section) => (
        <Box key={section.subheader}>
          <Box
            component="span"
            sx={{
              display: "block",
              color: "text.disabled",
              typography: "overline",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.1,
              px: 1.5,
              mb: 1,
            }}
          >
            {section.subheader}
          </Box>
          <List disablePadding>
            {section.items.map((item) => (
              <NavItemBase key={item.title} item={item} variant="vertical" />
            ))}
          </List>
        </Box>
      ))}
    </Stack>
  );
}
