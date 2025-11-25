import { db } from "@/db";
import { exams } from "@/db/data_schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {subject_id, title, year, type, createdByUserId} = await req.json()
    try{
        const inserted = db.insert(exams).values({
            subject_id, title, year, type, createdByUserId
        }).returning()

    }
    catch(e){
        if(e instanceof Error){
        return NextResponse.json({error:e.message},{status:400})
        }
        return NextResponse.json({error:"An unknown error occurred"},{status:400})
    }
}