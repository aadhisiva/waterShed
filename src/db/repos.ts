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
import { OtpLogs } from "../entities/otpLogs";
import { QuestionMapping } from "../entities/QuestionMapping";
import { Questions } from "../entities/questions";
import { QuestionDropdownTypes } from "../entities/questionsDropdownsTypes";
import { RolesAccess } from "../entities/roleAccess";
import { Roles } from "../entities/roles";
import { Schemes } from "../entities/schemes";
import { Sectors } from "../entities/sectors";
import { UploadImgAndVideo } from "../entities/uploadImgAndVideos";
import { UserData } from "../entities/userData";
import { Versions } from "../entities/versions";
import { WaterShedData } from "../entities/watershedData";
import { WaterShedDataHistory } from "../entities/watershedDataHistory";
import { webLogs } from "../entities/webLogs";
import { WatershedImgAndVideo } from "../entities/wsImagesndVideos";
import { AppDataSource } from "./config";


export const repository = {
    schemesRepo: AppDataSource.getRepository(Schemes),
    sectorsRepo: AppDataSource.getRepository(Sectors),
    activityRepo: AppDataSource.getRepository(Activity),
    rolesRepo: AppDataSource.getRepository(Roles),
    uploadImgAndVideoRepo: AppDataSource.getRepository(UploadImgAndVideo),
    dprsPrivateLandRepo: AppDataSource.getRepository(DprsPrivateLand),
    dprsCommonLandRepo: AppDataSource.getRepository(DprsCommonLand),
    questionMappingRepo: AppDataSource.getRepository(QuestionMapping),
    questionDropdownTypesRepo: AppDataSource.getRepository(QuestionDropdownTypes),
    waterShedDataRepo: AppDataSource.getRepository(WaterShedData),
    waterShedDataHistoryRepo: AppDataSource.getRepository(WaterShedDataHistory),
    masterDataRepo: AppDataSource.getRepository(MasterData),
    watershedImgAndVideoRepo: AppDataSource.getRepository(WatershedImgAndVideo),
    userDataRepo: AppDataSource.getRepository(UserData),
    categoryRepo: AppDataSource.getRepository(Category),
    assignedMastersRepo: AppDataSource.getRepository(AssignedMasters),
    webLogsRepo: AppDataSource.getRepository(webLogs),
    otpLogsRepo: AppDataSource.getRepository(OtpLogs),
    roleAccessRepo: AppDataSource.getRepository(RolesAccess),
    departmentsRepo: AppDataSource.getRepository(Departments),
    questionsRepo: AppDataSource.getRepository(Questions),
    childRoleRepo: AppDataSource.getRepository(ChildRoles),
    assignMastersHistoryRepo: AppDataSource.getRepository(AssignMastersHistory),
    versionRepo: AppDataSource.getRepository(Versions)
};

export const repoNames = {
    SchemesTable: Schemes,
    SectorsTable: Sectors,
    ActivityTable: Activity,
    RolesTable: Roles,
    UploadImgAndVideoTable: UploadImgAndVideo,
    DprsPrivateLandTable: DprsPrivateLand,
    DprsCommonLandTable: DprsCommonLand,
    QuestionMappingTable: QuestionMapping,
    QuestionDropdownTypesTable: QuestionDropdownTypes,
    WaterShedDataTable: WaterShedData,
    WaterShedDataHistoryTable: WaterShedDataHistory,
    MasterDataTable: MasterData,
    WatershedImgAndVideoTable: WatershedImgAndVideo,
    UserDataTable: UserData,
    CategoryTable: Category,
    AssignedMastersTable: AssignedMasters,
    webLogsTable: webLogs,
    OtpLogsTable: OtpLogs,
    RolesAccessTable: RolesAccess,
    DepartmentsTable: Departments,
    QuestionsTable: Questions,
    ChildRolesTable: ChildRoles,
    AssignMastersHistoryTable: AssignMastersHistory,
    VersionsTable: Versions,
    MobileLogTable: MobileLog
}