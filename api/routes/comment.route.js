import  express  from 'express';
import { createComment } from '../controllers/comment.controller.js';
import { verifyUser } from './../utils/verifyUser.js';
import { getPostComments } from '../controllers/comment.controller.js';
import { likeComment } from '../controllers/comment.controller.js';
import { editComment } from '../controllers/comment.controller.js';
import { deleteComment } from '../controllers/comment.controller.js';
import { getComments } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create',verifyUser ,createComment);
router.get('/getPostComments/:postId',getPostComments);
router.put('/likeComment/:commentId',verifyUser,likeComment);
router.put('/editComment/:commentId',verifyUser,editComment);
router.delete('/deleteComment/:commentId',verifyUser,deleteComment);
router.get('/getcomments',verifyUser,getComments);

export default router;