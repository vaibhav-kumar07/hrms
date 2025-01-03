import express from 'express';
import * as profileHandler from '../handlers/profile-handler';
import { authorizer } from '../middlerwares/auth-middleware';

const router = express.Router();

router.post('/', authorizer, profileHandler.create);       // Create a new profile
router.get('/candidates', authorizer, profileHandler.getCandidates);
router.get('/employees', authorizer, profileHandler.getEmployees);
router.get('/:id', authorizer, profileHandler.getById);          // Get profile by ID
router.put('/:id', authorizer, profileHandler.update);           // Update a profile
router.patch('/:id/status', authorizer, profileHandler.updateStatus);   // Update candidate status
router.patch('/:id/role', authorizer, profileHandler.updateRole);
router.patch('/:id/attendance', authorizer, profileHandler.updateAttendance
);
router.patch('/:id/task', authorizer, profileHandler.addTask);



export default router;
