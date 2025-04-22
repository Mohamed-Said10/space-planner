-- supabase/migrations/user_roles_view.sql

create or replace view users_view as
select
  auth.users.id,
  auth.users.email,
  profiles.role
from auth.users
left join profiles on profiles.id = auth.users.id;
