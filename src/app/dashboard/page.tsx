import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { DocumentUpload } from "@/components/features/document-upload"
import { DocumentCard } from "@/components/features/document-card"

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/signin")
  }

  // Fetch user's documents
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Your Study Materials</h1>
      </div>
      
      <div className="mt-8">
        <DocumentUpload />
      </div>

      <div className="mt-8">
        {documents && documents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id}
                title={doc.title}
                filePath={doc.file_path}
                fileType={doc.file_type}
                createdAt={doc.created_at}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No documents yet. Upload your first study material to get started!
          </p>
        )}
      </div>
    </div>
  )
}
