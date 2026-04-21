import express from 'express';
import { getProjects, getProjectById } from '../controllers/projectsController.js';

const router = express.Router();

// GET - Tous les projets
router.get('/', getProjects);

// GET - Un projet spécifique
router.get('/:id', getProjectById);

export default router;
