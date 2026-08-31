import type { Response } from "express";
import type {
  AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

import { addMemberSchema } from "../schemas/member.schema.js";

import {
  addWorkspaceMember,
  getWorkspaceMembers,
  removeWorkspaceMember,
} from "../services/workspace.service.js";


// ==========================================
// ADD MEMBER
// POST /api/workspaces/:id/members
// ==========================================

export async function addMemberController(
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

    const parsed = addMemberSchema.safeParse(
      req.body,
    );

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: parsed.error.flatten(),
      });
    }

    try {
      const member = await addWorkspaceMember(
        workspaceId,
        req.userId,
        parsed.data.email,
      );

      return res.status(201).json({
        message: "Member added successfully",
        member,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "FORBIDDEN"
      ) {
        return res.status(403).json({
          message:
            "Only workspace owners can add members",
        });
      }

      if (
        error instanceof Error &&
        error.message === "USER_NOT_FOUND"
      ) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (
        error instanceof Error &&
        error.message === "ALREADY_MEMBER"
      ) {
        return res.status(409).json({
          message: "User is already a workspace member",
        });
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Add member error:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


// ==========================================
// GET MEMBERS
// GET /api/workspaces/:id/members
// ==========================================

export async function getMembersController(
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
      const members = await getWorkspaceMembers(
        workspaceId,
        req.userId,
      );

      return res.status(200).json({
        members,
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
      "Get members error:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


// ==========================================
// REMOVE MEMBER
// DELETE /api/workspaces/:id/members/:userId
// ==========================================

export async function removeMemberController(
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
    const memberUserId = req.params.userId;

    if (
      typeof workspaceId !== "string" ||
      typeof memberUserId !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid workspace or user ID",
      });
    }

    try {
      await removeWorkspaceMember(
        workspaceId,
        req.userId,
        memberUserId,
      );

      return res.status(204).send();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "FORBIDDEN"
      ) {
        return res.status(403).json({
          message:
            "Only workspace owners can remove members",
        });
      }

      if (
        error instanceof Error &&
        error.message === "MEMBER_NOT_FOUND"
      ) {
        return res.status(404).json({
          message: "Member not found",
        });
      }

      if (
        error instanceof Error &&
        error.message === "CANNOT_REMOVE_OWNER"
      ) {
        return res.status(400).json({
          message: "Workspace owner cannot be removed",
        });
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Remove member error:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}