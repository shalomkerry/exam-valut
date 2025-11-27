'use server'
import { exams,examImages} from '@/db/data_schema';
import { db } from '../db';
import { InferInsertModel } from 'drizzle-orm';
import { Form_Data } from '@/types/types';
import { revalidatePath } from 'next/cache';

export type Exam_Type = InferInsertModel<typeof exams>;
export type Exam_Image_Type = InferInsertModel<typeof examImages>

export async function insertExam(data:Exam_Type) {
const [exam]= await db.insert(exams)
                       .values(data)
                       .returning();
return exam.id
}


export async function insertExamImage(data:Exam_Image_Type) {
const [exam]= await db.insert(examImages)
                       .values(data)
                       .returning();
return exam.id
}