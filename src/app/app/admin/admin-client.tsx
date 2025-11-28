'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import {  useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhotoUpload } from "@/actions/UploadImage";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {Form_Data,Subjects} from '@/types/types'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"


type subjectOptions = {
  value:string,
  label:string
}

interface AdminClientProps {
  initialSubjects: Subjects[];
  user: { id: string; role: string }; // Added `user` property
}

export default function AdminClient({ initialSubjects, user }: AdminClientProps){

  
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [arrayOfURL, setArrayOfURL] = useState<string[]>([])
  const [subjectOptions, setSubjectOptions] = useState<subjectOptions[]>([])
  const [fetchedSubjects, setFetchedSubjects] = useState<Subjects[]>(initialSubjects);
  const [imageFile, setImageFile] = useState<FileList|{}>({});
  const [open, setOpen] = useState(false)
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const [isSubmitted, setIsSubmitted] = useState(false); // Loading state
  const [numberOfUploaded,setNumUploaded] = useState(0)

  const user_id = user.id; // Use `user.id` from props

  const [subjectLabel, setSubjectLabel] = useState("")

  const [formData, setFormData] = useState<Form_Data>({
    subject_id:1,
    title:'',
    year:'2025',
    type:'final',
    createdByUserId: user_id,
    status:'approved',
    imageURl:[]
  })

const handleChange = (e:any)=>{
 const {name,value} = e.target;
 setFormData((prev)=>({
  ...prev,
  [name]:value
}))
  }

useEffect(()=>{
        let subjectCombo:subjectOptions[]=[] 
        fetchedSubjects.map((x)=>{
          subjectCombo.push(
            {
              value:x.id.toString(),
              label:x.title
            }
          )
        })
    setSubjectOptions(subjectCombo)
},[fetchedSubjects])


    useEffect(()=>{
        if(Object.keys(subjectOptions).length!=0){
const find = subjectOptions.find((subject)=>subject.label==subjectLabel)?.value
setFormData((previous)=>({
    ...previous,
    subject_id:Number(find)    
}))
        }
    },[subjectLabel])

    useEffect(()=>{
console.log(formData)
    },[formData])

//   if(role !='admin'){ return<>
//    u not an admin 
//     </>

//   }

async function handleFileUpload() {
  if (Object.keys(imageFile).length === 0) return; // Guard clause

  const newImageUrls: string[] = []; // Local array to hold results
  setIsSubmitting(true); // Set loading state

  try {
    for (const element of Object.values(imageFile)) {
      const result = await PhotoUpload(element);

      if (result.success) {
        console.log("Uploaded:", result.imageUrl);
        newImageUrls.push(result.imageUrl); // Push to local array
        setNumUploaded(newImageUrls.length)
      }
    }

    // Update state ONE time after the loop finishes
    if (newImageUrls.length > 0) {
      setArrayOfURL((prev) => [...prev, ...newImageUrls]);

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
    if(fileInputRef.current){
    fileInputRef.current.value='' 
    }
    setImageFile({}) 
    setIsSubmitted(true)
    setIsSubmitting(false); // Reset loading state
    
  }
}

  const handleFileChange = () => {
      if (fileInputRef.current && fileInputRef.current.files) {
        const selectedFiles = fileInputRef.current.files;
        setImageFile(selectedFiles)
      }
    };

    const handleFormSubmit = async ()=>{
      try{
      const {subject_id,title,year,type,createdByUserId,imageURl} = formData
      const exam_form = {subject_id, title, year, type, createdByUserId,imageURl}
        const examResponse = await fetch(`/api/exams`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify(exam_form)
        })

        if(!examResponse.ok){
          throw new Error("failed to write project")
        }
        const examId = await examResponse.json()

      // const ocrResponse = await fetch("/api/ocr", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ examId }),
      // })
      
      // if(!ocrResponse.ok){
      //   throw new Error('Failed to extract ocr')
      // }
      
       toast('Successfully added') 

       resetAllData()
      }catch(error){
        if(error instanceof Error){
          console.log(`Error ${error.message}`)
        }

      }
      
    }

   function resetAllData(){
    setFormData({
    subject_id:0,
    title:'',
    year:'2015',
    type:'final',
    createdByUserId:user_id,
    status:'approved',
    imageURl:[]
    })
    setPhotoUploaded(false)

   } 

   const handleYearChange = (newYearValue:string)=>{
    handleChange({
      target:{
        name:'year',
        value:newYearValue
      }
    })
   }
    return (
        <div className="w-full max-w-md m-auto mt-20 space-y-6">
        <Button onClick={()=>router.push('/app/dashboard')}>Home</Button>
         <div>
          <form onSubmit ={(e)=>{e.preventDefault();handleFormSubmit()}} className="w-full flex flex-col space-y-4">
      <Label htmlFor="picture">Picture</Label>
      <Input ref={fileInputRef} id="picture" type="file" multiple name='picture' onChange={handleFileChange} className="mb-4" />

        <Button
        type='button'
    onClick={handleFileUpload}
    className="mb-4"
    disabled={isSubmitting || isSubmitted || Object.keys(imageFile).length === 0} // Disable if no files, submitting, or already submitted
  >
    {isSubmitting ? (
      <>
        <Loader2 className="animate-spin mr-2" /> Uploading... {numberOfUploaded}/{Object.keys(imageFile).length}
      </>
    ) : (
      "Upload Photo"
    )}
  </Button>
<div className="flex flex-wrap gap-2 mt-4">
      {formData.imageURl.map((url, index) => (
        <div key={index} className="w-16 h-16 border rounded overflow-hidden">
          <img src={url} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
 <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between mb-4"
          type='button'
        >
          {subjectLabel
            ? subjectOptions.find((subject) => subject.label === subjectLabel)?.label
            : "Select Subject"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Command>
          <CommandInput placeholder="Search subject..." className="h-9 outline-none" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {subjectOptions.map((subject) => (
                <CommandItem
                  key={subject.value}
                  value={subject.label}
                  onSelect={(currentValue) => {
                    setSubjectLabel(subjectLabel === currentValue ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {subject.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      subjectLabel === subject.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>

    <Label htmlFor="title">Title</Label>
    <Input id="title" type="text" name='title' placeholder="AAU-PSYCHOLOGY-MID-2025" value={formData.title} onChange={handleChange} className="mb-4" />

 <div className="space-y-2 flex flex-row gap-10 conetent-end  justify-center">
    <div className="">
            <Label htmlFor="year">Year</Label>
            <Select name="year" value={formData.year} onValueChange={handleYearChange}required>
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
    <div className="">

<Label className="mt-2 font-medium">Exam Type</Label>
<RadioGroup
  value={formData.type}
  onValueChange={(newValue) => {
    setFormData((prev) => ({
      ...prev,
      type: newValue as "final" | "midterm" | "quiz",
    }));
  }}
  defaultValue="final"
  className="space-y-2"
>
  <div className="flex items-center gap-3">
    <RadioGroupItem value="final" id="r1" />
    <Label htmlFor="r1">Final</Label>
  </div>
  <div className="flex items-center gap-3">
    <RadioGroupItem value="midterm" id="r2" />
    <Label htmlFor="r2">Midterm</Label>
  </div>
  <div className="flex items-center gap-3">
    <RadioGroupItem value="quiz" id="r3" />
    <Label htmlFor="r3">Quiz</Label>
  </div>
</RadioGroup>
    </div>

        </div>

<Button disabled={!photoUploaded}  type="submit" className="mt-6">Submit</Button>
</form>
    </div>

{/* Display uploaded images */}
    </div>
    )
}
