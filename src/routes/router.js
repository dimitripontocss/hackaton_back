import { Router } from 'express';
import authRouter from './authrouter.js';
import postNoteRouter from './postNotesRouter.js'

const router = Router();
router.use([authRouter, postNoteRouter]);

export default router;