"use client"
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
export default function AdminPage(){
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [arrayOfURL, setArrayOfURL] = useState<string[]>([])
  const [fetchedExam, setFetchedExam] = useState<Awaited<ReturnType<typeof loadExams>>>([]);
  const [subjectOptions, setSubjectOptions] = useState<subjectOptions[]>([])
  const [fetchedSubjects, setFetchedSubjects] = useState<Awaited<ReturnType<typeof loadSubjects>>>([]);
  const [imageFile, setImageFile] = useState<FileList|{}>({});
  const [open, setOpen] = useState(false)
  const [subjectValue, setSubjectValue] = useState("")
  const { data: session } = authClient.useSession();
  const role = session?.user.role

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

  useEffect(() => {
    // redirect to signin if not authenticated
    const fetchSubjects = async () => {

      try {
  const exams = await loadExams() ;
  setFetchedExam(exams)
  const subjects = await loadSubjects() ;
  setFetchedSubjects(subjects)
      } catch (err) {
        console.error(err);
        alert("Couldn't load subjects");
      } finally {

        
      }
    };
   fetchSubjects() 
  }, [session, router]);

  useEffect(()=>{
  },[exams])
  if(role !='admin'){
    return<>
   u not an admin 
    </>

  }

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
          {subjectValue
            ? subjectOptions.find((subject) => subject.value === subjectValue)?.label
            : "Select framework..."}
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
                  value={subject.value}
                  onSelect={(currentValue) => {
                    setSubjectValue(currentValue === subjectValue ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {subject.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      subjectValue === subject.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
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




 

