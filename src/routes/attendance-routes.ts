import express from 'express';
import * as attendanceHandler from "../handlers/attendance-handler"
import { authorizer } from '../middlerwares/auth-middleware';

const router = express.Router();

router.post('/', authorizer, attendanceHandler.create);             // Create attendance
router.get('/', authorizer, attendanceHandler.get);                 // Get attendance records
router.patch('/:id/status', authorizer, attendanceHandler.updateStatus); // Update attendance status
router.patch('/:id/task', authorizer, attendanceHandler.updateTask); // Update attendance task

export default router;
