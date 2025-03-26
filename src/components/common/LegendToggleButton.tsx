import React from "react";
import { Button, Stack, SvgIconProps, Typography } from '@mui/material';
import IconifyIcon from '../dashboardCom/Icons/iconifyIcon';

interface Legend {
  [key: string]: boolean;
}

interface LegendToggleButtonProps {
  name: keyof Legend;
  icon?: string;
  svgIcon?: (props: SvgIconProps) => JSX.Element;
  color: string;
  value?: string;
  legend: Legend;
  onHandleLegendToggle: any;
}

const LegendToggleButton = ({
  name,
  icon,
  svgIcon: SvgIcon,
  color,
  value,
  legend,
  onHandleLegendToggle,
}: LegendToggleButtonProps) => {
  const Icon = icon ? (
    <IconifyIcon icon={icon} sx={{ color }} />
  ) : SvgIcon ? (
    <SvgIcon sx={{ color }} />
  ) : null;

  return (
    <Stack>
      <Button
        size="small"
        startIcon={Icon}
        onClick={() => onHandleLegendToggle(name)}
        sx={{ opacity: legend[name] ? 0.5 : 1, '&:hover': { bgcolor: 'transparent' } }}
        disableRipple
      >
        <Typography variant="button" whiteSpace="nowrap" alignSelf="end" sx={{ color: '#464E5F' }}>
          {name}
        </Typography>
      </Button>
      {value && (
        <Typography variant="subtitle2" sx={{ height: 20, ml: 4, fontWeight: 'fontWeightMedium' }}>
          {value}
        </Typography>
      )}
    </Stack>
  );
};

export default LegendToggleButton;
