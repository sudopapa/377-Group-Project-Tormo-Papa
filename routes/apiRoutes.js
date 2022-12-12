/* eslint-disable no-console */
import express from 'express';
import fetch from 'node-fetch';

import internetService from './internetService.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the PG County Public Schools Internet API!');
});

// Generic API inclusion demonstration
// Replace this with the group member's actual route
// This leads to /api/member1
router.use('/internetService', internetService);

export default router;
