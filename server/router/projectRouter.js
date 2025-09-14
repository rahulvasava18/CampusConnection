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

// Get all projects
router.get('/all', GetAllProjects);

// Create a new project (single image upload)
router.post('/createProject', upload.single('image'), CreateProject);

// Get a single project by ID
router.get('/getProject/:id', GetProject);

// Update a project by ID
router.put('/updateProject/:id', UpdateProject);

// Delete a project by ID
router.delete('/deleteProject/:id', DeleteProject);

// Add comment to a project
router.post('/addComment/:id', AddComment);

export default router;
