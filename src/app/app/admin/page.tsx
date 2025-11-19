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
import { CldImage, } from 'next-cloudinary';


export default function AdminPage(){
  const router = useRouter()
  const [imageFile, setImageFile] = useState<File[]>([]);
  const { data: session } = authClient.useSession();
  const role = session?.user.role
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
if(e.target.files){
  setImageFile(Array.from(e.target.files))
}
  };


  useEffect(()=>{
console.log(imageFile)
  },[imageFile])
  const subjects = ['mechanics','bais','health']
  if(role !='admin'){
    return<>
   u not an admin 
    </>
  }
    return (
        <div className="w-full max-w-md m-auto mt-20">
        <Button onClick={()=>router.push('/app/dashboard')}>Home</Button>
        <FieldGroup>
        <FieldLegend>Image</FieldLegend>
         <Field>
         <div>
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" multiple onChange={handleFileChange} />
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

<CldImage
  width="500"
  height="500"
  src="https://res.cloudinary.com/dg7ncfozj/image/upload/v1763128046/psychology_jcqote.jpg"
  crop="fill"
  removeBackground
  sizes="100vw"
  alt="Description of my image"
/>
      </FieldGroup>
            </div>
    )
}

