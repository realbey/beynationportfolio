-- =====================================================================
-- BEYNATION PORTFOLIO: Supabase schema, Row Level Security and seed data
-- Run this whole file once in Supabase: SQL Editor > New query > Run.
-- It is safe to run again (uses IF NOT EXISTS / DROP POLICY IF EXISTS).
-- =====================================================================

-- ---------- helper: who is an admin? ----------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- SECURITY DEFINER lets policies check admin status without exposing the table.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Admins may read only their own row (the app uses this to decide which screen to show).
-- Nobody can insert/update/delete admin_users through the API. Add admins in the SQL editor.
drop policy if exists "admin_users: read own row" on public.admin_users;
create policy "admin_users: read own row"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- projects ----------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  title       text not null check (char_length(title) between 1 and 120),
  tagline     text not null default '' check (char_length(tagline) <= 200),
  description text not null default '' check (char_length(description) <= 8000),
  category    text not null default 'General' check (char_length(category) between 1 and 60),
  tags        text[] not null default '{}',
  highlights  text[] not null default '{}',
  images      jsonb  not null default '[]'::jsonb,   -- list of https image URLs
  github_url  text not null default '' check (github_url = '' or github_url ~* '^https?://'),
  demo_url    text not null default '' check (demo_url   = '' or demo_url   ~* '^https?://'),
  featured    boolean not null default false,
  published   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- skills ----------
