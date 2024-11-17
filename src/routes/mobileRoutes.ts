import express from 'express';
const router = express.Router()


import { updateRecordFromTalukLevel, addImagesToSubId, loginToTaluk, verfiyTalukOtp,
    getTalukLevelSurvey
 } from '../controller/mobileController';
import { authenticateToken } from '../utils/middlewares';

router.post('/updateRecordFromTalukLevel', authenticateToken, updateRecordFromTalukLevel);
router.post('/addImagesToSubId', authenticateToken, addImagesToSubId);
router.post('/loginToTaluk', loginToTaluk);
router.post('/verfiyTalukOtp', verfiyTalukOtp);
router.post('/getTalukLevelSurvey', getTalukLevelSurvey);

export default router;