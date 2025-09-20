import express from 'express';
const router = express.Router();
// import upload from "../middlewares/Upload.js";
import multer from "multer";
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

import { CreatePost, GetAllPosts, GetPostByID, DeletePost, LikePost, UnlikePost,CommentOnPost,DeleteComment,GetComments } from '../controllers/postController.js';

router.get("/", GetAllPosts);//done
router.post("/", upload.array("images"), CreatePost);//done
router.get("/getPost", GetPostByID);//done
router.delete("/deletePost", DeletePost);//done
router.post("/like", LikePost);//done
router.post("/unlike", UnlikePost);//done
router.post("/comment", CommentOnPost);//done
router.delete("/deleteComment", DeleteComment);//done
router.get("/getComments", GetComments);//done

export default router;