import express from "express";
import multer from "multer";
import { Authenticate } from "../controller/auth.controller.js";
const upload = multer();
const router = express.Router();
import { SaveUser } from "../controller/user.controller.js";

router.post('/saveUser', upload.none(),Authenticate, SaveUser);

export default router;