import { and, desc, eq } from "drizzle-orm";

import { db } from "@/config/database.js";
import {
  notes,
  users,
  workspaceMembers,
} from "@/db/schema/index.js";


// ==========================================
// CHECK WORKSPACE MEMBERSHIP
// ==========================================

async function getWorkspaceMembership(
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

  return membership;
}


// ==========================================
// CREATE NOTE
// ==========================================

export async function createNote(
  workspaceId: string,
  userId: string,
  data: {
    title: string;
    content: string;
  },
) {
  const membership =
    await getWorkspaceMembership(
      workspaceId,
      userId,
    );

  if (!membership) {
    throw new Error("FORBIDDEN");
  }

  const [note] = await db
    .insert(notes)
    .values({
      workspaceId,
      createdBy: userId,
      title: data.title,
      content: data.content,
    })
    .returning();

  return note;
}


// ==========================================
// GET ALL NOTES
// ==========================================

export async function getWorkspaceNotes(
  workspaceId: string,
  userId: string,
) {
  const membership =
    await getWorkspaceMembership(
      workspaceId,
      userId,
    );

  if (!membership) {
    throw new Error("FORBIDDEN");
  }

  return db
    .select({
      id: notes.id,
      title: notes.title,
      content: notes.content,
      createdBy: notes.createdBy,
      createdByName: users.name,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
    })
    .from(notes)
    .innerJoin(
      users,
      eq(
        notes.createdBy,
        users.id,
      ),
    )
    .where(
      eq(
        notes.workspaceId,
        workspaceId,
      ),
    )
    .orderBy(
      desc(notes.updatedAt),
    );
}


// ==========================================
// GET SINGLE NOTE
// ==========================================

export async function getNoteById(
  workspaceId: string,
  noteId: string,
  userId: string,
) {
  const membership =
    await getWorkspaceMembership(
      workspaceId,
      userId,
    );

  if (!membership) {
    throw new Error("FORBIDDEN");
  }

  const [note] = await db
    .select({
      id: notes.id,
      title: notes.title,
      content: notes.content,
      createdBy: notes.createdBy,
      createdByName: users.name,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
    })
    .from(notes)
    .innerJoin(
      users,
      eq(
        notes.createdBy,
        users.id,
      ),
    )
    .where(
      and(
        eq(
          notes.id,
          noteId,
        ),
        eq(
          notes.workspaceId,
          workspaceId,
        ),
      ),
    )
    .limit(1);

  return note;
}


// ==========================================
// UPDATE NOTE
// ==========================================

export async function updateNote(
  workspaceId: string,
  noteId: string,
  userId: string,
  data: {
    title?: string;
    content?: string;
  },
) {
  const membership =
    await getWorkspaceMembership(
      workspaceId,
      userId,
    );

  if (!membership) {
    throw new Error("FORBIDDEN");
  }

  const [note] = await db
    .select({
      createdBy: notes.createdBy,
    })
    .from(notes)
    .where(
      and(
        eq(
          notes.id,
          noteId,
        ),
        eq(
          notes.workspaceId,
          workspaceId,
        ),
      ),
    )
    .limit(1);

  if (!note) {
    throw new Error("NOT_FOUND");
  }

  const isOwner =
    membership.role === "owner";

  const isCreator =
    note.createdBy === userId;

  if (!isOwner && !isCreator) {
    throw new Error("FORBIDDEN");
  }

  const [updatedNote] = await db
    .update(notes)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(
          notes.id,
          noteId,
        ),
        eq(
          notes.workspaceId,
          workspaceId,
        ),
      ),
    )
    .returning();

  return updatedNote;
}


// ==========================================
// DELETE NOTE
// ==========================================

export async function deleteNote(
  workspaceId: string,
  noteId: string,
  userId: string,
) {
  const membership =
    await getWorkspaceMembership(
      workspaceId,
      userId,
    );

  if (!membership) {
    throw new Error("FORBIDDEN");
  }

  const [note] = await db
    .select({
      createdBy: notes.createdBy,
    })
    .from(notes)
    .where(
      and(
        eq(
          notes.id,
          noteId,
        ),
        eq(
          notes.workspaceId,
          workspaceId,
        ),
      ),
    )
    .limit(1);

  if (!note) {
    throw new Error("NOT_FOUND");
  }

  const isOwner =
    membership.role === "owner";

  const isCreator =
    note.createdBy === userId;

  if (!isOwner && !isCreator) {
    throw new Error("FORBIDDEN");
  }

  await db
    .delete(notes)
    .where(
      and(
        eq(
          notes.id,
          noteId,
        ),
        eq(
          notes.workspaceId,
          workspaceId,
        ),
      ),
    );
}