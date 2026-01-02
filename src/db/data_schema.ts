import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';

import { user_role_enum } from './auth_schema';
import { relations } from 'drizzle-orm';

export const exam_type_enum  = pgEnum('exam_type',['final','midterm','quiz'])
export const edit_status_enum = pgEnum('edit_status', ['pending', 'approved', 'rejected']);
export const ocr_stauts_enum = pgEnum('ocr_status', ['failed', 'pending', 'processing','compelted']);


// --- Exams--

export const exams = pgTable('exams', {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  year: text('year').notNull(),
  type: exam_type_enum('type').notNull(),
  subject_id:integer('subject_id').notNull().references(()=>subjects.id),
  status: edit_status_enum('status').notNull().default('pending'),
  created_at:timestamp('created_at',{ withTimezone: false }).notNull().defaultNow(),
  createdByUserId: text('created_by_user_id').references(() => user.id),
  university:text('university').default('aau')
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


// --- Departments Table ---

export const departments = pgTable('departments',{
id:integer("id").primaryKey().generatedAlwaysAsIdentity(),
name: text('name').notNull().unique(),
image: text('image')
})

// --- Subjects Table ---
export const subjects = pgTable('subjects',{
id:integer("id").primaryKey().generatedAlwaysAsIdentity(),
title: text('title').notNull().unique(),
type: text('type').notNull(),
image: text('image').notNull(),
sub_code:text('sub_code').unique().notNull(),
departmentId:integer('departmentId').references(()=>departments.id,{onDelete:'cascade'}).notNull(),
})

// --- Exam Images Table ---
export const examImages = pgTable('exam_images', {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  exam_id:integer('exam_id').references(()=>exams.id,{onDelete:'cascade'}).notNull(),
  page_number:integer('page_number'),
  image_url: text('image_url'),
  extracted_text:text('extracted_text'),
  ocr_stauts:ocr_stauts_enum('ocr_status').default('pending'),

});

// --- Edit ---
export const edits = pgTable('edits', {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text('user_id').notNull().references(() => user.id),
  exam_image_id: integer('exam_image_id').notNull().references(() => examImages.id),
  content_before: text('content_before').notNull(),
  content_after: text('content_after').notNull(),
  status: edit_status_enum('status').notNull().default('pending'),
  approved_by_user_id: text('approved_by_user_id'), // .references(() => user.id),
  created_at: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  processed_at: timestamp('processed_at', { withTimezone: false }),
});

export const examsRelations = relations(exams, ({ many }) => ({
  images: many(examImages),
}));

export const examImagesRelations = relations(examImages, ({ one }) => ({
  exam: one(exams, {
    fields: [examImages.exam_id],
    references: [exams.id],
  }),
}));