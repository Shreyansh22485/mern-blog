
import Comment from '../models/comment.model.js';
import errorHandler from '../utils/error.js';
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
export const getPostComments = async (req, res,next) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ postId }).sort({ createdAt: -1 }).populate('userId', 'username profilePhoto');
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}
export const likeComment = async (req, res,next) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user.id;
        const comment = await Comment.findById(commentId);
        if(!comment) {
            return next(errorHandler(404, 'Comment not found'));

        }
        if(comment.likes.includes(userId)) {
            comment.numberOfLikes = comment.numberOfLikes - 1;
            comment.likes.splice(comment.likes.indexOf(userId), 1);

        }
        else{
            comment.numberOfLikes = comment.numberOfLikes + 1;
            comment.likes.push(userId);
        
        }
        await comment.save();
        res.status(200).json(comment );
    } catch (error) {
        next(error);
    }
}

export const editComment = async (req, res,next) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user.id;
        const { content } = req.body;
        const comment = await Comment.findById(commentId);
        if(!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }
        if(comment.userId !== userId && req.user.isAdmin === false) {
            return next(errorHandler(403, 'Unauthorized'));
        }
        const updatedComment = await Comment.findByIdAndUpdate(commentId, 
            { content }, { new: true } );
        // await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
}
export const deleteComment = async (req, res,next) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user.id;
        const comment = await Comment.findById(commentId);
        if(!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }
        if(comment.userId !== userId && req.user.isAdmin === false) {
            return next(errorHandler(403, 'Unauthorized'));
        }
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        next(error);
    }
}

export const getComments = async (req, res,next) => {
    if(req.user.isAdmin === false) {
        return next(errorHandler(403, 'Unauthorized'));
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort==='asc' ? 1 : -1
        const comments = await Comment.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);
        const total = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        const lastMonthComments = await Comment.find({ createdAt: { $gte: oneMonthAgo } }).countDocuments();
        res.status(200).json({ comments, total, lastMonthComments});
        // res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}