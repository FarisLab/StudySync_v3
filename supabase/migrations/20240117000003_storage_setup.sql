-- Create storage bucket for documents
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false);

-- Allow users to upload files to the documents bucket
create policy "Users can upload documents"
on storage.objects for insert
with check (
  bucket_id = 'documents' and
  auth.role() = 'authenticated'
);

-- Allow users to read their own documents
create policy "Users can read own documents"
on storage.objects for select
using (
  bucket_id = 'documents' and
  auth.uid()::text = (storage.foldername(name))[1]
);
