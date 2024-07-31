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
    masterData,
    superAdmin, 
    webLogs,
    Sectors,
    DprsPrivateLand,
    DprsCommonLand,
    RolesAccess,
    UploadImgAndVideo
} from "../entities"


export const entities = () => {
    return [
        loginData,
        Versions,
        masterData,
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
        UploadImgAndVideo
    ]
}