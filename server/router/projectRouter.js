import express from 'express';
import { upload } from '../middlewares/Upload.js';
import {
  CreateProject,
  GetProject,
  UpdateProject,
  DeleteProject,
  AddComment,
  GetAllProjects,
} from '../controllers/projectcontroller.js';

const router = express.Router();
router.get('/all', GetAllProjects);
router.post('/createProject', upload.single('image'), CreateProject);
router.get('/getProject/:id', GetProject);
router.put('/updateProject/:id', UpdateProject);
router.delete('/deleteProject/:id', DeleteProject);
router.post('/addComment/:id', AddComment);

export default router;
