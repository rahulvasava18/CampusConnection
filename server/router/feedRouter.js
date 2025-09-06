import express from 'express';
const router = express.Router();
import { unifiedFeed } from '../controllers/feedController.js';

router.get("/", unifiedFeed); // done

export default router;