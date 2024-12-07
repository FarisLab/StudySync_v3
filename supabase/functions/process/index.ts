// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from '@supabase/supabase-js';
import { processMarkdown } from '../lib/markdown-parser.ts';

// These are automatically injected
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

Deno.serve(async (req) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
      JSON.stringify({
        error: 'Missing environment variables.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Get the authorization header from the request
  const authorization = req.headers.get('Authorization');
  
  if (!authorization) {
    return new Response(
      JSON.stringify({ error: 'No authorization header passed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Create Supabase client with inherited permissions
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        authorization,
      },
    },
    auth: {
      persistSession: false,
    },
  });

  // Get document_id from request body
  const { document_id } = await req.json();

  // Query the document with its storage path
  const { data: document } = await supabase
    .from('documents_with_storage_path')
    .select()
    .eq('id', document_id)
    .single();

  if (!document?.storage_object_path) {
    return new Response(
      JSON.stringify({ error: 'Failed to find uploaded document' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Download the file from storage
  const { data: file } = await supabase.storage
    .from('files')
    .download(document.storage_object_path);

  if (!file) {
    return new Response(
      JSON.stringify({ error: 'Failed to download storage object' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const fileContent = await file.text();

  // Process the markdown content
  const processedMd = processMarkdown(fileContent);

  // Insert the processed sections into the database
  const { error } = await supabase.from('document_sections').insert(
    processedMd.sections.map(({ content }) => ({
      document_id,
      content,
    }))
  );

  if (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to save document sections' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  console.log(
    `Saved ${processedMd.sections.length} sections for file '${document.name}'`
  );

  // Return success response
  return new Response(null, {
    status: 204,
    headers: { 'Content-Type': 'application/json' },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/process' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
