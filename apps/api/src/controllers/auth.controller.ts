import type { Request, Response } from "express";
import {
  registerUser,
  loginUser,
} from "../services/auth.service.js";

import {
  registerSchema,
  loginSchema,
} from "../schemas/auth.schema.js";


export async function register(
  req: Request,
  res: Response,
) {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: parsed.error.flatten(),
      });
    }

    const user = await registerUser(parsed.data);

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "USER_ALREADY_EXISTS"
    ) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
export async function login(
  req: Request,
  res: Response,
) {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: parsed.error.flatten(),
      });
    }

    const result = await loginUser(parsed.data);

    return res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (
      error instanceof Error &&
      error.message === "JWT_SECRET_MISSING"
    ) {
      return res.status(500).json({
        message: "Authentication configuration error",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}