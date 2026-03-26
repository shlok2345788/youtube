import express from "express";
import { login } from "../controller/auth";
const routes = express.Router();

routes.post("/login", login);

export default orut