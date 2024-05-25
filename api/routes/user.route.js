import express from 'express';
import { test } from '../controllers/user.controller.js';
import { updateUser } from '../controllers/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';
import { deleteUser } from '../controllers/user.controller.js';
import { signout } from '../controllers/user.controller.js';
import { getUsers } from '../controllers/user.controller.js';
import { getUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/test',test);
router.put('/update/:userId',verifyUser,updateUser)
router.delete('/delete/:userId',verifyUser,deleteUser)
router.post('/signout',signout);
router.get('/getusers',verifyUser,getUsers)
router.get('/:userId',getUser)

export default router;