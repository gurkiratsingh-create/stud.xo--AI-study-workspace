import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization header",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      message: "Authentication configuration error",
    });
  }

  try {
    const payload = jwt.verify(token, secret);

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.userId !== "string"
    ) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.userId = payload.userId;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}