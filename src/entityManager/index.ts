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
    Sectors
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
        Roles,
        Activity,
        Schemes,
        Departments,
        Sectors
    ]
}