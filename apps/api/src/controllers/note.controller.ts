import type { Response } from "express";

import type {
  AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

import {
  createNoteSchema,
  updateNoteSchema,
} from "../schemas/note.schema.js";

import {
  createNote,
  getWorkspaceNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../services/note.service.js";


// ==========================================
// CREATE NOTE
// POST /api/workspaces/:id/notes
// ==========================================

export async function createNoteController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const workspaceId = req.params.id;

    if (typeof workspaceId !== "string") {
      return res.status(400).json({
        message: "Workspace ID is required",
      });
    }

    const parsed =
      createNoteSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: parsed.error.flatten(),
      });
    }

    try {
      const note = await createNote(
        workspaceId,
        req.userId,
        parsed.data,
      );

      return res.status(201).json({
        message: "Note created successfully",
        note,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "FORBIDDEN"
      ) {
        return res.status(403).json({
          message:
            "You are not a member of this workspace",
        });
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Create note error:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


// ==========================================
// GET ALL NOTES
// GET /api/workspaces/:id/notes
// ==========================================

export async function getNotesController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const workspaceId = req.params.id;

    if (typeof workspaceId !== "string") {
      return res.status(400).json({
        message: "Workspace ID is required",
      });
    }

    try {
      const notes =
        await getWorkspaceNotes(
          workspaceId,
          req.userId,
        );

      return res.status(200).json({
        notes,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "FORBIDDEN"
      ) {
        return res.status(403).json({
          message:
            "You are not a member of this workspace",
        });
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Get notes error:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


// ==========================================
// GET SINGLE NOTE
// GET /api/workspaces/:id/notes/:noteId
// ==========================================

export async function getNoteController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const workspaceId = req.params.id;
    const noteId = req.params.noteId;

    if (
      typeof workspaceId !== "string" ||
      typeof noteId !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid workspace or note ID",
      });
    }

    try {
      const note =
        await getNoteById(
          workspaceId,
          noteId,
          req.userId,
        );

      if (!note) {
        return res.status(404).json({
          message: "Note not found",
        });
      }

      return res.status(200).json({
        note,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "FORBIDDEN"
      ) {
        return res.status(403).json({
          message:
            "You are not a member of this workspace",
        });
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Get note error:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


// ==========================================
// UPDATE NOTE
// PATCH /api/workspaces/:id/notes/:noteId
// ==========================================

export async function updateNoteController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const workspaceId = req.params.id;
    const noteId = req.params.noteId;

    if (
      typeof workspaceId !== "string" ||
      typeof noteId !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid workspace or note ID",
      });
    }

    const parsed =
      updateNoteSchema.safeParse(
        req.body,
      );

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: parsed.error.flatten(),
      });
    }

    try {
      const note =
        await updateNote(
          workspaceId,
          noteId,
          req.userId,
          parsed.data,
        );

      return res.status(200).json({
        message: "Note updated successfully",
        note,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "NOT_FOUND"
      ) {
        return res.status(404).json({
          message: "Note not found",
        });
      }

      if (
        error instanceof Error &&
        error.message === "FORBIDDEN"
      ) {
        return res.status(403).json({
          message:
            "You do not have permission to update this note",
        });
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Update note error:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


// ==========================================
// DELETE NOTE
// DELETE /api/workspaces/:id/notes/:noteId
// ==========================================

export async function deleteNoteController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const workspaceId = req.params.id;
    const noteId = req.params.noteId;

    if (
      typeof workspaceId !== "string" ||
      typeof noteId !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid workspace or note ID",
      });
    }

    try {
      await deleteNote(
        workspaceId,
        noteId,
        req.userId,
      );

      return res.status(204).send();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "NOT_FOUND"
      ) {
        return res.status(404).json({
          message: "Note not found",
        });
      }

      if (
        error instanceof Error &&
        error.message === "FORBIDDEN"
      ) {
        return res.status(403).json({
          message:
            "You do not have permission to delete this note",
        });
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Delete note error:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}