import { SignUp, login, verify, logout } from "../controller/auth.controller.js";
import express from "express";

const authRoute = express.Router();

authRoute.post("/Signup", SignUp)
authRoute.post("/login", login)
authRoute.post("/verify-otp", verify)
authRoute.get("/logout", logout)

export default authRoute;