// app/api/users/route.ts
import { db } from '@/db';

export async function GET() {
  const result = await db.execute(`
    SELECT * FROM newTable
    where id='1'
    `);
  return Response.json(result);
}
