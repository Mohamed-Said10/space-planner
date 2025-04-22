import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function setup() {
  const sql = `
    create table if not exists profiles (
      id uuid primary key references auth.users(id) on delete cascade,
      role text default 'client'
    );

    create or replace function public.handle_new_user()
    returns trigger as $$
    begin
      insert into public.profiles (id, role)
      values (new.id, 'client');
      return new;
    end;
    $$ language plpgsql security definer;

    drop trigger if exists on_auth_user_created on auth.users;

    create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute procedure public.handle_new_user();
  `;

  const { error } = await supabase.rpc('sql', { sql });

  if (error) {
    console.error('Error setting up schema:', error);
  } else {
    console.log('Schema setup successfully!');
  }
}

setup();
