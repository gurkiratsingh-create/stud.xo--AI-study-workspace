import type { Response } from "express";

import {
  createChat,
  createMessage,
  getChatById,
  getChatMessages,
  getWorkspaceChats,
} from "@/services/chat.service.js";

import {
  generateAIResponse,
} from "@/services/ai.service.js";

import {
  createChatSchema,
  sendMessageSchema,
} from "@/schemas/chat.schema.js";

import type {
  AuthenticatedRequest,
} from "@/middleware/auth.middleware.js";

// CREATE CHAT
export async function createChatController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const workspaceId = req.params.id;

    if (typeof workspaceId !== "string") {
      return res.status(400).json({
        message: "Workspace ID is required",
      });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const result =
      createChatSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid chat data",
        errors: result.error.flatten(),
      });
    }

    const chat = await createChat(
      workspaceId,
      userId,
      result.data.title,
    );

    return res.status(201).json({
      message: "Chat created successfully",
      chat,
    });
  } catch (error: any) {
    console.error("Create chat error:", error);

    if (error.message === "FORBIDDEN") {
      return res.status(403).json({
        message:
          "You do not have access to this workspace",
      });
    }

    return res.status(500).json({
      message: "Failed to create chat",
    });
  }
}

// GET ALL CHATS
export async function getWorkspaceChatsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const workspaceId = req.params.id;

    if (typeof workspaceId !== "string") {
      return res.status(400).json({
        message: "Workspace ID is required",
      });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const chats = await getWorkspaceChats(
      workspaceId,
      userId,
    );

    return res.status(200).json({
      chats,
    });
  } catch (error: any) {
    console.error("Get chats error:", error);

    if (error.message === "FORBIDDEN") {
      return res.status(403).json({
        message:
          "You do not have access to this workspace",
      });
    }

    return res.status(500).json({
      message: "Failed to load chats",
    });
  }
}

// GET SINGLE CHAT
export async function getChatController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const workspaceId = req.params.id;
    const chatId = req.params.chatId;

    if (
      typeof workspaceId !== "string" ||
      typeof chatId !== "string"
    ) {
      return res.status(400).json({
        message:
          "Workspace ID and Chat ID are required",
      });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const chat = await getChatById(
      workspaceId,
      chatId,
      userId,
    );

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    return res.status(200).json({
      chat,
    });
  } catch (error: any) {
    console.error("Get chat error:", error);

    if (error.message === "FORBIDDEN") {
      return res.status(403).json({
        message:
          "You do not have access to this workspace",
      });
    }

    return res.status(500).json({
      message: "Failed to load chat",
    });
  }
}

// GET CHAT MESSAGES
export async function getChatMessagesController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const workspaceId = req.params.id;
    const chatId = req.params.chatId;

    if (
      typeof workspaceId !== "string" ||
      typeof chatId !== "string"
    ) {
      return res.status(400).json({
        message:
          "Workspace ID and Chat ID are required",
      });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const messages = await getChatMessages(
      workspaceId,
      chatId,
      userId,
    );

    return res.status(200).json({
      messages,
    });
  } catch (error: any) {
    console.error(
      "Get chat messages error:",
      error,
    );

    if (error.message === "FORBIDDEN") {
      return res.status(403).json({
        message:
          "You do not have access to this workspace",
      });
    }

    if (error.message === "NOT_FOUND") {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    return res.status(500).json({
      message: "Failed to load messages",
    });
  }
}

// CREATE MESSAGE + AI RESPONSE
export async function createMessageController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const workspaceId = req.params.id;
    const chatId = req.params.chatId;

    if (
      typeof workspaceId !== "string" ||
      typeof chatId !== "string"
    ) {
      return res.status(400).json({
        message:
          "Workspace ID and Chat ID are required",
      });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const result =
      sendMessageSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid message data",
        errors: result.error.flatten(),
      });
    }

    // 1. Save the user's message
    const userMessage =
      await createMessage(
        workspaceId,
        chatId,
        userId,
        "user",
        result.data.content,
      );

    // 2. Send the message to the AI service
    const aiResponse =
      await generateAIResponse(
        result.data.content,
      );

    // 3. Save the AI response
    const assistantMessage =
      await createMessage(
        workspaceId,
        chatId,
        userId,
        "assistant",
        aiResponse,
      );

    // 4. Return both messages
    return res.status(201).json({
      message: "Message sent successfully",
      data: {
        userMessage,
        assistantMessage,
      },
    });
  } catch (error: any) {
    console.error(
      "Create message error:",
      error,
    );

    if (error.message === "FORBIDDEN") {
      return res.status(403).json({
        message:
          "You do not have access to this workspace",
      });
    }

    if (error.message === "NOT_FOUND") {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    // AI service unavailable
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT"
    ) {
      return res.status(503).json({
        message:
          "AI service is currently unavailable",
      });
    }

    return res.status(500).json({
      message: "Failed to send message",
    });
  }
}