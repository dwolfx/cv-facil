-- ==============================================================================
-- SECURITY HARDENING SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR
-- ==============================================================================

-- 1. PROTECT PLAN_TIER
-- Prevent users from updating their own plan_tier. Only service_role (backend/stripe) can do it.

create or replace function public.prevent_plan_update()
returns trigger
language plpgsql
security definer
as $$
begin
  -- If the user is trying to change the plan_tier
  if new.plan_tier is distinct from old.plan_tier then
    -- Allow if the executing role is 'service_role' (used by webhooks/admin)
    if auth.role() = 'service_role' then
      return new;
    end if;

    -- Otherwise, raise an error
    raise exception 'You are not allowed to update the plan_tier directly.';
  end if;

  return new;
end;
$$;

-- Drop trigger if exists to avoid conflicts
drop trigger if exists on_profile_plan_update on public.profiles;

-- Create Trigger
create trigger on_profile_plan_update
  before update on public.profiles
  for each row
  execute procedure public.prevent_plan_update();


-- 2. ENFORCE RESUME LIMITS
-- Prevent 'free' users from creating more than 1 resume.

create or replace function public.enforce_resume_limit()
returns trigger
language plpgsql
security definer
as $$
declare
  user_plan text;
  current_count integer;
  max_resumes integer;
begin
  -- Get the user's plan
  select plan_tier into user_plan
  from public.profiles
  where id = auth.uid();

  -- Default to free if no profile found (safe fallback)
  if user_plan is null then
    user_plan := 'free';
  end if;

  -- Define limits (Logic must match your frontend hooks/useUserPlan.js)
  if user_plan = 'free' then
    max_resumes := 2;
  else
    max_resumes := 999; -- Premium limit
  end if;

  -- Count existing resumes for this user
  select count(*) into current_count
  from public.resumes
  where user_id = auth.uid();

  -- Check limit
  if current_count >= max_resumes then
    raise exception 'Você chegou no limite do plano gratúito. Faça upgrade para criar mais currículos.';
  end if;

  return new;
end;
$$;

-- Drop trigger if exists
drop trigger if exists on_resume_insert_limit on public.resumes;

-- Create Trigger
create trigger on_resume_insert_limit
  before insert on public.resumes
  for each row
  execute procedure public.enforce_resume_limit();

-- Done!
