import express from 'express';
import { scrapFeats } from '../controllers/featsController';

const router = express.Router();

router.get('/scrap-feats', scrapFeats);

export default router;
