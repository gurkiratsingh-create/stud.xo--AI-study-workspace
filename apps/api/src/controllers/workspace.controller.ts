import type { Response } from "express";
import type {
  AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "../schemas/workspace.schema.js";

import {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
} from "../services/workspace.service.js";


// ==========================================
// CREATE WORKSPACE
// POST /api/workspaces
// ==========================================

export async function createWorkspaceController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const parsed = createWorkspaceSchema.safeParse(
      req.body,
    );

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: parsed.error.flatten(),
      });
    }

    const workspace = await createWorkspace(
      req.userId,
      parsed.data,
    );

    return res.status(201).json({
      message: "Workspace created successfully",
      workspace,
    });
  } catch (error) {
    console.error(
      "Create workspace error:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


// ==========================================
// GET ALL USER WORKSPACES
// GET /api/workspaces
// ==========================================

export async function getWorkspacesController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const workspaces = await getUserWorkspaces(
      req.userId,
    );

    return res.status(200).json({
      workspaces,
    });
  } catch (error) {
    console.error(
      "Get workspaces error:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


// ==========================================
// GET SINGLE WORKSPACE
// GET /api/workspaces/:id
// ==========================================

export async function getWorkspaceController(
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

    // Express may type params as string | string[]
    if (typeof workspaceId !== "string") {
      return res.status(400).json({
        message: "Workspace ID is required",
      });
    }

    const workspace = await getWorkspaceById(
      workspaceId,
      req.userId,
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    return res.status(200).json({
      workspace,
    });
  } catch (error) {
    console.error(
      "Get workspace error:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


// ==========================================
// UPDATE WORKSPACE
// PATCH /api/workspaces/:id
// ==========================================

export async function updateWorkspaceController(
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

    // Make sure ID is actually a string
    if (typeof workspaceId !== "string") {
      return res.status(400).json({
        message: "Workspace ID is required",
      });
    }

    const parsed = updateWorkspaceSchema.safeParse(
      req.body,
    );

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: parsed.error.flatten(),
      });
    }

    try {
      const workspace = await updateWorkspace(
        workspaceId,
        req.userId,
        parsed.data,
      );

      if (!workspace) {
        return res.status(404).json({
          message: "Workspace not found",
        });
      }

      return res.status(200).json({
        message: "Workspace updated successfully",
        workspace,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "FORBIDDEN"
      ) {
        return res.status(403).json({
          message:
            "Only workspace owners can update this workspace",
        });
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Update workspace error:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


// ==========================================
// DELETE WORKSPACE
// DELETE /api/workspaces/:id
// ==========================================

export async function deleteWorkspaceController(
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

    // Make sure ID is actually a string
    if (typeof workspaceId !== "string") {
      return res.status(400).json({
        message: "Workspace ID is required",
      });
    }

    try {
      await deleteWorkspace(
        workspaceId,
        req.userId,
      );

      return res.status(204).send();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "FORBIDDEN"
      ) {
        return res.status(403).json({
          message:
            "Only workspace owners can delete this workspace",
        });
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Delete workspace error:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}