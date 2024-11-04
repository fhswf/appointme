/**
 * @module authentication_middleware
 */

import { NextFunction, Request, Response } from "express";
import jwt_pkg from 'jsonwebtoken';
import { logger } from "../logging.js";

const { decode, sign, verify } = jwt_pkg;

export const middleware = {
  /**
   * Middleware to check if User is authorized
   * @function
   * @param {request} req
   * @param {response} res
   * @param {callback} next
   */
  requireAuth: (req: Request, res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    const cookie = req.cookies["access_token"];
    if (!header && !cookie) {
      logger.debug("No authorization header");
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
      logger.debug("No authorization token");
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
          logger.error("Invalid token: ", err);
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
  }
}
