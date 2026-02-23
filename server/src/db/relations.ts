import { relations } from "drizzle-orm";
import { users, guides, markers, comments } from './schema.js';

export const usersRelations = relations(users, ({ many }) => ({
  guides: many(guides),
  comments: many(comments),
}));

