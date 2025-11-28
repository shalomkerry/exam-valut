import { insertExam, insertExamImage } from "@/queries/Insert";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { subject_id, title, year, type, createdByUserId, imageURl } = await req.json();

    // Log the incoming payload
    console.log("Received payload:", { subject_id, title, year, type, createdByUserId, imageURl });

    const data = { subject_id, title, year, type, createdByUserId };
    try {
        const inserted = await insertExam(data);
        const newExamId = inserted;
        if(imageURl && imageURl.length>0){
    await Promise.all(imageURl.map((url:string,key:number)=>
        insertExamImage({exam_id:newExamId,image_url:url,page_number:key+1})
    ))}
        return NextResponse.json({ success: true, examId: newExamId });
    } catch (e) {
        if (e instanceof Error) {
            return NextResponse.json({ error: e.message }, { status: 400 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 400 });
    }
}
