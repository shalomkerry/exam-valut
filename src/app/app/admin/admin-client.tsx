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

import { loadExams, loadSubjects } from "@/actions/FetchSubjects";
import { exams, subjects } from "@/db/data_schema";

type subjectOptions = {
  value:string,
  label:string

}

type Subjects = {
  id: number;
  title: string;
  type:string;
  image:string,
  sub_code:string,
};
export default function AdminClient({initialSubjects,initialExams}:any){
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [arrayOfURL, setArrayOfURL] = useState<string[]>([])
  const [fetchedExam, setFetchedExam] = useState(initialExams);
  const [subjectOptions, setSubjectOptions] = useState<subjectOptions[]>([])
  const [fetchedSubjects, setFetchedSubjects] = useState<Subjects[]>(initialSubjects);
  const [imageFile, setImageFile] = useState<FileList|{}>({});
  const [open, setOpen] = useState(false)
  const { data: session } = authClient.useSession();
  const role = session?.user.role

  const [subjectLabel, setSubjectLabel] = useState("")

  const [formData, setFormData] = useState({
    subjectID:0,
    title:'',
    year:'',
    type:'',
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
const find = subjectOptions.find((subject)=>subject.label==subjectLabel)?.value
console.log(find)

setFormData((prev)=>({
    ...prev,
    find

}))
console.log(formData)
    },[subjectLabel])
//   if(role !='admin'){ return<>
//    u not an admin 
//     </>

//   }

  async function handleFileUpload() {

        for(const element of Object.values(imageFile)){
          try{
          const result = await PhotoUpload(element) 
          if(result.success){
            console.log(result.message)
            console.log(result.imageUrl)
            setArrayOfURL(prevArray=>[...prevArray,result.imageUrl])
          }
          }catch(error){
            console.log(error)
          }
        }
        console.log(
          'hey'
        )
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
          <form action={handleFileUpload} className="w-full flex flex-col ">
      <Label htmlFor="picture">Picture</Label>
      <Input ref={fileInputRef} id="picture" type="file" multiple name='picture' onChange={handleFileChange} />


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
    <Input type="text" placeholder="AAU-PSYCHOLOGY-MID-2025" value={formData.title} onChange={handleChange}/>
        <Button type="submit">Checking API</Button>
          </form>
    </div>
        </Field>
        {/* <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose department" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject)=>
            <SelectItem value={`${subject}`}>{subject}</SelectItem> 
            )}
          </SelectContent>
        </Select> */}
      </FieldGroup>
            </div>
    )
}
