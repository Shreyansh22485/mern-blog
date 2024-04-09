import express from "express";
import { createPost } from "../controllers/post.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
import { getAllPosts } from "../controllers/post.controller.js";
import { deletePost } from "../controllers/post.controller.js";
import { updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post('/create-post', verifyUser, createPost);
router.get("/getposts", getAllPosts);
router.delete("/deletepost/:postId/:userId", verifyUser, deletePost);
router.put("/update-post/:postId/:userId", verifyUser, updatePost);




export default router;