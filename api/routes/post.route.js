import express from "express";
import { createPost } from "../controllers/post.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/create-post', verifyUser, createPost);

export default router;