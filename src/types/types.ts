export type Form_Data = {
    subject_id:number,
    title:string,
    year:string,
    type:"final"|"quiz"|"midterm",
    userId:string,
    imageURl:string[]
}

export type Subjects = {
  id: number;
  title: string;
  type:string;
  image:string,
  sub_code:string,
};