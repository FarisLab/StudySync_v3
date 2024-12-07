-- Set up URL secret
select vault.create_secret(
    'http://api.supabase.internal:8000',
    'supabase_url'
);

-- Create a test user for local development
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- A fixed UUID for testing
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    'authenticated'
);
