"use client"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, FileImage, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { PhotoUpload } from "@/actions/UploadImage"
import {Form_Data,Subjects} from '@/types/types'
import { toast } from "sonner"
type User = {
id:string,
role:string
}

interface UploadFormProps {
  subjects: Subjects[],
  user:User

}
export default function UploadForm({ subjects,user }: UploadFormProps) {
  const router = useRouter()
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const [isSubmitted, setIsSubmitted] = useState(false); // Loading state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<FileList|{}>({});

  const [formData, setFormData] = useState<Form_Data>({
    subject_id:1,
    title:'',
    year:'2025',
    type:'final',
    createdByUserId: user.id,
    status:'pending',
    imageURl:[]
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }
  const handleFileChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
      if (fileInputRef.current && fileInputRef.current.files) {
        const selectedFiles = fileInputRef.current.files;
        setImageFile(selectedFiles)

        await handleFileUpload(selectedFiles)
      }

    };


async function handleFileUpload(filesToUpload: FileList){
  if (Object.keys(files).length === 0) return; // Guard clause

  const newImageUrls: string[] = []; // Local array to hold results
  setIsSubmitting(true); // Set loading state

  try {
    for (const element of Object.values(filesToUpload)) {
      const result = await PhotoUpload(element);

      if (result.success) {
        console.log("Uploaded:", result.imageUrl);
        newImageUrls.push(result.imageUrl); // Push to local array
      }
    }

    // Update state ONE time after the loop finishes
    if (newImageUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        imageURl: [...prev.imageURl, ...newImageUrls],
      }));

      setPhotoUploaded(true);
      toast.success("Photos uploaded successfully!");
    }
  } catch (error) {
    console.log(error);
    toast.error("Failed to upload photos. Please try again.");
  } finally {
    if(fileInputRef.current && fileInputRef.current.value){
      fileInputRef.current.value = ''
    }
    setImageFile({}) 
    setIsSubmitted(true)
    setIsSubmitting(false); // Reset loading state
    
  }
}

  useEffect(()=>{
console.log(formData)
console.log(typeof(files))
  },[formData])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setUploadProgress("Creating exam record...")

    const form = new FormData(e.currentTarget)

    try {
      const examResponse = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: form.get("courseId"),
          title: form.get("title"),
          year: form.get("year"),
          type: form.get("examType"),
          createdByUserId:user.id,
          imageUrl:formData.imageURl
        }),
      })

      if (!examResponse.ok) {
        throw new Error("Failed to create exam record")
      }
      const { examId } = await examResponse.json()
      console.log(examId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setUploadProgress(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-4 text-xl font-semibold">Upload Successful!</h2>
        <p className="mt-2 text-muted-foreground">
          Your exam has been submitted for review. You'll be redirected shortly.
        </p>
      </div>
    )
  }

const handleChange = (e:any)=>{
 const {name,value} = e.target;
 setFormData((prev)=>({
  ...prev,
  [name]:value
}))
  }
  const handleTypeChange = (newTypeString:string)=>{
    handleChange({
      target:{
        name:'examType',
        value:newTypeString
      }
    })
  }
   const handleYearChange = (newYearValue:string)=>{
    handleChange({
      target:{
        name:'year',
        value:newYearValue
      }
    })
   }

  const handleSubjectChange = (selectedSubject:string)=>{
    handleChange({
      target:{
        name:'subject_id',
        value:Number(selectedSubject)
      }
    })
  }


  return (
    <div className="max-w-md m-auto w-[600px] px-12 py-3 rounded-md bg-slate-700">
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {/* Course Selection */}
      <div className="space-y-2">
        <Label htmlFor="courseId">Course</Label>
        <Select  onValueChange={handleSubjectChange} name='subject_id' required>
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
              {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year and Semester */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select name="year" onValueChange={handleYearChange} required>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      <div className="space-y-2">
        <Label htmlFor="examType">Exam Type</Label>
        <Select name="examType" onValueChange={handleTypeChange}required>
          <SelectTrigger>
            <SelectValue placeholder="Select exam type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="midterm">Midterm</SelectItem>
            <SelectItem value="Final">Final</SelectItem>
            <SelectItem value="Quiz">Quiz</SelectItem>
          </SelectContent>
        </Select>
      </div>
      </div>

      {/* Exam Type */}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input type="text" name="title" onChange={handleChange} value={formData.title} placeholder="AAU-PSYCHOLOGY-MID-2025" />
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>Exam Pages</Label>
        <div
          className={cn(
            "rounded-lg border-2 border-dashed p-8 text-center transition-colors",
            files.length > 0 ? "border-primary/50 bg-primary/5" : "hover:bg-muted",
          )}
        >
      <Input ref={fileInputRef} id="picture" type="file" multiple name='picture' onChange={handleFileChange} className="mb-4" />
          <label htmlFor="files" className="flex cursor-pointer flex-col items-center">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="mt-2 font-medium">Click to upload images</p>
            <p className="mt-1 text-sm text-muted-foreground">PNG, JPG up to 10MB each</p>
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border bg-card p-3">
                <div className="flex items-center gap-3">
                  <FileImage className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Page {index + 1} • {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isSubmitting || files.length === 0}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {uploadProgress || "Uploading..."}
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Exam ({files.length} page{files.length !== 1 ? "s" : ""})
          </>
        )}
      </Button>
    </form>

    </div>
  )
}
