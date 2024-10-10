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
  const cookie = req.cookies["access_token"];
  if (!header && !cookie) {
    console.log("No authorization header");
    res
      .status(401)
      .set("WWW-Authenticate", 'Bearer')
      .json({
        success: false,
        message: "Unauthorized! Sign in again!",
      });
    return
  }
  const token = cookie || header.split(" ")[1];
  if (!token) {
    console.log("No authorization token");
    res
      .status(401)
      .set("WWW-Authenticate", 'Bearer')
      .json({
        success: false,
        message: "Unauthorized! Sign in again!",
      });
  } else {
    verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("Invalid token: ", err);
        return res
          .status(401)
          .set("WWW-Authenticate", 'Bearer')
          .json({
            success: false,
            message: "Unauthorized! Sign in again!",
          });
      } else {
        req['user_id'] = decoded["_id"] as string;
        next();
      }
    });
  }
};
