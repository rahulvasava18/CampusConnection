import express from 'express';
import { RegisterUser,LoginUser } from '../controllers/authController.js';
const router = express.Router();

//all done
router.post("/signup",RegisterUser);
router.post("/login",LoginUser);

export default router;