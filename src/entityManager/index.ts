import {
    Activity,
    Departments,
    MobileLogs,
    OtpLogs,
    Roles,
    Schemes,
    UserData,
    Versions,
    loginData, 
    MasterData,
    superAdmin, 
    webLogs,
    Sectors,
    DprsPrivateLand,
    DprsCommonLand,
    RolesAccess,
    UploadImgAndVideo,
    QuestionDropdownTypes,
    Questions,
    QuestionMapping,
    WaterShedData,
    AssignedMasters,
    WatershedImgAndVideo
} from "../entities"


export const entities = () => {
    return [
        loginData,
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
        WatershedImgAndVideo
    ]
}