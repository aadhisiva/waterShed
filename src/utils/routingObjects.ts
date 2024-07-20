import { ACTIVITY, DASHBOARD, DEPARTMENT, ROLES, SCHEMES, SECTORS, SUB_ACTIVITY } from "./routingPath";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AddTaskIcon from '@mui/icons-material/AddTask';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import DashboardIcon from '@mui/icons-material/Dashboard';

export const RoutingObjects = [
    {
        name: "Dashboard",
        icon: DashboardIcon,
        path: DASHBOARD
    },
    {
        name: "Departments",
        icon: CorporateFareIcon,
        path: DEPARTMENT
    },
    {
        name: "Roles",
        icon: AddTaskIcon,
        path: ROLES
    },
    {
        name: "Schemes",
        icon: LocalActivityIcon,
        path: SCHEMES
    },
    {
        name: "Sectors",
        icon: LocalActivityIcon,
        path: SECTORS
    },
    {
        name: "Activity",
        icon: LocalActivityIcon,
        path: ACTIVITY
    },
    {
        name: "SubActiity",
        icon: LocalActivityIcon,
        path: SUB_ACTIVITY
    }
]

