import express from 'express';
import * as leaveHandler from '../handlers/leave-handler';
import { authorizer } from '../middlerwares/auth-middleware';

const router = express.Router();

router.post('/', authorizer, leaveHandler.create);
router.get('/', authorizer, leaveHandler.get);
router.patch('/:id/status', authorizer, leaveHandler.updateStatus);
router.put('/:id', authorizer, leaveHandler.updateLeave);

export default router;
