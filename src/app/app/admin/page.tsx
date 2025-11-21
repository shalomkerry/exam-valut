"use client"

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
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select,SelectTrigger, SelectValue,SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import cloudinary from "@/app/api/cloudinary";
import { PhotoUpload } from "@/actions/UploadImage";

export default function AdminPage(){
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [arrayOfURL, setArrayOfURL] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<FileList|{}>({});
  const { data: session } = authClient.useSession();
  const subjects = ['mechanics','bais','health']
  const role = session?.user.role
useEffect(()=>{
console.log(arrayOfURL)

},[arrayOfURL])
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
        // console.log(selectedFiles)
        // Object.keys(selectedFiles).forEach(element=>console.log(element))
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
          <form action={handleFileUpload}>
      <Label htmlFor="picture">Picture</Label>
      <Input ref={fileInputRef} id="picture" type="file" multiple name='picture' onChange={handleFileChange} />


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


