-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create documents table
create table documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  file_path text not null,
  file_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create document_chunks table
create table document_chunks (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references documents on delete cascade not null,
  content text not null,
  chunk_index integer not null,
  embedding vector(1536),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create chat_sessions table
create table chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  document_id uuid references documents on delete cascade not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create chat_messages table
create table chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references chat_sessions on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table documents enable row level security;
alter table document_chunks enable row level security;
alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;

-- Create policies
-- Profiles policies
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Documents policies
create policy "Users can view own documents"
  on documents for select
  using (auth.uid() = user_id);

create policy "Users can create documents"
  on documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update own documents"
  on documents for update
  using (auth.uid() = user_id);

create policy "Users can delete own documents"
  on documents for delete
  using (auth.uid() = user_id);

-- Document chunks policies
create policy "Users can view chunks of owned documents"
  on document_chunks for select
  using (auth.uid() = (select user_id from documents where id = document_id));

-- Chat sessions policies
create policy "Users can view own chat sessions"
  on chat_sessions for select
  using (auth.uid() = user_id);

create policy "Users can create chat sessions"
  on chat_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own chat sessions"
  on chat_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete own chat sessions"
  on chat_sessions for delete
  using (auth.uid() = user_id);

-- Chat messages policies
create policy "Users can view messages from own chat sessions"
  on chat_messages for select
  using (auth.uid() = (select user_id from chat_sessions where id = session_id));

create policy "Users can create messages in own chat sessions"
  on chat_messages for insert
  with check (auth.uid() = (select user_id from chat_sessions where id = session_id));

-- Create triggers for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

create trigger update_documents_updated_at
  before update on documents
  for each row
  execute function update_updated_at_column();

create trigger update_chat_sessions_updated_at
  before update on chat_sessions
  for each row
  execute function update_updated_at_column();
