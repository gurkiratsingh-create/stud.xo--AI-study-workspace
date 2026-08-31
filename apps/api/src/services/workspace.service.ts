import { db } from "../config/database.js";
import {
  users,
  workspaceMembers,
  workspaces,
} from "../db/schema/index.js";
import { and, eq } from "drizzle-orm";

import type {
  CreateWorkspaceInput,
} from "../schemas/workspace.schema.js";


// ==========================================
// CREATE WORKSPACE
// ==========================================

export async function createWorkspace(
  userId: string,
  input: CreateWorkspaceInput,
) {
  const [workspace] = await db
    .insert(workspaces)
    .values({
      name: input.name,
    })
    .returning();

  await db.insert(workspaceMembers).values({
    workspaceId: workspace.id,
    userId,
    role: "owner",
  });

  return workspace;
}


// ==========================================
// GET USER WORKSPACES
// ==========================================

export async function getUserWorkspaces(
  userId: string,
) {
  return db
    .select({
      id: workspaces.id,
      name: workspaces.name,
      createdAt: workspaces.createdAt,
      updatedAt: workspaces.updatedAt,
      role: workspaceMembers.role,
    })
    .from(workspaceMembers)
    .innerJoin(
      workspaces,
      eq(
        workspaceMembers.workspaceId,
        workspaces.id,
      ),
    )
    .where(
      eq(workspaceMembers.userId, userId),
    );
}


// ==========================================
// GET SINGLE WORKSPACE
// ==========================================

export async function getWorkspaceById(
  workspaceId: string,
  userId: string,
) {
  const [result] = await db
    .select({
      id: workspaces.id,
      name: workspaces.name,
      createdAt: workspaces.createdAt,
      updatedAt: workspaces.updatedAt,
      role: workspaceMembers.role,
    })
    .from(workspaceMembers)
    .innerJoin(
      workspaces,
      eq(
        workspaceMembers.workspaceId,
        workspaces.id,
      ),
    )
    .where(
      and(
        eq(
          workspaceMembers.workspaceId,
          workspaceId,
        ),
        eq(
          workspaceMembers.userId,
          userId,
        ),
      ),
    )
    .limit(1);

  return result;
}


// ==========================================
// CHECK WORKSPACE OWNER
// ==========================================

export async function isWorkspaceOwner(
  workspaceId: string,
  userId: string,
) {
  const [membership] = await db
    .select({
      role: workspaceMembers.role,
    })
    .from(workspaceMembers)
    .where(
      and(
        eq(
          workspaceMembers.workspaceId,
          workspaceId,
        ),
        eq(
          workspaceMembers.userId,
          userId,
        ),
      ),
    )
    .limit(1);

  return membership?.role === "owner";
}


// ==========================================
// UPDATE WORKSPACE
// ==========================================

export async function updateWorkspace(
  workspaceId: string,
  userId: string,
  input: CreateWorkspaceInput,
) {
  const owner = await isWorkspaceOwner(
    workspaceId,
    userId,
  );

  if (!owner) {
    throw new Error("FORBIDDEN");
  }

  const [workspace] = await db
    .update(workspaces)
    .set({
      name: input.name,
      updatedAt: new Date(),
    })
    .where(eq(workspaces.id, workspaceId))
    .returning();

  return workspace;
}


// ==========================================
// DELETE WORKSPACE
// ==========================================

export async function deleteWorkspace(
  workspaceId: string,
  userId: string,
) {
  const owner = await isWorkspaceOwner(
    workspaceId,
    userId,
  );

  if (!owner) {
    throw new Error("FORBIDDEN");
  }

  await db
    .delete(workspaces)
    .where(eq(workspaces.id, workspaceId));

  return true;
}
export async function addWorkspaceMember(
  workspaceId: string,
  ownerId: string,
  email: string,
) {
  const owner = await isWorkspaceOwner(
    workspaceId,
    ownerId,
  );

  if (!owner) {
    throw new Error("FORBIDDEN");
  }

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const [existingMember] = await db
    .select()
    .from(workspaceMembers)
    .where(
      and(
        eq(
          workspaceMembers.workspaceId,
          workspaceId,
        ),
        eq(
          workspaceMembers.userId,
          user.id,
        ),
      ),
    )
    .limit(1);

  if (existingMember) {
    throw new Error("ALREADY_MEMBER");
  }

  const [member] = await db
    .insert(workspaceMembers)
    .values({
      workspaceId,
      userId: user.id,
      role: "member",
    })
    .returning();

  return {
    ...member,
    user,
  };
}
export async function getWorkspaceMembers(
  workspaceId: string,
  userId: string,
) {
  const membership = await getWorkspaceById(
    workspaceId,
    userId,
  );

  if (!membership) {
    throw new Error("FORBIDDEN");
  }

  return db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      role: workspaceMembers.role,
    })
    .from(workspaceMembers)
    .innerJoin(
      users,
      eq(
        workspaceMembers.userId,
        users.id,
      ),
    )
    .where(
      eq(
        workspaceMembers.workspaceId,
        workspaceId,
      ),
    );
}
export async function removeWorkspaceMember(
  workspaceId: string,
  ownerId: string,
  userId: string,
) {
  const owner = await isWorkspaceOwner(
    workspaceId,
    ownerId,
  );

  if (!owner) {
    throw new Error("FORBIDDEN");
  }

  const [member] = await db
    .select({
      role: workspaceMembers.role,
    })
    .from(workspaceMembers)
    .where(
      and(
        eq(
          workspaceMembers.workspaceId,
          workspaceId,
        ),
        eq(
          workspaceMembers.userId,
          userId,
        ),
      ),
    )
    .limit(1);

  if (!member) {
    throw new Error("MEMBER_NOT_FOUND");
  }

  if (member.role === "owner") {
    throw new Error("CANNOT_REMOVE_OWNER");
  }

  await db
    .delete(workspaceMembers)
    .where(
      and(
        eq(
          workspaceMembers.workspaceId,
          workspaceId,
        ),
        eq(
          workspaceMembers.userId,
          userId,
        ),
      ),
    );

  return true;
}