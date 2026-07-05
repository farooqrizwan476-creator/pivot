"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Download, Edit2, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCoverLetter } from "@/actions/cover-letter";

export default function CoverLetterList({ coverLetters }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete cover letter");
    }
  };

  const handleDownload = (letter) => {
    try {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      
      const iframeDoc = iframe.contentWindow.document;
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Cover Letter - ${letter.jobTitle}</title>
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 40px; line-height: 1.6; color: #000; }
              h1 { border-bottom: 2px solid #ccc; padding-bottom: 10px; }
            </style>
          </head>
          <body>
            <h1>${letter.jobTitle} at ${letter.companyName}</h1>
            <pre style="white-space: pre-wrap; font-family: inherit;">${letter.content}</pre>
          </body>
        </html>
      `);
      iframeDoc.close();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  if (!coverLetters?.length) return <div className="text-center p-10">No cover letters found.</div>;

  return (
    <div className="space-y-4">
      {coverLetters.map((letter) => (
        <Card key={letter.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{letter.jobTitle} at {letter.companyName}</CardTitle>
              <CardDescription>{format(new Date(letter.createdAt), "PPP")}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" onClick={() => handleDownload(letter)}><Download className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" onClick={() => router.push(`/ai-cover-letter/${letter.id}`)}><Edit2 className="h-4 w-4" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(letter.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}