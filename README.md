# VoteSphere — Online Voting System

A React + Vite academic demonstration project with Admin and Voter modules.

## Features
- User signup and login using browser Local Storage
- Seeded administrator account
- Role-based dashboard access
- Admin can add/remove candidates and open/close the election
- Voters can select a candidate and submit one vote per election
- Election totals and results view
- Responsive layout
- Vercel rewrite configuration for React Router

## Run locally
1. Install Node.js (LTS).
2. Extract this project and open its folder in Terminal.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite (usually http://localhost:5173).

## Demo administrator
- Email: `admin@vote.com`
- Password: `admin123`

Create a normal voter account using the Signup page.

## GitHub
Create a new GitHub repository, then run inside this project folder:

```bash
git init
git add .
git commit -m "Initial online voting system"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/online-voting-system.git
git push -u origin main
```

Replace the remote URL with your own repository URL.

## Vercel deployment
1. Push the project to GitHub.
2. Sign in at https://vercel.com and choose **Add New → Project**.
3. Import your repository.
4. Framework preset: **Vite**.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Click **Deploy**.

The included `vercel.json` handles client-side route refreshes.

## Important limitations
This is a frontend-only college demo. Local Storage is not secure authentication or a trustworthy election database: users can inspect/change browser data, passwords are stored in plain text, and data is not shared between devices. Do not use it for real elections. A production system needs a secure backend, database, verified identity, server-side authorization, audit logs and security review.
