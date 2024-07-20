import { RESPONSETYPE } from "./constants";
import { saveMobileLogs, saveWebLogs } from "./resuableCode";
import { RESPONSEMSG, RESPONSE_EMPTY_DATA, ResponseCode, ResponseMessages } from "./statusCodes";

export const mobileAppResponse = async (res, result, body = {}, logRes={userId: '', role: '', logMessage: ''}) => {
    const { code=500, message, data } = result;
    const { userId, role, logMessage } = logRes;
    if (result instanceof Error) {
        await saveMobileLogs(logMessage, message, userId, body, result, role, RESPONSETYPE.FAILED)
        return res.status(200).send(ResponseMessages(ResponseCode.EXCEPTION, (message || RESPONSEMSG.EXCEPTION), RESPONSE_EMPTY_DATA));
    } else if (code == 422) {
        await saveMobileLogs(logMessage, message, userId, body, result, role, RESPONSETYPE.FAILED)
        return res.status(200).send(ResponseMessages(ResponseCode.UNPROCESS, (message || RESPONSEMSG.UNPROCESS), RESPONSE_EMPTY_DATA));
    } else if (code == 404) {
        await saveMobileLogs(logMessage, message, userId, body, result, role, RESPONSETYPE.FAILED)
        let response = ResponseMessages(ResponseCode.NOTFOUND, (message || RESPONSEMSG.ACCESS_DENIED), RESPONSE_EMPTY_DATA);
        res.status(200).send(response);
    } else if (code == 400) {
        await saveMobileLogs(logMessage, message, userId, body, result, role, RESPONSETYPE.FAILED)
        return res.status(200).send(ResponseMessages(ResponseCode.VALIDATE, (message || RESPONSEMSG.VALIDATE_FIELDS), RESPONSE_EMPTY_DATA));
    } else {
        await saveMobileLogs(logMessage, message, userId, body, result, role, RESPONSETYPE.SUCCESS)
        if (!data) {
            return res.status(200).send(ResponseMessages(ResponseCode.SUCCESS, (message || RESPONSEMSG.RETRIVE_SUCCESS), result));
        }
        return res.status(200).send(ResponseMessages(ResponseCode.SUCCESS, (message || RESPONSEMSG.RETRIVE_SUCCESS), data));
    }
};

// export const mobileAppResponse = async (res, result, body = {}, logRes={userId: '', role: '', logMessage: ''}) => {
//     const { code, message, data } = result;
//     const { userId, role, logMessage } = logRes;
//     if (result instanceof Error) {
//         await saveMobileLogs(logMessage, message, userId, body, result, role, RESPONSETYPE.FAILED)
//         return res.status(500).send(ResponseMessages(ResponseCode.EXCEPTION, (message || RESPONSEMSG.EXCEPTION), RESPONSE_EMPTY_DATA));
//     } else if (code == 422) {
//         await saveMobileLogs(logMessage, message, userId, body, result, role, RESPONSETYPE.FAILED)
//         return res.status(code).send(ResponseMessages(ResponseCode.UNPROCESS, (message || RESPONSEMSG.UNPROCESS), RESPONSE_EMPTY_DATA));
//     } else if (code == 404) {
//         await saveMobileLogs(logMessage, message, userId, body, result, role, RESPONSETYPE.FAILED)
//         let response = ResponseMessages(ResponseCode.NOTFOUND, (message || RESPONSEMSG.ACCESS_DENIED), RESPONSE_EMPTY_DATA);
//         res.status(code).send(response);
//     } else if (code == 400) {
//         await saveMobileLogs(logMessage, message, userId, body, result, role, RESPONSETYPE.FAILED)
//         return res.status(code).send(ResponseMessages(ResponseCode.VALIDATE, (message || RESPONSEMSG.VALIDATE_FIELDS), RESPONSE_EMPTY_DATA));
//     } else {
//         await saveMobileLogs(logMessage, message, userId, body, result, role, RESPONSETYPE.SUCCESS)
//         if (!data) {
//             return res.status(200).send(ResponseMessages(ResponseCode.SUCCESS, (message || RESPONSEMSG.RETRIVE_SUCCESS), result));
//         }
//         return res.status(200).send(ResponseMessages(ResponseCode.SUCCESS, (message || RESPONSEMSG.RETRIVE_SUCCESS), data));
//     }
// };

