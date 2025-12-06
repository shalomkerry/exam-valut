'use client'

import { ExamPageViewer } from "@/components/ui/comp/exam-page-viewer";

interface ImageType 
    {   id:number;
            exam_id:number,
            image_url:string,
            ocr_status:string,

            extracted_text:string,
            page_number:number
    }
type exam = {
    exam: {
        id: number;
        title: string;
        year: string;
        type: "final" | "midterm" | "quiz";
        subject_id: number;
        status: "pending" | "approved" | "rejected";
        created_at: Date;
        createdByUserId: string | null;
    };
    images:ImageType [
    ];
}

interface ExamListProp{
    exam:exam[]
}
export default function ExamClient({exam}:ExamListProp){
    const images = exam[0].images

return(
<>
<ExamPageViewer pages={exam[0].images} examTitle={exam[0].exam.title}/>
</>
) 
}