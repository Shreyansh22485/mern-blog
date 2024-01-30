import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
export const signup = async (req, res, next) => {
  console.log(req.body);
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
    const savedUser = await newUser.save();
    res.status(201).json({ user: savedUser });
  } catch (error) {
    // res.status(500).json({ error: error.message });
    next(error);
  }

  //   try {
  //     const user = await User.create({ username, email, password });
  //     res.status(201).json({ user });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
};
