import { ACTIVITY, DASHBOARD, DEPARTMENT, DPRS_COMMON, DPRS_PRIVATE, ROLES, SCHEMES, SECTORS, ROLES_ACCESS, QUESTION_MASTER, QUESTION_DROPDOWNS, ACTIVITY_MAPPING } from "./routingPath";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AddTaskIcon from '@mui/icons-material/AddTask';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LandscapeIcon from '@mui/icons-material/Landscape';
import MapIcon from '@mui/icons-material/Map';

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
        icon: LandscapeIcon,
        path: DPRS_PRIVATE
    },
    {
        name: "DPR'S Common Land",
        icon: LandscapeIcon,
        path: DPRS_COMMON
    },
    {
        name: "Question Master",
        icon: QuestionMarkIcon,
        path: QUESTION_MASTER
    },
    {
        name: "Question DropDown Items",
        icon: QuestionAnswerIcon,
        path: QUESTION_DROPDOWNS
    },
    {
        name: "Activity/Sub Mapping",
        icon: MapIcon,
        path: ACTIVITY_MAPPING
    },
]

