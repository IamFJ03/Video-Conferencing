import { SignUp, login, verify } from "../controller/User.controller.js";
import express from "express";

const authRoute = express.Router();

authRoute.post("/Signup", SignUp)
authRoute.post("/login", login)
authRoute.post("/verify-otp", verify)

export default authRoute;