import { Router } from 'express';
import { getTemplates, createTemplate } from '../controllers/template.controller.js';

const router = Router();

router.get('/', getTemplates);
router.post('/', createTemplate);

export default router;
