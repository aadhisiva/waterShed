import { Container } from 'typedi';
import express from "express";
import { mobileAppResponse, mobileAppResponseForLarge } from '../utils/errorHandling';
import { authTokenAndVersion, authVersion } from '../utils/middlewares';
import { MOBILE_MESSAGES } from '../utils/constants';
import { getRoleAndUserId } from '../utils/resuableCode';
import { MobileServices } from '../apiServices/mobileServ';

const mobileRouter = express.Router()

const mobileServices = Container.get(MobileServices);

mobileRouter.post('/saveLogin', async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.saveLogin(body);
        return mobileAppResponse(res, result);
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/sendOtp', authVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.sendOtp(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.SEND_OTP));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/verifyOtp', authTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.verifyOtp(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.VERIFY_OTP));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/locations', authTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.locations(body);
        return mobileAppResponseForLarge(res, result, body, getRoleAndUserId(req, 'GET Login User Location'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/saveActualData', authTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        body.UserRole = req.headers["role"]
        let result = await mobileServices.saveActualData(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, 'Saved Survey Data.'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

export {
    mobileRouter
};