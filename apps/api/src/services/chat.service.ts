import { and, desc, eq } from "drizzle-orm";

import { db } from "@/config/database.js";

import {
  chats,
  messages,
  workspaceMembers,
} from "@/db/schema/index.js";

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
// CREATE CHAT
// ==========================================

export async function createChat(
  workspaceId: string,
  userId: string,
  title: string,
) {
  const membership =
    await getWorkspaceMembership(
      workspaceId,
      userId,
    );

  if (!membership) {
    throw new Error("FORBIDDEN");
  }

  const [chat] = await db
    .insert(chats)
    .values({
      workspaceId,
      title,
    })
    .returning();

  return chat;
}

// ==========================================
// GET ALL CHATS
// ==========================================

export async function getWorkspaceChats(
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
      id: chats.id,
      workspaceId: chats.workspaceId,
      title: chats.title,
      createdAt: chats.createdAt,
      updatedAt: chats.updatedAt,
    })
    .from(chats)
    .where(
      eq(
        chats.workspaceId,
        workspaceId,
      ),
    )
    .orderBy(
      desc(chats.updatedAt),
    );
}

// ==========================================
// GET SINGLE CHAT
// ==========================================

export async function getChatById(
  workspaceId: string,
  chatId: string,
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

  const [chat] = await db
    .select({
      id: chats.id,
      workspaceId: chats.workspaceId,
      title: chats.title,
      createdAt: chats.createdAt,
      updatedAt: chats.updatedAt,
    })
    .from(chats)
    .where(
      and(
        eq(chats.id, chatId),
        eq(
          chats.workspaceId,
          workspaceId,
        ),
      ),
    )
    .limit(1);

  return chat;
}

// ==========================================
// GET CHAT MESSAGES
// ==========================================

export async function getChatMessages(
  workspaceId: string,
  chatId: string,
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

  const chat = await getChatById(
    workspaceId,
    chatId,
    userId,
  );

  if (!chat) {
    throw new Error("NOT_FOUND");
  }

  return db
    .select({
      id: messages.id,
      chatId: messages.chatId,
      role: messages.role,
      content: messages.content,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(
      eq(
        messages.chatId,
        chatId,
      ),
    )
    .orderBy(
      messages.createdAt,
    );
}

// ==========================================
// CREATE MESSAGE
// ==========================================

export async function createMessage(
  workspaceId: string,
  chatId: string,
  userId: string,
  role: "user" | "assistant",
  content: string,
) {
  const membership =
    await getWorkspaceMembership(
      workspaceId,
      userId,
    );

  if (!membership) {
    throw new Error("FORBIDDEN");
  }

  const chat = await getChatById(
    workspaceId,
    chatId,
    userId,
  );

  if (!chat) {
    throw new Error("NOT_FOUND");
  }

  const [message] = await db
    .insert(messages)
    .values({
      chatId,
      role,
      content,
    })
    .returning();

  await db
    .update(chats)
    .set({
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(chats.id, chatId),
        eq(
          chats.workspaceId,
          workspaceId,
        ),
      ),
    );

  return message;
}