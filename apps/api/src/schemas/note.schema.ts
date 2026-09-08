import { z } from "zod";

export const createNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or less"),

  content: z
    .string()
    .trim()
    .min(1, "Content is required"),
});

export const updateNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or less")
    .optional(),

  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .optional(),
});

export type CreateNoteInput = z.infer<
  typeof createNoteSchema
>;

export type UpdateNoteInput = z.infer<
  typeof updateNoteSchema
>;