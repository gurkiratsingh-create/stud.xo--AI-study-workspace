import { Router } from "express";
import type { Response } from "express";
import {
  authMiddleware,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  (req: AuthenticatedRequest, res: Response) => {
    return res.json({
      userId: req.userId,
    });
  },
);

export default router;