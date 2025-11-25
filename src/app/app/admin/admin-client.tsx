'use client'
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import {  useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhotoUpload } from "@/actions/UploadImage";
import { Check, ChevronsUpDown } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {Form_Data,Exam_Data,Subjects} from '@/types/types'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  
} from "@/components/ui/field"
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

//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   title: text('title').notNull(),
//   year: text('year').notNull(),
//   type: exam_type_enum('type').notNull(),
//   subject_id:integer('subject_id').references(()=>subjects.id),
//   created_at:timestamp('created_at',{ withTimezone: false }).notNull().defaultNow(),
//   createdByUserId: text('created_by_user_id').references(() => user.id),

type subjectOptions = {
  value:string,
  label:string
}

interface AdminClientProps{
    initialSubjects:Subjects[]
}


export default function AdminClient({initialSubjects}:AdminClientProps){

  
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [arrayOfURL, setArrayOfURL] = useState<string[]>([])
//   const [fetchedExam, setFetchedExam] = useState(initialExams);
  const [subjectOptions, setSubjectOptions] = useState<subjectOptions[]>([])
  const [fetchedSubjects, setFetchedSubjects] = useState<Subjects[]>(initialSubjects);
  const [imageFile, setImageFile] = useState<FileList|{}>({});
  const [open, setOpen] = useState(false)
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: session } = authClient.useSession();

  const role = session?.user.role
  const user_id = session?.user.id as string

  const [subjectLabel, setSubjectLabel] = useState("")

  const [formData, setFormData] = useState<Form_Data>({
    subject_id:0,
    title:'',
    year:'2015',
    type:'final',
    createdByUserId:user_id,
    imageURl:[]
  })

const handleChange = (e:any)=>{
console.log(e.target.value)
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
if(Object.keys(imageFile).length!=0){
        for(const element of Object.values(imageFile)){
          try{
          const result = await PhotoUpload(element) 
          if(result.success){
            console.log(result.message)
            console.log(result.imageUrl)
            setArrayOfURL(prevArray=>[...prevArray,result.imageUrl])

          }

    setFormData((previous)=>({ 
        ...previous,
       imageURl:[
        ...previous.imageURl,
        result.imageUrl] 
    }
))
    setPhotoUploaded(true)
          }catch(error){
            console.log(error)
          }
        }
}else{
        console.log(
          'hey'
        )
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
        console.log(formData)
    const {subject_id,title,year,type,createdByUserId} = formData
    const exam_form = {subject_id, title, year, type, createdByUserId}
        const response = await fetch(`/api/exams`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify(exam_form)
        })

        if(!response.ok){
          throw new Error("failed to write project")
        }
        const id = await response.json()
        console.log(id)
       toast('Successfully added') 
      }catch(error){
        if(error instanceof Error){
          console.log(`Error ${error.message}`)
        }

      }
      
    }
    return (
        <div className="w-full max-w-md m-auto mt-20 space-y-6">
        <Button onClick={()=>router.push('/app/dashboard')}>Home</Button>
        <FieldGroup>
        <FieldLegend>Image</FieldLegend>
         <Field>
         <div>
          <form action={handleFormSubmit} className="w-full flex flex-col space-y-4">
      <Label htmlFor="picture">Picture</Label>
      <Input ref={fileInputRef} id="picture" type="file" multiple name='picture' onChange={handleFileChange} className="mb-4" />
        <Button onClick={handleFileUpload} className="mb-4">Submit Photo</Button>

 <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between mb-4"
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
    <Label htmlFor="year">Year</Label>
    <Input
          type="number"
          name="year"
          id="year"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-x-0 h-11 text-center text-sm text-white block w-full py-2.5 mb-4"
          placeholder="2025"
          value={formData.year}
          onChange={handleChange}
          min="2008"
          max="2030"
          required
        />

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

<Button type="submit" className="mt-6">Submit</Button>
</form>
    </div>

        </Field>
      </FieldGroup>

    </div>
    )
}
