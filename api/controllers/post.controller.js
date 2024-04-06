import Post from "../models/post.model.js";

export const createPost = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next({
      statusCode: 403,
      message: "You are not allowed to create a post",
    });
  if (!req.body.title || !req.body.content)
    return next({ statusCode: 400, message: "Title and content are required" });

  const slug = req.body.title
    .toLowerCase()
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newPost = new Post({
    ...req.body,
    userId: req.user.id,
    slug,
  });
  try {
    const post = await newPost.save();
    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
export const getAllPosts = async (req, res, next) => {
  try {
    console.log(req.query.userId);
    const startIndex = req.query.startIndex
      ? parseInt(req.query.startIndex)
      : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const total = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
        createdAt: { $gte: oneMonthAgo }
    });

    res.status(200).json({ success: true, posts, total, lastMonthPosts });
    
      
  } catch (error) {
    next(error);
  }
};
