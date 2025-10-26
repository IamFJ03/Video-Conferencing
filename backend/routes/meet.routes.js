import express from 'express';
import { meetInfoSave, fetchMeetInfo } from '../controller/meet.controller.js';
import multer from 'multer';
const router = express.Router();
const upload = multer();

router.post('/info',upload.none(), meetInfoSave);
router.get('/fetchinfo', fetchMeetInfo);

export default router;