import { SignUp, login } from "../controller/User.controller.js";
import express from "express";

const authRoute = express.Router();

authRoute.post("/Signup", SignUp)
authRoute.post("/login", login)

export default authRoute;