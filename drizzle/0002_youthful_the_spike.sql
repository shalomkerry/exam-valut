ALTER TABLE "subjects" DROP CONSTRAINT "subjects_department_id_departments_id_fk";
--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "departmentId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_departmentId_departments_id_fk" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" DROP COLUMN "department_id";