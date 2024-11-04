import { Container } from 'typedi';
import express from "express";
import { mobileAppResponse, mobileAppResponseForLarge } from '../utils/errorHandling';
import { authenticateToken, authVersion } from '../utils/middlewares';
import { MOBILE_MESSAGES } from '../utils/constants';
import { checkXlsxKeysExistOrNot, getRoleAndUserId } from '../utils/resuableCode';
import { MobileServices } from '../apiServices/mobileServ';
import multer from "multer";
import { saveSurveyValuesSanitize } from '../utils/validations';

const mobileRouter = express.Router()

const mobileServices = Container.get(MobileServices);


const memoryStorage = multer.memoryStorage();
const uploadImage = multer({ storage: memoryStorage });

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
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, MOBILE_MESSAGES.SEND_OTP));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/assignedHobliDetails', async (req, res) => {
    try {
        let body = {...req.body, ...{UserId: req.headers.UserId}};
        let result = await mobileServices.assignedHobliDetails(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, MOBILE_MESSAGES.ADDED));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/getWatershedOrSub', async (req, res) => {
    try {
        let body = {...req.body, ...{UserId: req.headers.UserId}};
        let result = await mobileServices.getWatershedOrSub(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, "getWatershedOrSub-Fetcheing Data With Vilages"));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/verifyOtp', async (req, res) => {
    try {
        let body = {...req.body, ...{UserId: req?.user?.UserId}};
        let result = await mobileServices.verifyOtp(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, MOBILE_MESSAGES.VERIFY_OTP));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/locations', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.locations(body);
        return mobileAppResponseForLarge(res, result, req.body, getRoleAndUserId(req, 'GET Login User Location'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/getAllSchemes', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.getAllSchemes(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, 'getAllSchemes'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/getAllRoles', async (req, res) => {
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
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, 'getSectors'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/getActivity', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.getActivity(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, 'getActivity'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/getCategory', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.getCategory(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, 'getCategory'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/getQuestionsBasedOnActivity', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.getQuestionsBasedOnActivity(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, 'getQuestionsBasedOnActivity'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/getEntityData', async (req, res) => {
    try {
        res.send(checkXlsxKeysExistOrNot({}))
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/getPrivateLand', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.getPrivateLand(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, 'getPrivateLand'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/getCommonLand', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.getCommonLand(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, 'getCommonLand'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/getKutubaData', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await mobileServices.getCommonLand(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, 'getCommonLand'));
    } catch (error) {
        return mobileAppResponse(res, error);
    }
});

mobileRouter.post('/saveSurveyData', saveSurveyValuesSanitize, authenticateToken, async (req, res) => {
    try {
        let body = {...req.body, ...{UserId: req.user?.UserId}};
        let result = await mobileServices.saveSurveyData(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, 'saveSurveyData - saved with submissin id.'));
    } catch (error) {
        console.log("Err",error)
        return mobileAppResponse(res, error);
    };
});

mobileRouter.post('/getSubmissionList', authenticateToken, async (req, res) => {
    try {
        let body = {...req.body, ...{UserId: req.user.UserId}};
        let result = await mobileServices.getSubmissionList(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, 'getSubmissionList - get data with submissin id.'));
    } catch (error) {
        return mobileAppResponse(res, error);
    };
});

mobileRouter.post('/getAllSubmissionList', authenticateToken, async (req, res) => {
    try {
        let body = {...req.body, ...{UserId: req.user.UserId}};
        let result = await mobileServices.getAllSubmissionList(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, 'getAllSubmissionList - get all data with submissin id.'));
    } catch (error) {
        return mobileAppResponse(res, error);
    };
});

mobileRouter.post('/getRecord', authenticateToken, async (req, res) => {
    try {
        let body = {...req.body, ...{UserId: req.user.UserId}};
        let result = await mobileServices.getRecord(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, 'getEachRecord - get data of particular record.'));
    } catch (error) {
        return mobileAppResponse(res, error);
    };
});

mobileRouter.post('/updateSurveyData', authenticateToken, async (req, res) => {
    try {
        let body = {...req.body, ...{UserId: req.user.UserId}};
        let result = await mobileServices.updateSurveyData(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, 'updateSurveyData - updated with submissin id.'));
    } catch (error) {
        return mobileAppResponse(res, error);
    };
});

mobileRouter.post('/retriveMasters', authenticateToken, async (req, res) => {
    try {
        let body = {...req.body, ...{UserId: req.user.UserId}};
        let result = await mobileServices.retriveMasters(body);
        return mobileAppResponse(res, result, req.body, getRoleAndUserId(req, 'retriveMasters'));
    } catch (error) {
        return mobileAppResponse(res, error);
    };
});

mobileRouter.post('/uploadImage', uploadImage.single('image') ,authenticateToken, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        };
        let body = {
            ImageName: req.file.originalname,
            ImageData: req.file.buffer,
            UserId: req.user.userid
       }; 
        let result = await mobileServices.uploadImages(body);
        return mobileAppResponse(res, result, req.file, getRoleAndUserId(req, 'uploadImage'));
    } catch (error) {
        return mobileAppResponse(res, error);
    };
});

mobileRouter.post('/getImage/:id', async (req, res) => {
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

mobileRouter.post('/uploadVideo',  uploadImage.single('video'), authenticateToken, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        let body = {
             ImageName: req.file.originalname,
             ImageData: req.file.buffer,
             UserId: req.user.userid
        }; 
        let result = await mobileServices.uploadVideos(body);
        return mobileAppResponse(res, result, req.file, getRoleAndUserId(req, 'uploadVideo'));
    } catch (error) {
        return mobileAppResponse(res, error);
    };
});

mobileRouter.post('/getVideo/:id', async (req, res) => {
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