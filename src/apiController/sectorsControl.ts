import { Container, Service } from 'typedi';
import express from "express";
import { SectorServices } from '../apiServices/sectorsServ';
import { mobileAppResponse, mobileAppResponseForLarge } from '../utils/errorHandling';
import { getRoleAndUserId } from '../utils/resuableCode';
import { MOBILE_MESSAGES } from '../utils/constants';
import { authTokenAndVersion } from '../utils/middlewares';

const sectorRouter = express.Router()

const sectorServices = Container.get(SectorServices);

sectorRouter.post('/getSchemes', authTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await sectorServices.getSchemes(body);
        return mobileAppResponseForLarge(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.GET_SCHEMES));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

sectorRouter.post('/codeWiseJsonFormate',authTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await sectorServices.codeWiseJsonFormate(body);
        return mobileAppResponseForLarge(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.GET_ALLDATA));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

sectorRouter.post('/caterGoryOrActivity',authTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await sectorServices.caterGoryOrActivity(body);
        return mobileAppResponseForLarge(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.GET_ALLDATA));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

sectorRouter.post('/subActivityJson',authTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await sectorServices.subActivityJson(body);
        return mobileAppResponseForLarge(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.GET_ALLDATA));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

sectorRouter.post('/schemes', async (req, res) => {
    try {
        let body = req.body;
        let result = await sectorServices.saveShemes(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.SAVE_SCHEME));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

sectorRouter.post('/sectors', async (req, res) => {
    try {
        let body = req.body;
        let result = await sectorServices.saveSectors(body);
        return mobileAppResponseForLarge(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.SAVE_SECTOR));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});
sectorRouter.post('/category', async (req, res) => {
    try {
        let body = req.body;
        let result = await sectorServices.saveCategory(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.SEND_OTP));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});
sectorRouter.post('/activity', async (req, res) => {
    try {
        let body = req.body;
        let result = await sectorServices.saveActivity(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.SAVE_ACTIVITY));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});
sectorRouter.post('/subActivity', async (req, res) => {
    try {
        let body = req.body;
        let result = await sectorServices.saveSubActivity(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.SAVE_SUBACTIVITY));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

sectorRouter.post('/questions', async (req, res) => {
    try {
        let body = req.body;
        let result = await sectorServices.saveQuestions(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.SAVE_QUESTION));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

sectorRouter.post('/getQuestions', authTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await sectorServices.getQuestions(body);
        return mobileAppResponseForLarge(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.GET_QUESTIONS));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

export {
    sectorRouter
};