'use server'

import cloudinary from "@/app/api/cloudinary";
import { revalidatePath } from "next/cache";

export async function PhotoUpload(file:File){
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    try{
    const result:any = await new Promise((resolve,reject)=>{
      cloudinary.uploader.upload_stream({
        tags:'exam'
      },function(error,result){
        if( error ){
          reject(error)
          return 
        }
        resolve(result)
      }).end(buffer)
    });
      revalidatePath('/')
      return {
        success:true,
        imageUrl:result.secure_url,
        message:"Upload complete!"
      }
    }catch(error){
        console.error("Cloudinary upload failed")
       return{
        success:false,
        message:error 
       } 

    }
}