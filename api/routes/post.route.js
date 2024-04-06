import express from "express";
import { createPost } from "../controllers/post.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
import { getAllPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.post('/create-post', verifyUser, createPost);
// @desc      Get all posts
// @route     GET /api/posts
// @access    Public 
router.get("/getposts", getAllPosts);



export default router;