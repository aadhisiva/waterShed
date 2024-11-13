import express from 'express';
const router = express.Router()


import { fetchSearchReports, fetchSearchReportsBySubId, getRoleForReports, getSectorsBySchemeId, 
    getSubWatershed, fetchImagAndVideo, updateStatusFromWeb, getRecordById, fectImagAndVideo, 
    getDepartments} from '../controller/webController';

router.post('/getRoleForReports', getRoleForReports);
router.post('/getSubWatershed', getSubWatershed);
router.post('/getSectorsBySchemeId', getSectorsBySchemeId);
router.post('/fetchSearchReports', fetchSearchReports);
router.post('/fetchSearchReportsBySubId', fetchSearchReportsBySubId);
router.post('/fetchImagAndVideo', fetchImagAndVideo);
router.post('/updateStatusFromWeb', updateStatusFromWeb);
router.post('/getRecordById', getRecordById);
router.post('/fectImagAndVideo', fectImagAndVideo);
router.post('/getDepartments', getDepartments);
// router.post('/getMasterDropdown', getMasterDropdown);

export default router;