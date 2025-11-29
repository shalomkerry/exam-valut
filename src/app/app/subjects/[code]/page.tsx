
export default async function CoursePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params

return(
    <>{code}</>
)


}