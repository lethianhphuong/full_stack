import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha, styled, useTheme } from "@mui/material/styles";
import type { ThemeTransition } from "@/types/settings";

// ----------------------------------------------------------------------

type Props = {
  value: ThemeTransition;
  onChange: (value: ThemeTransition) => void;
};

const transitions: { value: ThemeTransition; label: string }[] = [
  { value: "fade", label: "fade" },
  { value: "fade-slide", label: "fade-slide" },
  { value: "fade-up", label: "fade-up" },
  { value: "fade-down", label: "fade-down" },
  { value: "fade-zoom", label: "fade-zoom" },
];

// Animation variants for preview
const previewAnimations: Record<
  ThemeTransition,
  { animate: Record<string, number[]>; transition: object }
> = {
  fade: {
    animate: { opacity: [0.2, 1, 0.2] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
  "fade-slide": {
    animate: { opacity: [0, 1, 0], x: [10, 0, -10] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
  "fade-up": {
    animate: { opacity: [0, 1, 0], y: [8, 0, -8] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
  "fade-down": {
    animate: { opacity: [0, 1, 0], y: [-8, 0, 8] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
  "fade-zoom": {
    animate: { opacity: [0, 1, 0], scale: [0.5, 1, 0.5] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
};

interface MotionPreviewProps {
  selected: boolean;
}

const MotionPreview = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "selected",
})<MotionPreviewProps>(({ theme, selected }) => ({
  width: 28,
  height: 14,
  borderRadius: 3,
  backgroundColor: selected
    ? theme.palette.primary.main
    : alpha(theme.palette.text.disabled, 0.6),
}));

// ----------------------------------------------------------------------

export default function TransitionOptions({ value, onChange }: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mt: 1.5,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1.5,
      }}
    >
      {transitions.map((transition) => {
        const selected = value === transition.value;
        const animation = previewAnimations[transition.value];

        return (
          <Box
            key={transition.value}
            onClick={() => onChange(transition.value)}
            sx={{
              height: 72,
              cursor: "pointer",
              borderRadius: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.75,
              border: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
              transition: theme.transitions.create(["all"], { duration: 200 }),
              "&:hover": {
                borderColor: alpha(theme.palette.grey[500], 0.3),
              },
              ...(selected && {
                borderColor: theme.palette.text.primary,
                bgcolor: alpha(theme.palette.grey[500], 0.08),
              }),
            }}
          >
            {/* Preview Animation Container */}
            <Box
              sx={{
                width: 40,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderRadius: 0.5,
                bgcolor: alpha(theme.palette.grey[500], 0.08),
              }}
            >
              <MotionPreview
                selected={selected}
                animate={animation.animate}
                transition={animation.transition}
              />
            </Box>

            {/* Label */}
            <Typography
              variant="caption"
              sx={{
                fontSize: 10,
                color: selected ? "text.primary" : "text.disabled",
                fontWeight: selected ? 600 : 400,
                textAlign: "center",
                lineHeight: 1.3,
                whiteSpace: "pre-line",
              }}
            >
              {transition.label.split("-").join("-\n")}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
