"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { supabase } from "@/services/supabase/client"

export function DocumentUpload() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    // Check file type
    const allowedTypes = ["application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, TXT, DOC, and DOCX files are supported")
      return
    }

    try {
      setIsUploading(true)

      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`
      const { error: uploadError, data } = await supabase.storage
        .from("documents")
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Create document record in database
      const { error: dbError } = await supabase
        .from("documents")
        .insert([
          {
            title: file.name,
            file_path: data.path,
            file_type: file.type,
          },
        ])

      if (dbError) throw dbError

      toast.success("Document uploaded successfully!")
      router.refresh()
    } catch (error) {
      toast.error("Failed to upload document. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12">
      <div className="flex flex-col items-center justify-center text-center">
        <Upload className="h-10 w-10 text-gray-400" />
        <div className="mt-4">
          <Button
            disabled={isUploading}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          PDF, TXT, DOC, DOCX up to 5MB
        </p>
      </div>
    </div>
  )
}
