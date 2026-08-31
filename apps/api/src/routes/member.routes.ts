import { Router } from "express";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

import {
  addMemberController,
  getMembersController,
  removeMemberController,
} from "../controllers/member.controller.js";

const router = Router({
  mergeParams: true,
});

router.post(
  "/",
  authMiddleware,
  addMemberController,
);

router.get(
  "/",
  authMiddleware,
  getMembersController,
);

router.delete(
  "/:userId",
  authMiddleware,
  removeMemberController,
);

export default router;