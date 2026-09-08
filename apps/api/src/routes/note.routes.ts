import { Router } from "express";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

import {
  createNoteController,
  getNotesController,
  getNoteController,
  updateNoteController,
  deleteNoteController,
} from "../controllers/note.controller.js";

const router = Router({
  mergeParams: true,
});

router.post(
  "/",
  authMiddleware,
  createNoteController,
);

router.get(
  "/",
  authMiddleware,
  getNotesController,
);

router.get(
  "/:noteId",
  authMiddleware,
  getNoteController,
);

router.patch(
  "/:noteId",
  authMiddleware,
  updateNoteController,
);

router.delete(
  "/:noteId",
  authMiddleware,
  deleteNoteController,
);

export default router;