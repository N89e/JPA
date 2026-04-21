import express from 'express';
import { getServices } from '../controllers/servicesController.js';

const router = express.Router();

// GET - Tous les services
router.get('/', getServices);

export default router;
