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
import {Form_Data} from '@/types/types'

    // subject_id:number,
    // title:string,
    // year:string,
    // type:"final"|"quiz"|"midterm",
    // userId:string,
    // imageURl:string[]
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
import {Subjects} from '@/types/types'
import { createExamAction } from "@/queries/Insert";
import { useActionState } from "react";

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
const [state,formAction] = useActionState(createExamAction,{
success: false, 
message: '',
examId:null,
})
useEffect(()=>{
    console.log(state)
console.log(state.examId)
},[state])

  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [arrayOfURL, setArrayOfURL] = useState<string[]>([])
//   const [fetchedExam, setFetchedExam] = useState(initialExams);
  const [subjectOptions, setSubjectOptions] = useState<subjectOptions[]>([])
  const [fetchedSubjects, setFetchedSubjects] = useState<Subjects[]>(initialSubjects);
  const [imageFile, setImageFile] = useState<FileList|{}>({});
  const [open, setOpen] = useState(false)
  const { data: session } = authClient.useSession();

  const role = session?.user.role
  const user_id = session?.user.id

  const [subjectLabel, setSubjectLabel] = useState("")

  const [formData, setFormData] = useState<Form_Data>({
    subject_id:0,
    title:'',
    year:'2015',
    type:'final',
    userId:user_id?user_id:'',
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
    return (
        <div className="w-full max-w-md m-auto mt-20">
        <Button onClick={()=>router.push('/app/dashboard')}>Home</Button>
        <FieldGroup>
        <FieldLegend>Image</FieldLegend>
         <Field>
         <div>
          <form action={formAction} className="w-full flex flex-col ">
      <Label htmlFor="picture">Picture</Label>
      <Input ref={fileInputRef} id="picture" type="file" multiple name='picture' onChange={handleFileChange} />
        <Button onClick={handleFileUpload}>Submit Photo</Button>

 <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {subjectLabel
            ? subjectOptions.find((subject) => subject.label === subjectLabel)?.label
            : "Select Subject"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full ">
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
                    setSubjectLabel(subjectLabel===currentValue?"":currentValue)
                    
                    setOpen(false)
                
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
    <Input type="text" name='title' placeholder="AAU-PSYCHOLOGY-MID-2025" value={formData.title} onChange={handleChange}/>
    <Input
          type="number"
          name="year"
          id="year"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  border-x-0  h-11 text-center text-sm text-white  block w-full py-2.5"
          placeholder="2025"
          value={formData.year}
          onChange={handleChange}
          min="2008"
          max="2030"
          required
        />
         <RadioGroup 
       value={formData.type} 
       onValueChange={(newValue) => {
        setFormData((prev) => ({
            ...prev,
            type: newValue  as "final"|"midterm"|"quiz"
        }));
    }}
    defaultValue="final"   
         >
      <div className="flex items-center gap-3">
        <RadioGroupItem value="final" id="r1"  />
        <Label htmlFor="r1">Final</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="midterm" id="r2" />
        <Label htmlFor="r2">Midterm</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="quiz"  id="r3" />
        <Label htmlFor="r3">Quiz</Label>
      </div>
    </RadioGroup>
        <Button type="submit" disabled={state.success}>Checking API</Button>
   {state.message && (
        <p className={cn("text-sm", state.success ? "text-green-600" : "text-red-600")}>
                {state.message}
        </p>
        )}
          </form>
    </div>

        </Field>
      </FieldGroup>

    </div>
    )
}
