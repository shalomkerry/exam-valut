'use server'; 
import { db } from '@/db/index';
import { unstable_cache } from 'next/cache';
import { getHeapCodeStatistics } from 'v8';

const getCachedSubjects = unstable_cache(
  async ()=>{
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
const getCachedDepartments = unstable_cache(
  async()=>{
    return await db.query.departments.findMany()
  },['department-list'],
  {
    revalidate:3600,
    tags:['department']
  }
)
export async function loadDepartments(){
  const data =  getCachedDepartments()  
  return data 
}
export async function loadSubjects() {
  const data =  getCachedSubjects()  
  return data 
}

export async function loadExams(){
  const data =  getCachedExams()
  return data
}
