import {
    Activity, Category, MobileLogs, OtpLogs,
    Schemes, Sectors, SubActivity, SubSchemes, Versions,
    WaterShedData, formats, loginData, masterData,
    superAdmin, webLogs
} from "../entities"


export const entities = () => {
    return [
        Schemes,
        Sectors,
        Category,
        Activity,
        SubActivity,
        SubSchemes,
        loginData,
        formats,
        Versions,
        masterData,
        webLogs,
        MobileLogs,
        superAdmin,
        OtpLogs,
        WaterShedData
    ]
}