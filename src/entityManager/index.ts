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
    RolesAccess
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
        Roles
    ]
}