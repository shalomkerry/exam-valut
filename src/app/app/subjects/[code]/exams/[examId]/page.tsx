export default function Page({ params }: { params: { subjectId: string } }) {
  console.log("Subject ID:", params.subjectId) // should NOT be undefined

  return <div>Preview page for subject {params.subjectId}</div>;
}