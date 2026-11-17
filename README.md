# BEYNATION PORTFOLIO

A cinematic developer portfolio built with **React Native, Expo SDK 52 and Expo Router v4**. It runs on **Android (Expo Go)** and **Web (Netlify)**, and uses **Supabase** for content, login and the contact form.

The app works straight away with sample content. Supabase is optional until you want the admin dashboard and a saved contact form.

**Screens:** Home (3D hero, typewriter, marquee) · About · Projects (search, categories, detail pages with gallery) · Skills · Services · Contact (validated form, social links) · Admin dashboard (projects, skills, services, settings, messages).

---

## 1. Install the tools (Windows 11)

1. **Node.js 20 LTS**: download from https://nodejs.org and install with the default options.
2. **VS Code** (optional but handy): https://code.visualstudio.com
3. Open **PowerShell** and check:
   ```powershell
   node -v
   npm -v
   ```
   Both should print a version number.

## 2. Run the project

1. Unzip the project and open the folder in VS Code (File > Open Folder).
2. Open the terminal in VS Code (Ctrl + `) and run:
   ```powershell
   npm install
   npx expo start
   ```
   If PowerShell blocks scripts, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once and try again.
3. A QR code appears in the terminal.

### Test on Android with Expo Go
1. Install **Expo Go** on your phone. This project uses **SDK 52**. If the Play Store version of Expo Go says the project is incompatible, get the SDK 52 build from https://expo.dev/go.
2. Phone and PC must be on the **same Wi-Fi**. Open Expo Go and scan the QR code.
3. If it cannot connect (common on public or school Wi-Fi), stop the server and run:
   ```powershell
   npx expo start --tunnel
   ```
   Accept the prompt to install `@expo/ngrok`.
4. If something looks stale, run `npx expo start -c` to clear the cache.

### Test on the web
Press **w** in the terminal, or run `npx expo start --web`. It opens at http://localhost:8081.

---

## 3. Make it yours

- **Quickest:** edit `constants/data.js` (name, bio, projects, skills, services, social links). Save and the app reloads.
- **From the admin dashboard** (after step 4): everything is editable in the browser or the app.
- Colors and fonts live in `constants/theme.js`.

---

## 4. Set up Supabase (optional, needed for admin and saved messages)

1. Create a free project at https://supabase.com.
2. Open **SQL Editor > New query**, paste all of `supabase/schema.sql`, and click **Run**. This creates the tables, Row Level Security policies and sample data.
3. Go to **Authentication > Users > Add user** and create your admin account (email and password). Tick "Auto Confirm User".
4. Back in the SQL Editor, run this with your own email:
   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'you@example.com';
   ```
5. Go to **Project Settings > API** and copy the **Project URL** and the **anon public** key.
6. In the project folder, copy `.env.example` to `.env` and fill in:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
7. Restart with `npx expo start -c`. The badge at the top changes from **DEMO DATA** to **LIVE DATA**.
8. Open the admin dashboard: scroll to the footer and tap **Admin** (or go to `/admin` on web) and sign in.

### Security notes
- The **anon key is meant to be public**. What it can do is controlled by Row Level Security in `schema.sql`: visitors can read published content and send a contact message, nothing else.
- **Never** put the `service_role` key in this app or in `.env`.
- Admin rights come from the `admin_users` table, which cannot be changed through the API. The admin screens are also guarded in the app, but the database is the real lock.
- Contact messages are validated in the app and again by database constraints. They are displayed as plain text, never as HTML.
- `site_settings` is publicly readable. Do not store private values there.

---

## 5. Deploy the web version to Netlify

**Option A: drag and drop**
```powershell
npx expo export -p web
```
Open https://app.netlify.com/drop and drag the `dist` folder in.
Drag and drop does not read `netlify.toml`, so refreshing on a page like `/projects` may show "Page not found". Use Option B if you need that to work.

**Option B: connect GitHub (recommended)**
1. Push the project to GitHub (`.env` is already ignored).
2. In Netlify: **Add new site > Import an existing project**, pick the repo. The build command (`npx expo export -p web`) and publish folder (`dist`) are read from `netlify.toml`.
3. Under **Site configuration > Environment variables**, add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. Refreshing on any page works because `netlify.toml` redirects every path to `index.html`.

---

## Project structure

```
app/
  _layout.js            root: providers, gesture handler, stack
  +html.js              web page template
  (tabs)/               Home, About, Projects, Skills, Contact (bottom tabs)
  project/[id].js       project detail
  services.js           services list
  admin/                protected dashboard (guard in _layout.js)
components/             Hero3DScene, TypewriterText, Marquee, GlassCard, Button, ...
constants/theme.js      design tokens        constants/data.js  sample content
context/                ContentContext (data), AuthContext (login + admin check)
lib/                    supabase client, validation, links, responsive helpers
supabase/schema.sql     tables, RLS policies, seed data
```

## How the 3D hero works
`components/Hero3DScene.jsx` builds a glass cube from six planes, a counter-rotating inner cube, two orbit rings and orbiting nodes. One Reanimated shared value loops on the UI thread; each plane's 3D position, depth fade and light response are computed in a worklet and applied as ordinary `perspective`, `rotateX`, `rotateY` transforms, so it runs without touching the JavaScript thread and works on Android, iOS and web. Drag it with a finger or mouse.

## Troubleshooting
| Problem | Fix |
|---|---|
| Expo Go says "incompatible SDK" | Install the SDK 52 Expo Go from https://expo.dev/go |
| QR code opens but app never loads | Use `npx expo start --tunnel` |
| Red error about a missing module | Run `npm install`, then `npx expo start -c` |
| Admin says "No admin access" | Re-run step 4 with the email you signed in with |
| Messages do not save | Check `.env` values, then restart with `-c` |
| Netlify page is blank after refresh on `/projects` | Make sure `netlify.toml` is in the repo root |
