import { z } from "zod";

export const createChatSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Chat title is required.")
    .max(200, "Chat title must be 200 characters or less."),
});

export const sendMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty."),
});

export type CreateChatInput = z.infer<
  typeof createChatSchema
>;

export type SendMessageInput = z.infer<
  typeof sendMessageSchema
>;