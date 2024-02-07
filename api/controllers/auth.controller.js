import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";


export const signup = async (req, res, next) => {
  // console.log(req.body);
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    !username.trim() ||
    !email.trim() ||
    !password.trim()
  ) {
    // return res.status(400).json({ error: "Please fill all fields" });
    next(errorHandler(400,'All fields are required'));
  }
  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPassword });
  try {
     await newUser.save();
    res.status(201).json('Signup successful');
  } catch (error) {
    // res.status(500).json({ error: error.message });
    next(error);
  };
}

 export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (
    !email ||
   
    !password ||
    !email.trim() ||
    
    !password.trim()
  ) {
    // return res.status(400).json({ error: "Please fill all fields" });
    next(errorHandler(400,'All fields are required'));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler( 404, 'User not found') );
    }
    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) 
     return next(errorHandler(400, 'Invalid credentials'));
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: pass , ...rest } = user._doc;
     res.status(200).cookie("access_token", token, { httpOnly: true }).json(rest);
    // res.status(200).json({ message: 'Welcome back!' , user });
  } catch (error) {
  	// console.log(error);
    // res.status(401).json({ error: error.message });
    next(error);
  }
}


export const google = async (req, res, next) => {
  const { name, email, photo } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user){
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass , ...rest } = user._doc;
      res.status(200).cookie("access_token", token, { httpOnly: true }).json(rest);
    }
    else{
      const generatedPassword = Math.random().toString(36).slice(-8) + 
      Math.random().toString(36).slice(-8);
      const hashPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({ username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4) , email, password: hashPassword,
      profilePhoto: photo });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password , ...rest } = newUser._doc;
     res.status(201).cookie("access_token", token, { httpOnly: true }).json(rest);
    }
    
}catch(error){
  next(error);
}
}


