import { Activity } from "../entities/activity";
import { AssignedMasters } from "../entities/assignedMasters";
import { AssignMastersHistory } from "../entities/assignMastersHistory";
import { Category } from "../entities/category";
import { ChildRoles } from "../entities/childRoles";
import { Departments } from "../entities/department";
import { DprsCommonLand } from "../entities/dprsCommon";
import { DprsPrivateLand } from "../entities/dprsPrivate";
import { MasterData } from "../entities/masterData";
import { MobileLog } from "../entities/mobile_logs";
import { MobileLogs } from "../entities/mobileLogs";
import { OtpLogs } from "../entities/otpLogs";
import { QuestionMapping } from "../entities/QuestionMapping";
import { Questions } from "../entities/questions";
import { QuestionDropdownTypes } from "../entities/questionsDropdownsTypes";
import { RolesAccess } from "../entities/roleAccess";
import { Roles } from "../entities/roles";
import { Schemes } from "../entities/schemes";
import { Sectors } from "../entities/sectors";
import { superAdmin } from "../entities/superAdmin";
import { UploadImgAndVideo } from "../entities/uploadImgAndVideos";
import { UserData } from "../entities/userData";
import { Versions } from "../entities/versions";
import { WaterShedData } from "../entities/watershedData";
import { WaterShedDataHistory } from "../entities/watershedDataHistory";
import { webLogs } from "../entities/webLogs";
import { WatershedImgAndVideo } from "../entities/wsImagesndVideos";

export const allEntities = [
    Versions,
    MasterData,
    webLogs,
    superAdmin,
    OtpLogs,
    MobileLogs,
    UserData,
    RolesAccess,
    Activity,
    Schemes,
    Departments,
    Sectors,
    DprsPrivateLand,
    DprsCommonLand,
    Roles,
    UploadImgAndVideo,
    QuestionDropdownTypes,
    Questions,
    QuestionMapping,
    WaterShedData,
    AssignedMasters,
    WatershedImgAndVideo,
    ChildRoles,
    AssignMastersHistory,
    WaterShedDataHistory,
    Category,
    MobileLog
]