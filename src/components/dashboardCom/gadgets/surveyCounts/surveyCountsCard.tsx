import React  from 'react';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import IconifyIcon from '../../Icons/iconifyIcon';
import { SaleItem } from '../../../dummyData/surveyCounts';
import './index.css';

const SurveyCardDetails = ({ item, className }: { item: SaleItem, className: any }) => {
  const { value, label, growth, bgColor, iconBackgroundColor, icon, svgIcon: SvgIcon } = item;

  const Icon = icon ? (
    <IconifyIcon icon={icon} sx={{ fontSize: 20, color: 'common.white' }} />
  ) : SvgIcon ? (
    <SvgIcon sx={{ fontSize: 24 }} />
  ) : null;

  return (
    <Card
    id={className}
      sx={{
        borderRadius: 4,
        bgcolor: bgColor,
      }}
    >
      <CardContent sx={(theme) => ({ p: { xs: `${theme.spacing(1.0)} !important` } })}>
        <Stack
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: iconBackgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2,
          }}
        >
          {Icon}
        </Stack>

        <Typography id='SCCardTitle' color="primary.darker" mb={1}>
          {value}
        </Typography>
        <Typography color="grey.800" component="p" mb={1}>
          {label}
        </Typography>
        <Typography variant="caption" id="SCCardPercent" component="p">
          Last day {growth}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SurveyCardDetails;
