'use server'; 
import { db } from '@/db/index';
import { unstable_cache } from 'next/cache';

const getCachedSubjects = unstable_cache(
  async ()=>{
console.log('Fetching Subjects from DB')
return await db.query.subjects.findMany()
  },
  ['subjects-list'],
  {
    revalidate:3600,
    tags:['subjects']
  }
)


const getCachedExams = unstable_cache(
  async ()=>{
console.log('Fetching Subjects from DB')
return await db.query.exams.findMany()
  },
  ['exams-list'],
  {
    revalidate:3600,
    tags:['exams']
  }
)

export async function loadSubjects() {
  const data =  getCachedSubjects()  
  return data 
}

export async function loadExams(){
  const data =  getCachedExams()
  return data
}