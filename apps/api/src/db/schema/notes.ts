import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { workspaces } from "./workspaces.js";

export const notes = pgTable("notes", {
  id: uuid("id").defaultRandom().primaryKey(),

  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, {
      onDelete: "cascade",
    }),

  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  title: varchar("title", {
    length: 255,
  }).notNull(),

  content: text("content").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});