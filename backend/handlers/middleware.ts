/**
 * @module authentication_middleware
 */

import { NextFunction, Request, Response } from "express";
import jwt_pkg from 'jsonwebtoken';
const { decode, sign, verify } = jwt_pkg;

/**
 * Middleware to check if User is authorized
 * @function
 * @param {request} req
 * @param {response} res
 * @param {callback} next
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header) {
    res.json({
      success: false,
      message: "Unauthorized! Sign in again!",
    });
    return
  }
  const token = header.split(" ")[1];
  if (!token) {
    res.json({
      success: false,
      message: "Unauthorized! Sign in again!",
    });
  } else {
    verify(token, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Unauthorized! Sign in again!",
        });
      } else {
        //req.user_id = decoded._id as string;
        next();
      }
    });
  }
};
