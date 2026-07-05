import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterEditor from "../_components/cover-letter-editor";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  // params ko await karna lazmi hai Next.js 15+ ke liye
  const { id } = await params;
  
  const letter = await getCoverLetter(id);
  
  if (!letter) {
    return notFound();
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 gradient-title">Edit {letter.jobTitle}</h1>
      <CoverLetterEditor id={id} initialContent={letter.content} />
    </div>
  );
}