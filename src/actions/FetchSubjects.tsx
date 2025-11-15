// src/actions/subjectActions.ts
'use server'; // This directive ensures the file is ONLY run on the server

import { db } from '@/db/index';

export async function loadSubjects() {
  return db.query.subjects.findMany();
}