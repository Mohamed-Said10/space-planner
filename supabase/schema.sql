-- Create profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text default 'client',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table profiles enable row level security;

-- RLS Policies
create policy "Users can view their profile" 
  on profiles for select 
  using (auth.uid() = id);

create policy "Users can insert their profile" 
  on profiles for insert 
  with check (auth.uid() = id);

create policy "Users can update their profile" 
  on profiles for update 
  using (auth.uid() = id);
