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


export async function createExamAction(prev:any, formData:FormData){

const rawType = formData.get('type')?.toString();
  const validTypes = ["final", "quiz", "midterm"];
  // Default to 'quiz' or throw an error if the value is invalid
  const safeType = validTypes.includes(rawType || '') 
    ? (rawType as "final" | "quiz" | "midterm") 
    : "quiz"; 

  // 3. Create the object with real runtime conversions
  const rawData: Form_Data = {
    // CONVERT: Number() turns the string "5" into 5. 
    // If it's null/empty, we default to 0.
    subject_id: Number(formData.get('subject_id') ?? 0),

    // TEXT: Use ?.toString() to handle nulls safely, default to empty string
    title: formData.get('title')?.toString() ?? '',
    
    year: formData.get('year')?.toString() ?? '',

    // UNION: Use our safe variable from step 2
    type: safeType,

    userId: formData.get('userId')?.toString() ?? '',

    // ARRAY: formData.get() only gets ONE value. 
    // Use .getAll() to get an array of all inputs named 'imageURL'.
    // Map ensures we get strings, not File objects.
    imageURl: formData.getAll('imageURL').map((item) => item.toString()),
  };
       try{
       const id =   await insertExam(rawData)
        revalidatePath('/app/admin')
        return {success:true,message:'Exam created',examId:id}
    }catch(e){
        return {success:false,message:`${e}`,examId:null}
    }

}