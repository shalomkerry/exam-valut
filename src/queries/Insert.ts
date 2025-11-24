import { exams } from '@/db/data_schema';
import { db } from '../db';
import { InferInsertModel } from 'drizzle-orm';

export type Exam_Type = InferInsertModel<typeof exams>;

export async function insertExam(data:Exam_Type) {
const result= await db.insert(exams).values(data);
return result
}

