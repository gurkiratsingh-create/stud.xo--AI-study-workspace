import { Router } from "express";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

import {
  createWorkspaceController,
  getWorkspacesController,
  getWorkspaceController,
  updateWorkspaceController,
  deleteWorkspaceController,
} from "../controllers/workspace.controller.js";

const router = Router();


// CREATE
router.post(
  "/",
  authMiddleware,
  createWorkspaceController,
);


// GET ALL
router.get(
  "/",
  authMiddleware,
  getWorkspacesController,
);


// GET ONE
router.get(
  "/:id",
  authMiddleware,
  getWorkspaceController,
);


// UPDATE
router.patch(
  "/:id",
  authMiddleware,
  updateWorkspaceController,
);


// DELETE
router.delete(
  "/:id",
  authMiddleware,
  deleteWorkspaceController,
);


export default router;