create table if not exists public.skills (
  id         uuid primary key default gen_random_uuid(),
  category   text not null check (char_length(category) between 1 and 60),
  name       text not null check (char_length(name) between 1 and 60),
  level      integer not null default 50 check (level between 0 and 100),
  icon       text not null default 'code-slash' check (char_length(icon) <= 60),
  visible    boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- services ----------
create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  icon        text not null default 'sparkles' check (char_length(icon) <= 60),
  features    text[] not null default '{}',
  visible     boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- site_settings (key / value) ----------
create table if not exists public.site_settings (
  key        text primary key check (char_length(key) between 1 and 60),
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------- contact_submissions ----------
create table if not exists public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(btrim(name))    between 2 and 80),
  email      text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'),
  subject    text not null check (char_length(btrim(subject)) between 3 and 120),
  message    text not null check (char_length(btrim(message)) between 10 and 2000),
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_idx on public.contact_submissions (created_at desc);
create index if not exists projects_sort_idx on public.projects (sort_order, created_at desc);
create index if not exists skills_sort_idx   on public.skills (sort_order);
create index if not exists services_sort_idx on public.services (sort_order);

-- ---------- triggers ----------
drop trigger if exists projects_updated on public.projects;
create trigger projects_updated before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists skills_updated on public.skills;
create trigger skills_updated before update on public.skills
  for each row execute function public.set_updated_at();

drop trigger if exists services_updated on public.services;
create trigger services_updated before update on public.services
  for each row execute function public.set_updated_at();

drop trigger if exists settings_updated on public.site_settings;
create trigger settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY
-- Rule of thumb:
--   * visitors (anon) can READ published content and INSERT a contact message. Nothing else.
--   * admins (rows in admin_users) can do everything on content tables and read/manage messages.
-- =====================================================================
alter table public.projects            enable row level security;
alter table public.skills              enable row level security;
alter table public.services            enable row level security;
alter table public.site_settings       enable row level security;
alter table public.contact_submissions enable row level security;

-- projects
drop policy if exists "projects: public read published" on public.projects;
create policy "projects: public read published"
  on public.projects for select
  to anon, authenticated
  using (published = true or public.is_admin());

drop policy if exists "projects: admin write" on public.projects;
create policy "projects: admin write"
  on public.projects for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- skills
drop policy if exists "skills: public read visible" on public.skills;
create policy "skills: public read visible"
  on public.skills for select
  to anon, authenticated
  using (visible = true or public.is_admin());

drop policy if exists "skills: admin write" on public.skills;
create policy "skills: admin write"
  on public.skills for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- services
drop policy if exists "services: public read visible" on public.services;
create policy "services: public read visible"
  on public.services for select
  to anon, authenticated
  using (visible = true or public.is_admin());

drop policy if exists "services: admin write" on public.services;
create policy "services: admin write"
  on public.services for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- site_settings (public read: contains only content meant for the public site. Never store secrets here.)
drop policy if exists "settings: public read" on public.site_settings;
create policy "settings: public read"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "settings: admin write" on public.site_settings;
create policy "settings: admin write"
  on public.site_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- contact_submissions
-- Visitors can only INSERT, and only an unread message (they cannot mark it read or pre-set fields).
drop policy if exists "contact: anyone can submit" on public.contact_submissions;
create policy "contact: anyone can submit"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (is_read = false);

drop policy if exists "contact: admin read" on public.contact_submissions;
create policy "contact: admin read"
  on public.contact_submissions for select
  to authenticated
  using (public.is_admin());

drop policy if exists "contact: admin update" on public.contact_submissions;
create policy "contact: admin update"
  on public.contact_submissions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "contact: admin delete" on public.contact_submissions;
create policy "contact: admin delete"
  on public.contact_submissions for delete
  to authenticated
  using (public.is_admin());

-- ---------- table privileges (RLS still applies on top of these) ----------
revoke all on public.projects, public.skills, public.services, public.site_settings,
              public.contact_submissions, public.admin_users from anon, authenticated;

grant select on public.projects, public.skills, public.services, public.site_settings to anon, authenticated;
grant insert on public.contact_submissions to anon, authenticated;
grant select on public.admin_users to authenticated;
grant insert, update, delete on public.projects, public.skills, public.services, public.site_settings to authenticated;
grant select, update, delete on public.contact_submissions to authenticated;

-- =====================================================================
-- SEED DATA (sample content: edit it later in the admin dashboard)
-- =====================================================================
insert into public.projects (slug, title, tagline, description, category, tags, highlights, github_url, featured, sort_order)
values
  ('school-management-system', 'School Management System',
   'Students, teachers, fees and results in one place.',
   E'A system for running the daily work of a school: enrolling students, assigning teachers to classes, recording attendance and exam marks, and tracking fee payments.\n\nBuilt as a mobile-first app with role-based access, so administrators, teachers and parents each see only what they should.',
   'Education', array['React Native','Expo','Supabase','PostgreSQL'],
   array['Student and teacher records','Class and subject management','Fee tracking with payment history','Exam results and report cards','Role-based access for admin, teacher and parent'],
   'https://github.com/your-username/school-management-system', true, 1),
  ('stationery-management-system', 'Stationery Management System',
   'Stock, sales and suppliers for a stationery shop.',
   E'A point-of-sale and inventory app for a small stationery shop. The owner can add products, record sales, see what is running low and review daily takings.\n\nDesigned to work well on a phone behind the counter, with large tap targets and quick search.',
   'Business', array['React Native','Expo','Supabase','Reports'],
   array['Product catalogue with categories and prices','Quick sales entry and receipts','Low-stock alerts','Supplier and purchase records','Daily and monthly sales summaries'],
   'https://github.com/your-username/stationery-management-system', true, 2),
  ('efootball-gamers-system', 'eFootball Gamers System',
   'Players, fixtures, tables and tournament results.',
   E'A community app for eFootball players. Organisers can register players, generate fixtures, record match results and publish league tables and rankings.\n\nPlayers get a simple profile with their match history and stats.',
   'Gaming', array['React Native','Expo','Supabase','Realtime'],
   array['Player registration and profiles','Fixture generation for leagues and knockouts','Live league table and rankings','Match history and player stats','Organiser dashboard for results'],
   'https://github.com/your-username/efootball-gamers-system', true, 3)
on conflict (slug) do nothing;

insert into public.skills (category, name, level, icon, sort_order)
select * from (values
  ('Frontend','HTML5',90,'logo-html5',1),
  ('Frontend','CSS3',85,'logo-css3',2),
  ('Frontend','JavaScript',80,'logo-javascript',3),
  ('Mobile','React Native',78,'logo-react',4),
  ('Mobile','Expo',80,'phone-portrait',5),
  ('Mobile','Expo Router',72,'git-network',6),
  ('Backend & Data','Supabase',72,'server',7),
  ('Backend & Data','PostgreSQL',66,'server',8),
  ('Backend & Data','REST APIs',68,'cloud-upload',9),
  ('Tools','Git & GitHub',76,'logo-github',10),
  ('Tools','VS Code',88,'code-slash',11),
  ('Tools','Netlify',70,'rocket',12)
) as v(category, name, level, icon, sort_order)
where not exists (select 1 from public.skills);

insert into public.services (title, description, icon, features, sort_order)
select * from (values
  ('Website Development','Fast, responsive websites for businesses, schools and personal brands.','globe',
     array['Mobile-first design','Contact forms and social links','Deployed on Netlify','Basic SEO setup'],1),
  ('Mobile App Development','Android-ready apps built with React Native and Expo, with smooth animation.','phone-portrait',
     array['Clean navigation','Offline-friendly screens','Push-ready architecture','Play Store guidance'],2),
  ('Portfolio Creation','A portfolio that shows your work clearly and looks like you took it seriously.','color-palette',
     array['Custom visual style','Project showcase pages','Easy to update','Works on phone and desktop'],3),
  ('Database-Backed Apps','Management systems with logins, roles and reports, powered by Supabase.','server',
     array['Schema design','Row-level security','Admin dashboards','Backups and migration help'],4)
) as v(title, description, icon, features, sort_order)
where not exists (select 1 from public.services);

insert into public.site_settings (key, value) values
  ('brand', '"BEYNATION"'),
  ('owner_name', '"Your Name"'),
  ('role', '"Full-Stack & Mobile Developer"'),
  ('social_email', '"hello@yourname.dev"')
on conflict (key) do nothing;

-- =====================================================================
-- MAKE YOURSELF AN ADMIN (run AFTER you create your user in Authentication > Users)
-- Replace the email, then run just this statement:
--
--   insert into public.admin_users (user_id)
--   select id from auth.users where email = 'you@example.com';
-- =====================================================================
