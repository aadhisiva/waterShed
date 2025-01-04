import { ACTIVITY, DASHBOARD, DEPARTMENT, DPRS_COMMON, DPRS_PRIVATE, ROLES, SCHEMES, SECTORS, ROLES_ACCESS, QUESTION_MASTER, QUESTION_DROPDOWNS, ACTIVITY_MAPPING, ASSIGN_DISTRICT, ASSIGN_TALUK, ASSIGN_HOBLI, ASSIGN_VILLAGE, CHILD_ROLES, MASTER_UPLOAD, CATEGORY, SCHEME_WITH_COUNT, APPLI_HISTORY } from "./routingPath";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AddTaskIcon from '@mui/icons-material/AddTask';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LandscapeIcon from '@mui/icons-material/Landscape';
import MapIcon from '@mui/icons-material/Map';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportIcon from '@mui/icons-material/Report';

export const RoutingObjects = [
    {
        name: "Dashboard",
        icon: DashboardIcon,
        path: DASHBOARD
    },
    {
        name: "Assign District",
        icon: AssignmentIcon,
        path: ASSIGN_DISTRICT
    },
    {
        name: "Assign Taluk",
        icon: AssignmentIcon,
        path: ASSIGN_TALUK
    },
    {
        name: "Assign Hobli",
        icon: AssignmentIcon,
        path: ASSIGN_HOBLI
    },
    {
        name: "Assign Village",
        icon: AssignmentIcon,
        path: ASSIGN_VILLAGE
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
        name: "Child Roles",
        icon: AddTaskIcon,
        path: CHILD_ROLES
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
    {
        name: "Master Upload",
        icon: LandscapeIcon,
        path: MASTER_UPLOAD
    },
];

export const routesOfSuperAdmin = [
    {
        name: "Dashboard",
        icon: DashboardIcon,
        path: DASHBOARD
    },
    {
        name: "Assign District",
        icon: AssignmentIcon,
        path: ASSIGN_DISTRICT
    },
    {
        name: "Scheme Reports",
        icon: ReportIcon,
        path: SCHEME_WITH_COUNT
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
        name: "Child Roles",
        icon: AddTaskIcon,
        path: CHILD_ROLES
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
        name: "Category",
        icon: LocalActivityIcon,
        path: CATEGORY
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
    {
        name: "Master Upload",
        icon: LandscapeIcon,
        path: MASTER_UPLOAD
    },
];

export const routesOfAdmin = [
    {
        name: "Dashboard",
        icon: DashboardIcon,
        path: DASHBOARD
    },
    {
        name: "Assign District",
        icon: AssignmentIcon,
        path: ASSIGN_DISTRICT
    },
    {
        name: "Survey Reports",
        icon: ReportIcon,
        path: SCHEME_WITH_COUNT
    },
    {
        name: "Application History",
        icon: ReportIcon,
        path: APPLI_HISTORY
    }
];

export const routesDistrict = [
    {
        name: "Dashboard",
        icon: DashboardIcon,
        path: DASHBOARD
    },
    {
        name: "Assign Taluk",
        icon: AssignmentIcon,
        path: ASSIGN_TALUK
    },
    {
        name: "Survey Reports",
        icon: ReportIcon,
        path: SCHEME_WITH_COUNT
    },
    {
        name: "Application History",
        icon: ReportIcon,
        path: APPLI_HISTORY
    }
];

export const routesTaluk = [
    {
        name: "Dashboard",
        icon: DashboardIcon,
        path: DASHBOARD
    },
    {
        name: "Assign Hobli",
        icon: AssignmentIcon,
        path: ASSIGN_HOBLI
    },
    {
        name: "Scheme Reports",
        icon: ReportIcon,
        path: SCHEME_WITH_COUNT
    }
];

export const routesHobli = [
    {
        name: "Dashboard",
        icon: DashboardIcon,
        path: DASHBOARD
    },
    {
        name: "Assign Village",
        icon: AssignmentIcon,
        path: ASSIGN_VILLAGE
    }
];

