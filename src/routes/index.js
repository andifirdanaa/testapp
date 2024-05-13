import express from "express";
import { changePassword, getUsers, login, register } from "../controllers/UserController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get('/getUsers',verifyToken,getUsers);
router.post('/login',login);
router.post('/register',register);
router.post('/change',verifyToken,changePassword);

export default router;
