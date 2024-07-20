import { Container, Service } from 'typedi';
import express from "express";
import { mobileAppResponse, mobileAppResponseForLarge } from '../utils/errorHandling';
import { UserServices } from '../apiServices/userServ';
import { authTokenAndVersion, authVersion } from '../utils/middlewares';
import { MOBILE_MESSAGES } from '../utils/constants';
import { getRoleAndUserId } from '../utils/resuableCode';

const userRouter = express.Router()

const userServices = Container.get(UserServices);

userRouter.post('/saveLogin', async (req, res) => {
    try {
        let body = req.body;
        let result = await userServices.saveLogin(body);
        return mobileAppResponse(res, result);
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

userRouter.post('/sendOtp', authVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await userServices.sendOtp(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.SEND_OTP));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

userRouter.post('/verifyOtp', authTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await userServices.verifyOtp(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.VERIFY_OTP));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

userRouter.post('/locations', authTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await userServices.locations(body);
        return mobileAppResponseForLarge(res, result, body, getRoleAndUserId(req, 'GET Login User Location'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

userRouter.post('/saveActualData', authTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        body.UserRole = req.headers["role"]
        let result = await userServices.saveActualData(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, 'Saved Survey Data.'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

export {
    userRouter
};