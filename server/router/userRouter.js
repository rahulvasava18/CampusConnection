import express from 'express';
import { GetProfile,UpdateUserProfile, acceptFollowRequest,rejectFollowRequest,GetEvent,GetPost,GetProject} from '../controllers/userController.js';

const router = express.Router();

router.get("/profile/:userId",GetProfile);//done
router.get("/post/:userId",GetPost);//done
router.get("/event/:userId",GetEvent);//done
router.get("/project/:userId",GetProject);//done
router.put("/update", UpdateUserProfile);//done
router.post("/acceptfollowrequest/:userId", acceptFollowRequest);//done
router.post("/rejectfollowrequest/:userId", rejectFollowRequest);//done

export default router;