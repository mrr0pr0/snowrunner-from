import { relations } from "drizzle-orm";
import { users, guides, markers, comments } from "./schema.js";

export const guidesRelations = relations(guides, ({ one, many }) => ({
  author: one(users),
  markers: many(markers),
  comments: many(comments),
}));

export const markersRelations = relations(markers, ({ one }) => ({
  guide: one(guides),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  guide: one(guides),
  author: one(users),
}));
