import { forwardRef } from 'react';
import { Icon } from '@iconify/react';
import type { IconifyIcon } from '@iconify/react';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  icon: IconifyIcon | string;
}

const Iconify = forwardRef<SVGSVGElement, Props>(({ icon, width = 20, sx, ...other }, ref) => (
  <Box
    ref={ref}
    component={Icon}
    className="component-iconify"
    icon={icon}
    sx={{ width, height: width, ...sx }}
    {...other}
  />
));

export default Iconify;
