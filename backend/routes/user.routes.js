import express from "express";
import multer from "multer";
import { Authenticate } from "../controller/auth.controller.js";
const upload = multer();
const router = express.Router();
import { SaveUser,fetchData } from "../controller/User.controller.js";

router.post('/saveUser', upload.none(),Authenticate, SaveUser);
router.post('/fetchData', Authenticate, fetchData);

export default router;