export const mobileAppResponseForLarge = async (res, result, body = {}, logRes={userId: '', role: '', logMessage: ''}) => {
    const { code, message, data } = result;
    const { userId, role, logMessage } = logRes;
    if (result instanceof Error) {
        await saveMobileLogs(logMessage, message, userId, body, result, role, RESPONSETYPE.FAILED)
        return res.status(200).send(ResponseMessages(ResponseCode.EXCEPTION, (message || RESPONSEMSG.EXCEPTION), RESPONSE_EMPTY_DATA));
    } else if (code == 422) {
        await saveMobileLogs(logMessage, message, userId, body, result, role, RESPONSETYPE.FAILED)
        return res.status(200).send(ResponseMessages(ResponseCode.UNPROCESS, (message || RESPONSEMSG.UNPROCESS), RESPONSE_EMPTY_DATA));
    } else if (code == 404) {
        await saveMobileLogs(logMessage, message, userId, body, result, role, RESPONSETYPE.FAILED)
        let response = ResponseMessages(ResponseCode.NOTFOUND, (message || RESPONSEMSG.ACCESS_DENIED), RESPONSE_EMPTY_DATA);
        res.status(200).send(response);
    } else if (code == 400) {
        await saveMobileLogs(logMessage, message, userId, body, result, role, RESPONSETYPE.FAILED)
        return res.status(200).send(ResponseMessages(ResponseCode.VALIDATE, (message || RESPONSEMSG.VALIDATE_FIELDS), RESPONSE_EMPTY_DATA));
    } else {
        await saveMobileLogs(logMessage, message, userId, body, logMessage, role, RESPONSETYPE.SUCCESS)
        if (!data) {
            return res.status(200).send(ResponseMessages(ResponseCode.SUCCESS, (message || RESPONSEMSG.RETRIVE_SUCCESS), result));
        }
        return res.status(200).send(ResponseMessages(ResponseCode.SUCCESS, (message || RESPONSEMSG.RETRIVE_SUCCESS), data));
    }
};

export const webAppResponseForLarge = async (res, result, body = {}, page = '', msg = '', userid = '', role = '') => {
    const { code, message, data } = result;
    if (result instanceof Error) {
        await saveWebLogs(page, msg, userid, body, result, role, RESPONSETYPE.FAILED)
        return res.status(500).send(ResponseMessages(ResponseCode.EXCEPTION, (message || RESPONSEMSG.EXCEPTION), RESPONSE_EMPTY_DATA));
    } else if (code == 422) {
        await saveWebLogs(page, msg, userid, body, result, role, RESPONSETYPE.FAILED)
        return res.status(code).send(ResponseMessages(ResponseCode.UNPROCESS, (message || RESPONSEMSG.UNPROCESS), RESPONSE_EMPTY_DATA));
    } else if (code == 404) {
        await saveWebLogs(page, msg, userid, body, result, role, RESPONSETYPE.FAILED)
        let response = ResponseMessages(ResponseCode.NOTFOUND, (message || RESPONSEMSG.ACCESS_DENIED), RESPONSE_EMPTY_DATA);
        res.status(code).send(response);
    } else if (code == 400) {
        await saveWebLogs(page, msg, userid, body, result, role, RESPONSETYPE.FAILED)
        return res.status(code).send(ResponseMessages(ResponseCode.VALIDATE, (message || RESPONSEMSG.VALIDATE_FIELDS), RESPONSE_EMPTY_DATA));
    } else {
        await saveWebLogs(page, msg, userid, body, msg, role, RESPONSETYPE.SUCCESS)
        if (!data) {
            return res.status(200).send(ResponseMessages(ResponseCode.SUCCESS, (message || RESPONSEMSG.RETRIVE_SUCCESS), result));
        }
        return res.status(200).send(ResponseMessages(ResponseCode.SUCCESS, (message || RESPONSEMSG.RETRIVE_SUCCESS), data));
    }
};

export const webAppResponse = async (res, result, body = {}, page = '', msg = '', userid = '', role = '') => {
    const { code, message, data } = result;
    if (result instanceof Error) {
        await saveWebLogs(page, msg, userid, body, result, role, RESPONSETYPE.FAILED)
        return res.status(500).send(ResponseMessages(ResponseCode.EXCEPTION, (message || RESPONSEMSG.EXCEPTION), RESPONSE_EMPTY_DATA));
    } else if (code == 422) {
        await saveWebLogs(page, msg, userid, body, result, role, RESPONSETYPE.FAILED)
        return res.status(code).send(ResponseMessages(ResponseCode.UNPROCESS, (message || RESPONSEMSG.UNPROCESS), RESPONSE_EMPTY_DATA));
    } else if (code == 404) {
        await saveWebLogs(page, msg, userid, body, result, role, RESPONSETYPE.FAILED)
        let response = ResponseMessages(ResponseCode.NOTFOUND, (message || RESPONSEMSG.ACCESS_DENIED), RESPONSE_EMPTY_DATA);
        res.status(code).send(response);
    } else if (code == 400) {
        await saveWebLogs(page, msg, userid, body, result, role, RESPONSETYPE.FAILED)
        return res.status(code).send(ResponseMessages(ResponseCode.VALIDATE, (message || RESPONSEMSG.VALIDATE_FIELDS), RESPONSE_EMPTY_DATA));
    } else {
        await saveWebLogs(page, msg, userid, body, result, role, RESPONSETYPE.SUCCESS)
        if (!data) {
            return res.status(200).send(ResponseMessages(ResponseCode.SUCCESS, (message || RESPONSEMSG.RETRIVE_SUCCESS), result));
        }
        return res.status(200).send(ResponseMessages(ResponseCode.SUCCESS, (message || RESPONSEMSG.RETRIVE_SUCCESS), data));
    }
};