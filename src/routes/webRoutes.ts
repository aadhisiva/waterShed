import express from 'express';
import multer from "multer";

const router = express.Router()

import { authenticateToken, authVersion } from '../utils/middlewares';
import Container from 'typedi';
import { WebController } from '../controller/webController';

const webController = Container.get(WebController);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({storage});

const memoryStorage = multer.memoryStorage();
const uploadImage = multer({ storage: memoryStorage });

router.post('/checkMobileLogin', webController.checkMobileLogin);
router.post('/getDataAccess', webController.getDataAccess);
router.post('/verifyOtp', webController.verifyOtp);

router.post('/departments', authenticateToken, webController.departments);
router.post('/addOrGetschemes', authenticateToken, webController.addOrGetschemes);
router.post('/addOrGetSectors', authenticateToken, webController.addOrGetSectors);
router.post('/addOrGetsActivity', authenticateToken, webController.addOrGetsActivity);
router.post('/addOrGetsCategory', authenticateToken, webController.addOrGetsCategory);
router.post('/addOrGetRoles', authenticateToken, webController.addOrGetRoles);
router.post('/addOrGetQuestions', authenticateToken, webController.addOrGetQuestions);
router.post('/mapQuestionOrUpdate', authenticateToken, webController.mapQuestionOrUpdate);
router.post('/addOrGetQuestionDropDownTypes', authenticateToken, webController.addOrGetQuestionDropDownTypes);
router.post('/assignChildAndGet', authenticateToken, webController.assignChildAndGet);
router.post('/getActivityDetails', authenticateToken, webController.getActivityDetails);
router.post('/getChildBasedOnParent', authenticateToken, webController.getChildBasedOnParent);
router.post('/assignmentProcess', authenticateToken, webController.assignmentProcess);
router.post('/getMasterDropDown', authenticateToken, webController.getMasterDropDown);
router.post('/getAssignedMasters', authenticateToken, webController.getAssignedMasters);
router.post('/getDprsLand', authenticateToken, webController.getDprsLand);
router.post('/uploadPrivateLand', authenticateToken, upload.single('file'), webController.uploadPrivateLand);
router.post('/uploadCommonLand', authenticateToken, upload.single('file'), webController.uploadCommonLand);
router.post('/uploadImage', authenticateToken, uploadImage.single('image'), webController.uploadImages);
router.post('/getImage/:id', authenticateToken, webController.getImage);
router.post('/uplodMasters', authenticateToken, upload.single('file'), webController.uploadDistrictMasters);

router.post('/getRoleForReports', authenticateToken, webController.getRoleForReports);
router.post('/getSubWatershed', authenticateToken, webController.getSubWatershed);
router.post('/getSectorsBySchemeId', authenticateToken, webController.getSectorsBySchemeId);
router.post('/fetchSearchReports', authenticateToken, webController.fetchSearchReports);
router.post('/fetchSearchReportsBySubId', authenticateToken, webController.fetchSearchReportsBySubId);
router.post('/fetchImagAndVideo', authenticateToken, webController.fetchImagAndVideo);
router.post('/updateStatusFromWeb', authenticateToken, webController.updateStatusFromWeb);
router.post('/getRecordById', authenticateToken, webController.getRecordById);
router.post('/fectImagAndVideo', authenticateToken, webController.fectImagAndVideo);
router.post('/getDepartments', authenticateToken, webController.getDepartments);

export default router;