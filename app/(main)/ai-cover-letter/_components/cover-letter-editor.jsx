"use client";

import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { updateCoverLetter } from "@/actions/cover-letter";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CoverLetterEditor({ id, initialContent }) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateCoverLetter(id, content);
      toast.success("Cover letter updated successfully!");
      router.push("/ai-cover-letter");
    } catch (e) {
      toast.error("Failed to update cover letter");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div data-color-mode="light">
        <MDEditor value={content} onChange={setContent} height={500} />
      </div>
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}