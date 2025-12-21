'use client'

import HeaderComponent from "@/components/ui/comp/header"

export default function UploadClient(){
    let user = 'Shalom'
    return(
        <div>
        <HeaderComponent user={user}/>
        <main className="mx-auto max-w-2xl px-4 py-8">
            <div className="mb-8">
            <h1 className="text-2xl font-bold">Upload Exam</h1>
            <p className="mt-2 text-muted-foreground">
                Upload past exam papers to help fellow students. All uploads are reviewed before being published on the site.
            </p>
            </div>
        </main>
        </div>
    )
}