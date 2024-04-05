
import Post from '../models/post.model.js';

export const createPost =  async (req, res,next) => {
    if(!req.user.isAdmin)
    return next({statusCode:403,message:'You are not allowed to create a post'});
    if( !req.body.title || !req.body.content)
    return next({statusCode:400,message:'Title and content are required'});

    const slug = req.body.title.toLowerCase().split(' ').join('-').replace(/[^a-zA-Z0-9-]/g, "");
    const newPost = new Post({
        ...req.body,
        userId: req.user.id,
        slug,
    });
    try {
        const post = await newPost.save();
        res.status(201).json({success:true,post});
    } catch (error) {
        next(error);
    }
}