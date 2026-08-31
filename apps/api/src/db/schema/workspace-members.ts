import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { workspaces } from "./workspaces.js";

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, {
        onDelete: "cascade",
      }),

    role: varchar("role", {
      length: 20,
    })
      .notNull()
      .default("member"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    unique("workspace_members_user_workspace_unique").on(
      table.userId,
      table.workspaceId,
    ),
  ],
);