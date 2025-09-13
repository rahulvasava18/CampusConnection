import express from 'express';
import { upload } from '../middlewares/Upload.js';
import { CreateEvent, GetEvent, UpdateEvent, DeleteEvent, AddComment,GetAllEvents } from '../controllers/eventController.js';
const router = express.Router();

router.get('/all', GetAllEvents);
router.post('/createEvent', upload.single('image'), CreateEvent);
router.get('/getEvent', GetEvent);
router.put('/UpdateEvent', UpdateEvent);
router.delete('/DeleteEvent', DeleteEvent);
router.post('/AddComments', AddComment);

export default router;
