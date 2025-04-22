create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text default 'client'
);
