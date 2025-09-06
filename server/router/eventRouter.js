import express from 'express';
import { CreateEvent, GetEvent, UpdateEvent, DeleteEvent, AddComment,GetAllEvents } from '../controllers/eventController.js';
const router = express.Router();

router.get('/All', GetAllEvents);
router.post('/createEvent', CreateEvent);
router.get('/getEvent', GetEvent);
router.put('/UpdateEvent', UpdateEvent);
router.delete('/DeleteEvent', DeleteEvent);
router.post('/AddComments', AddComment);

export default router;
