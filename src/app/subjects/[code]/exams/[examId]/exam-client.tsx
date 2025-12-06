'use client'
interface ImageType 
    {   id:number;
            exam_id:number,
            image_url:string,
            ocr_status:string,
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
<h1>{exam[0].exam.title}</h1>
{images.map((x:any,index)=>(
    <div key={index} className="">
    <img src={x.image_url} alt="" />
    </div>
))}
</>
) 
}