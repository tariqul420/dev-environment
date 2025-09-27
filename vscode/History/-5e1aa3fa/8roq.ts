import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, NODE_ENV } from '../config/env';

export const createToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInfo = req.body;
    const token = jwt.sign(userInfo, JWT_SECRET, {
      expiresIn: '1d',
    });
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: NODE_ENV === 'production' ? 'none' : 'strict',
      })
      .send({ success: true });
  } catch (error) {
    next(error);
  }
};

export const removeToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res
      .clearCookie(config.cookie.tokenName, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: config.nodeEnv === 'production' ? 'none' : 'strict',
        path: '/',
      })
      .send({ success: true });
  } catch (error) {
    next(error);
  }
};
