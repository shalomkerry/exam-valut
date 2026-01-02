CREATE TYPE "public"."ocr_status" AS ENUM('failed', 'pending', 'processing', 'compelted');--> statement-breakpoint
CREATE TABLE "departments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "departments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	CONSTRAINT "departments_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "edits" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "edits" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "edits_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "edits" ALTER COLUMN "content_before" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "edits" ALTER COLUMN "content_after" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "exam_images" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "exam_images" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "exam_images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "exam_images" ALTER COLUMN "extracted_text" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "exams" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "exams" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "exams_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "subjects" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "subjects" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "subjects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "exam_images" ADD COLUMN "page_number" integer;--> statement-breakpoint
ALTER TABLE "exam_images" ADD COLUMN "ocr_status" "ocr_status" DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "exams" ADD COLUMN "status" "edit_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "exams" ADD COLUMN "university" text DEFAULT 'aau';--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "department_id" integer;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;