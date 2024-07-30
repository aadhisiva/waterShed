import { ACTIVITY, DASHBOARD, DEPARTMENT, DPRS_COMMON, DPRS_PRIVATE, ROLES, SCHEMES, SECTORS, ROLES_ACCESS } from "./routingPath";
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
        name: "Role Access",
        icon: AddTaskIcon,
        path: ROLES_ACCESS
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
        name: "DPR'S Private Land",
        icon: LocalActivityIcon,
        path: DPRS_PRIVATE
    },
    {
        name: "DPR'S Common Land",
        icon: LocalActivityIcon,
        path: DPRS_COMMON
    }
]

