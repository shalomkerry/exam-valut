'use client'
import Header from "@/components/ui/comp/HeaderBack"
import UploadForm from "@/components/ui/comp/upload-form"
import {Subjects} from '@/types/types'

type User = {
id:string,
name:string,
role:string
}
interface UploadClientProps{
    user:User,
    subjects:Subjects[]
}

export default function UploadClient({user,subjects}:UploadClientProps){
    let userName = user.name
    return(
        <div className="">
        <Header user={userName[0]}/>
        <main className="mx-auto max-w-2xl px-4 py-8">
            <div className="mb-8 flex flex-col items-center">
            <h1 className="text-2xl font-bold">Upload Exam</h1>
            <p className="mt-2 text-muted-foreground text-center">
                Upload past exam papers to help fellow students. All uploads are reviewed before being published on the site.
            </p>
            </div>
        </main>
        <UploadForm subjects={subjects} user={user}/>
        </div>
    )
}