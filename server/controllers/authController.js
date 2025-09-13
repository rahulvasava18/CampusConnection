import User from '../models/Userschema.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const RegisterUser = async (req, res) => {
  try {
  
    const { username, password } = req.body;
   
    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'The username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({  
      username,
      password: hashedPassword,
    });

    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    console.error(error);
  }
};


const generateToken = (id) => {
  // console.log("Generating token for user ID:", id);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // token validity
  });
};


export const LoginUser = async (req, res) => {
  try {
    
    
    const { username, password } = req.body;
    // console.log(req.body); 

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });  // Corrected model name
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    const token = generateToken(user._id);
    
    res.status(200).json({ message: 'Login successful', userid : user._id, username:user.username , token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
