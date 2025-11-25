'use server'
import { exams } from '@/db/data_schema';
import { db } from '../db';
import { InferInsertModel } from 'drizzle-orm';
import { Form_Data } from '@/types/types';
import { revalidatePath } from 'next/cache';

export type Exam_Type = InferInsertModel<typeof exams>;

export async function insertExam(data:Exam_Type) {
const [exam]= await db.insert(exams)
                       .values(data)
                       .returning();
return exam.id
}

