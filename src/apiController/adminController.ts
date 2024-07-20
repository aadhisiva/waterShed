import { Container, Service } from 'typedi';
import express from "express";
import { webAppResponse, webAppResponseForLarge } from '../utils/errorHandling';
import { AdminServices } from '../apiServices/adminServ';
import { webAuthTokenAndVersion } from '../utils/middlewares';
import { WEBMESSAGES, WEBPAGES } from '../utils/constants';

const adminRouter = express.Router()

const adminServices = Container.get(AdminServices);

adminRouter.post('/sendOtp', async (req, res) => {
    try {
        let body = req.body;
        body.userUniqueId = req.headers["userid"]
        let result = await adminServices.sendOtp(body);
        return webAppResponse(res, result, body, WEBPAGES.LOGIN_PAGE, WEBMESSAGES.SEND_OTP, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/addUser', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.addUser(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.ADDED, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/addSuperAdmin', async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.addSuperAdmin(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.ADDED, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/allUsersData', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.allUsersData(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/assigningData', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.assigningData(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.UPDATE, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/verifyOtp', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.verifyOtp(body);
        return webAppResponse(res, result, body, WEBPAGES.LOGIN_PAGE, WEBMESSAGES.VERIFY_OTP, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/getSchemes', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.getSchemes(body);
        return webAppResponse(res, result, body, WEBPAGES.SCEHEMS, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/allDistricts', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.allDistricts(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/districtWiseTaluk', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.districtWiseTaluk(body);
        return webAppResponse(res, result, body,  WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/talukWiseHobli', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.talukWiseHobli(body);
        return webAppResponse(res, result, body,  WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/subWaterSheadInHobli', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.subWaterSheadInHobli(body);
        return webAppResponse(res, result, body,  WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});
adminRouter.post('/microWaterShedInSubWaterShed', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.microWaterShedInSubWaterShed(body);
        return webAppResponse(res, result, body,  WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});
adminRouter.post('/schemeSelect', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.schemeSelect(body);
        return webAppResponse(res, result, body,  WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});
adminRouter.post('/sectorInSchemes', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        body.UserRole = req.headers["role"]
        let result = await adminServices.sectorInSchemes(body);
        return webAppResponse(res, result, body,  WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});
adminRouter.post('/activityInSector', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.activityInSector(body);
        return webAppResponse(res, result, body,  WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/locations', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.locations(body);
        return webAppResponseForLarge(res, result, body,  WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

export {
    adminRouter
};