import { Router } from 'express';
import { jtwAuth } from '../middlewares/jwtValidation.js';
import { postNote } from '../controllers/postNoteController.js';

const router = Router();
router.post('/note/create', jtwAuth, postNote);

export default router;