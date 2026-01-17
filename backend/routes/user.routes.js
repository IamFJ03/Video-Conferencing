import express from "express";
import multer from "multer";
import { Authenticate } from "../controller/auth.controller.js";
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'profile-picture');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({storage: storage});

const router = express.Router();
import { SaveUser,fetchData, me } from "../controller/User.controller.js";

router.post('/saveUser', upload.single('profilePicture'),Authenticate, SaveUser);
router.post('/fetchData', Authenticate, fetchData);
router.get('/myself', me);

export default router;