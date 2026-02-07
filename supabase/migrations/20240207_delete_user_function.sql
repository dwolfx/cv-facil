-- Run this in the Supabase SQL Editor

-- 1. Create the function
create or replace function delete_own_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
begin
  -- Get the ID of the user executing the function
  current_user_id := auth.uid();
  
  -- Security check: ensure user is logged in
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- 1. Delete Resumes (Data cleanup)
  delete from public.resumes where user_id = current_user_id;

  -- 2. Delete Profile (Data cleanup)
  delete from public.profiles where id = current_user_id;

  -- 3. Delete Auth User (The account itself)
  delete from auth.users where id = current_user_id;
end;
$$;
