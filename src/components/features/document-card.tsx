"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Trash2, ExternalLink } from "lucide-react"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/services/supabase/client"

interface DocumentCardProps {
  id: string
  title: string
  filePath: string
  fileType: string
  createdAt: string
}

export function DocumentCard({ id, title, filePath, fileType, createdAt }: DocumentCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([filePath])

      if (storageError) throw storageError

      // Delete document from database
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", id)

      if (dbError) throw dbError

      toast.success("Document deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete document")
    } finally {
      setIsDeleting(false)
    }
  }

  const getFileIcon = () => {
    switch (fileType) {
      case "application/pdf":
        return "📄"
      case "text/plain":
        return "📝"
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "📃"
      default:
        return "📄"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="group relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <span className="mr-2 text-2xl">{getFileIcon()}</span>
            <span className="truncate">{title}</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Added on {formatDate(createdAt)}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <iframe
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${filePath}`}
                className="h-[600px] w-full rounded-md border"
              />
            </div>
          </DialogContent>
        </Dialog>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/documents/${id}`)}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
