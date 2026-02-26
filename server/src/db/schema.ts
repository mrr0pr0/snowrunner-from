import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  real,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";


export const userRoleEnum = pgEnum("user_role", ["user", "admin", "moderator"]);
export const markerTypeEnum = pgEnum("marker_type", [
  "waypoint",
  "hazard",
  "resource",
  "garage",
  "other",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  username: text("username").notNull(),
  passwordHash: text("password_hash").notNull(),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const guides = pgTable("guides", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  mapId: text("map_id").notNull(),
  mapName: text("map_name").notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const markers = pgTable("markers", {
  id: uuid("id").primaryKey().defaultRandom(),
  guideId: uuid("guide_id")
    .notNull()
    .references(() => guides.id, { onDelete: "cascade" }),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  markerType: markerTypeEnum("marker_type").notNull().default("waypoint"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  guideId: uuid("guide_id")
    .notNull()
    .references(() => guides.id, { onDelete: "cascade" }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type UserSelect = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
export type GuideSelect = InferSelectModel<typeof guides>;
export type GuideInsert = InferInsertModel<typeof guides>;
export type MarkerSelect = InferSelectModel<typeof markers>;
export type MarkerInsert = InferInsertModel<typeof markers>;
export type CommentSelect = InferSelectModel<typeof comments>;
export type CommentInsert = InferInsertModel<typeof comments>;
