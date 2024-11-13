import express from 'express';
const router = express.Router()


import { updateRecordFromTalukLevel, addImagesToSubId } from '../controller/mobileController';

router.post('/updateRecordFromTalukLevel', updateRecordFromTalukLevel);
router.post('/addImagesToSubId', addImagesToSubId);

export default router;