import { insertExam } from "@/queries/Insert";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest){
    const {subject_id, title, year, type, createdByUserId} = await req.json()
    const data = {subject_id,title,year,type,createdByUserId}
    try{
        const inserted = await insertExam(data)
        return NextResponse.json({project:inserted})
    }
    catch(e){
        if(e instanceof Error){
        return NextResponse.json({error:e.message},{status:400})
        }
        return NextResponse.json({error:"An unknown error occurred"},{status:400})
    }
}
