import { SvgIconProps } from '@mui/material';
import OrderIcon from '../dashboardCom/Icons/OrderIcon';
import SalesIcon from '../dashboardCom/Icons/SalesIcon';
import { AGRICULTURE, FORESTERY, HORTICULTURE } from '../utils/constants';

export interface SaleItem {
  label: string;
  value: string;
  growth: string;
  bgColor: string;
  iconBackgroundColor: string;
  icon?: string;
  svgIcon?: (props: SvgIconProps) => JSX.Element;
}

export const sales: SaleItem[] = [
  {
    label: "Total Survey",
    value: '$1k',
    growth: '+8%',
    bgColor: '#FFE2E5',
    iconBackgroundColor: '#FA5A7D',
    svgIcon: SalesIcon,
  },
  {
    label: AGRICULTURE,
    value: '300',
    growth: '+5%',
    bgColor: '#FFF4DE',
    iconBackgroundColor: '#FF947A',
    svgIcon: OrderIcon,
  },
  {
    label: FORESTERY,
    value: '5',
    growth: '+1.2%',
    bgColor: '#DCFCE7',
    iconBackgroundColor: '#3CD856',
    icon: 'ion:pricetag',
  },
  {
    label: HORTICULTURE,
    value: '8',
    growth: '+0.5%',
    bgColor: '#F3E8FF',
    iconBackgroundColor: '#BF83FF',
    icon: 'material-symbols:person-add',
  },
];
