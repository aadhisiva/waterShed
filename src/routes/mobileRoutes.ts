import express from 'express';
import Container from 'typedi';
import multer from "multer";
const router = express.Router()

import { MobileController } from '../controller/mobileController';
import { authenticateToken, authVersion } from '../utils/middlewares';

const webController = Container.get(MobileController);

const memoryStorage = multer.memoryStorage();
const uploadImage = multer({ storage: memoryStorage });

router.post('/updateRecordFromTalukLevel', authenticateToken, webController.updateRecordFromTalukLevel);
router.post('/addImagesToSubId', authenticateToken, webController.addImagesToSubId);
router.post('/loginToTaluk', webController.loginToTaluk);
router.post('/verfiyTalukOtp', webController.verfiyTalukOtp);
router.post('/getTalukLevelSurvey', webController.getTalukLevelSurvey);

router.post('/sendOtp', authVersion, webController.sendOtp);
router.post('/assignedHobliDetails', authenticateToken, webController.assignedHobliDetails);
router.post('/verifyOtp', authenticateToken, webController.verifyOtp);

router.post('/updateRecordFromTalukLevel', authenticateToken, webController.updateRecordFromTalukLevel);
router.post('/addImagesToSubId', authenticateToken, webController.addImagesToSubId);
router.post('/loginToTaluk', authenticateToken, webController.loginToTaluk);
router.post('/verfiyTalukOtp', authenticateToken, webController.verfiyTalukOtp);
router.post('/getTalukLevelSurvey', authenticateToken, webController.getTalukLevelSurvey);
router.post('/getWatershedOrSub', authenticateToken, webController.getWatershedOrSub);
router.post('/getAllSchemes', authenticateToken, webController.getAllSchemes);
router.post('/getAllRoles', webController.getAllRoles);
router.post('/getSectors', authenticateToken, webController.getSectors);
router.post('/getActivity', authenticateToken, webController.getActivity);
router.post('/getCategory', authenticateToken, webController.getCategory);
router.post('/getQuestionsBasedOnActivity', authenticateToken, webController.getQuestionsBasedOnActivity);
router.post('/getPrivateLand', authenticateToken, webController.getPrivateLand);
router.post('/getCommonLand', authenticateToken, webController.getCommonLand);
router.post('/saveSurveyData', authenticateToken, webController.saveSurveyData);
router.post('/getSubmissionList', authenticateToken, webController.getSubmissionList);
router.post('/getAllSubmissionList', authenticateToken, webController.getAllSubmissionList);
router.post('/getRecord', authenticateToken, webController.getRecord);
router.post('/updateSurveyData', authenticateToken, webController.updateSurveyData);
router.post('/retriveMasters', authenticateToken, webController.retriveMasters);
router.post('/uploadImages', uploadImage.single('image'), webController.uploadImages);
router.post('/getImage/:id', authenticateToken, webController.getImage);

export default router;