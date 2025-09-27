import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../config/env.js';
import User from '../models/user.model.js';
interface HttpError extends Error {
  statusCode?: number;
}

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { username, email, password } = req.body;
    if (!email || !username || !password) {
      const error = new Error('Email, username and password are required') as HttpError;
      error.statusCode = 400;
      throw error;
    }
    const emailAlreadyExists = await User.findOne({ email }).session(session);
    if (emailAlreadyExists) {
      const error = new Error('User with this email already exists') as HttpError;
      error.statusCode = 400;
      throw error;
    }
    const usernameAlreadyExists = await User.findOne({ username }).session(session);
    if (usernameAlreadyExists) {
      const error = new Error('Username is already taken') as HttpError;
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create(
      [
        {
          username,
          email,
          password: hashedPassword,
        },
      ],
      { session },
    );

    if (newUser) {
      jwt.sign({ userId: newUser[0]._id }, config.cookie.tokenSecret, {
        expiresIn: '1d',
      });
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        // token,
        user: newUser[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User not Found') as HttpError;
      error.statusCode = 404;
      throw error;
    }
    if (!user.password) {
      const error = new Error('Password not set for this user') as HttpError;
      error.statusCode = 400;
      throw error;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error('Invalid password') as HttpError;
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, config.cookie.tokenSecret, {
      expiresIn: '1d',
    });

    res.cookie('token', token, {
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        // token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const socialSignIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, username, profileImage } = req.body;

    if (!email || !username || !name) {
      const error = new Error('Name, Email, and Username are required') as HttpError;
      error.statusCode = 400;
      throw error;
    }

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (user) {
      // User exists, proceed to sign them in.
    } else {
      // User does not exist, create a new one.
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        const error = new Error('Username is already taken.') as HttpError;
        error.statusCode = 400;
        throw error;
      }

      user = new User({
        name,
        email,
        username,
        profileImage,
        authType: 'social',
      });

      await user.save();
      isNewUser = true;
    }

    // const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    //   expiresIn: JWT_EXPIRES_IN,
    // });

    // res.cookie('token', token, {
    //   httpOnly: true,
    // });

    res.status(isNewUser ? 201 : 200).json({
      success: true,
      message: 'Social user signed in successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// export const signOut = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};
