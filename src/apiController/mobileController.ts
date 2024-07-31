import { Container } from 'typedi';
import express from "express";
import { mobileAppResponse, mobileAppResponseForLarge } from '../utils/errorHandling';
import { authenticateToken, authVersion } from '../utils/middlewares';
import { MOBILE_MESSAGES } from '../utils/constants';
import { getRoleAndUserId } from '../utils/resuableCode';
import { MobileServices } from '../apiServices/mobileServ';
import multer from "multer";
import { SimpleConsoleLogger } from 'typeorm';

const mobileRouter = express.Router()

const mobileServices = Container.get(MobileServices);

// Multer setup
const upload = multer(); // No storage configuration means files are not saved

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

mobileRouter.post('/verifyOtp', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.verifyOtp(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, MOBILE_MESSAGES.VERIFY_OTP));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/locations', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.locations(body);
        return mobileAppResponseForLarge(res, result, body, getRoleAndUserId(req, 'GET Login User Location'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/saveActualData', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        body.UserRole = req.headers["role"]
        let result = await mobileServices.saveActualData(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, 'Saved Survey Data.'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});


mobileRouter.post('/getAllSchemes', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.getAllSchemes(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, 'getAllSchemes'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/getAllRoles', authenticateToken, async (req, res) => {
    try {
        let result = await mobileServices.getAllRoles();
        return mobileAppResponse(res, result, "", getRoleAndUserId(req, 'getAllRoles'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/getSectors', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.getSectors(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, 'getSectors'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/getActivity', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.getActivity(body);
        return mobileAppResponse(res, result, body, getRoleAndUserId(req, 'getActivity'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/uploadImage', upload.single('image') ,authenticateToken, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        };
        const imageName = req.file.originalname;
        const imageData = req.file.buffer;;
        let result = await mobileServices.uploadImages(imageName, imageData);
        return mobileAppResponse(res, result, req.file, getRoleAndUserId(req, 'uploadImage'));
    } catch (error) {
        return mobileAppResponse(res, error);
    };
});

mobileRouter.post('/getImage/:id',authenticateToken, async (req, res) => {
    try {
        const imageId = req.params.id;
        let result:any = await mobileServices.getImage(imageId);
        res.setHeader('Content-Disposition', `inline; filename="${result.ImageName}"`);
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(result.ImageData);
    } catch (error) {
        return mobileAppResponse(res, error);
    };
});

mobileRouter.post('/uploadVideo',  upload.single('video'), authenticateToken, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        const imageName = req.file.originalname;
        const imageData = req.file.buffer;;
        let result = await mobileServices.uploadVideos(imageName, imageData);
        return mobileAppResponse(res, result, req.file, getRoleAndUserId(req, 'uploadVideo'));
    } catch (error) {
        return mobileAppResponse(res, error);
    };
});

mobileRouter.post('/getVideo/:id', authenticateToken, async (req, res) => {
    try {
        const imageId = req.params.id;
        let result:any = await mobileServices.getVideo(imageId);
        res.setHeader('Content-Disposition', `inline; filename="${result.ImageName}"`);
        res.setHeader('Content-Type', 'video/mp4');
        res.send(result.ImageData);
    } catch (error) {
        return mobileAppResponse(res, error);
    };
});

export {
    mobileRouter
};