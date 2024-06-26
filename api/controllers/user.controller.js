
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
export const test = (req,res) => {
    res.json({message:"API"})
}

export const updateUser = async (req,res,next) => {
    if( req.user.id !== req.params.userId) return next(errorHandler( 401, 'Unauthorized because of the user id'));
    if(req.body.password){
        if(req.body.password.length < 6) return next(errorHandler(400,'Password must be at least 6 characters'));
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if(req.body.username){
        if( req.body.username.length < 3 || req.body.username.length > 20) return next(errorHandler(400,'Username must be between 3 and 20 characters'));
        if( req.body.username.includes(' ') ) return next(errorHandler(400,'Username must not contain spaces'));
        if( req.body.username !== req.body.username.toLowerCase()) return next(errorHandler(400,'Username must be lowercase'));
        if( !req.body.username.match(/^[a-z0-9]+$/)) return next(errorHandler(400,'Username must contain only letters and numbers'));
    }
        try {
            const user = await User.findByIdAndUpdate( req.params.userId,
                {
                $set:{
                    username:req.body.username,
                    password:req.body.password,
                    email : req.body.email,
                    profilePhoto:req.body.profilePhoto,
                
                },
            },{ new:true});
            const { password, ...rest } = user._doc;
            res.status(200).json(rest);
            
                
            
        } catch (error) {
            next(error)
        }
    
}

export const deleteUser = async (req,res,next) => {
    if(!req.user.isAdmin && req.user.id !== req.params.userId) return next(errorHandler( 401, 'Unauthorized because of the user id'));
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User deleted successfully');
    } catch (error) {
        next(error)
    }
}
export const signout = (req,res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('Signout successful');
        
    } catch (error) {
        next(error)
        
    }
}
export const getUsers = async (req,res,next) => {
    if( !req.user.isAdmin) return next(errorHandler(401, 'Unauthorized Access'))
    try {
        const startIndex = Number(req.query.startIndex) || 0;
        const limit = Number(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;
        const users = await User.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit);

        const usersWithoutPassword = users.map((user) => {
           const {password ,...other}= user._doc;
              return other;
          });
        const total = await User.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });
        res.status(200).json({users: usersWithoutPassword, total, lastMonthUsers});

    } catch (error) {
        next(error)
    }
}

export const getUser = async (req,res,next) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if(!user) return next(errorHandler(404, 'User not found'));
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}
    