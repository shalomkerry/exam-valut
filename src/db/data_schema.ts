import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  pgEnum,
  jsonb
} from 'drizzle-orm/pg-core';

import { user_role_enum } from './auth_schema';

export const exam_type_enum  = pgEnum('exam_type',['final','midterm','quiz'])
export const edit_status_enum = pgEnum('edit_status', ['pending', 'approved', 'rejected']);

// --- Exams--

export const exams = pgTable('exams', {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  year: text('year').notNull(),
  type: exam_type_enum('type').notNull(),
  subject_id:integer('subject_id').references(()=>subjects.id),
  created_at:timestamp('created_at',{ withTimezone: false }).notNull().defaultNow(),
  createdByUserId: text('created_by_user_id').references(() => user.id),
});

// --- User---
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role:user_role_enum('role').notNull().default('editor'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});


// --- Subjects Table ---
export const subjects = pgTable('subjects',{
id:integer("id").primaryKey().generatedAlwaysAsIdentity(),
title: text('title').notNull().unique(),
type: text('type').notNull(),
image: text('image').notNull(),
sub_code:text('sub_code').unique().notNull(),
})



// --- Exam Images Table ---
export const examImages = pgTable('exam_images', {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  exam_id:integer('exam_id').references(()=>exams.id,{onDelete:'cascade'}),
  image_url: text('image_url'),
  extracted_text:jsonb('extracted_text'),
});

// --- Edit ---
export const edits = pgTable('edits', {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  user_id: text('user_id').notNull().references(() => user.id),

  exam_image_id: integer('exam_image_id').notNull().references(() => examImages.id),
  content_before: jsonb('content_before').notNull(),

  content_after: jsonb('content_after').notNull(),

  status: edit_status_enum('status').notNull().default('pending'),

  approved_by_user_id: text('approved_by_user_id'), // .references(() => user.id),

  created_at: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),

  processed_at: timestamp('processed_at', { withTimezone: false }),
});