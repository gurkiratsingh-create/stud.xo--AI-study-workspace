import { Router, type RequestHandler } from "express";

import {
  createChatController,
  createMessageController,
  getChatController,
  getChatMessagesController,
  getWorkspaceChatsController,
} from "@/controllers/chat.controller.js";

import { authMiddleware } from "@/middleware/auth.middleware.js";

const router = Router({
  mergeParams: true,
});

router.use(authMiddleware);

// GET /api/workspaces/:id/chats
router.get(
  "/",
  getWorkspaceChatsController as unknown as RequestHandler,
);

// POST /api/workspaces/:id/chats
router.post(
  "/",
  createChatController as unknown as RequestHandler,
);

// GET /api/workspaces/:id/chats/:chatId
router.get(
  "/:chatId",
  getChatController as unknown as RequestHandler,
);

// GET /api/workspaces/:id/chats/:chatId/messages
router.get(
  "/:chatId/messages",
  getChatMessagesController as unknown as RequestHandler,
);

// POST /api/workspaces/:id/chats/:chatId/messages
router.post(
  "/:chatId/messages",
  createMessageController as unknown as RequestHandler,
);

export default router;