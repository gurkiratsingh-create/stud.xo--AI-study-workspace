import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { chats } from "./chats.js";

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),

  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id, {
      onDelete: "cascade",
    }),

  role: varchar("role", {
    length: 20,
  }).notNull(),

  content: text("content").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});