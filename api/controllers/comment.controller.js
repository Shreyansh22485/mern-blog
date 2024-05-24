
import Comment from '../models/comment.model.js';
export const createComment = async (req, res,next) => {
    try {
        const { postId, userId, content } = req.body;
        if(userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const newComment = new Comment({ postId, userId, content });
        await newComment.save();
        res.status(201).json({ message: 'Comment created successfully' });
    } catch (error) {
        next(error);
    }
}