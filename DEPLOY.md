# Varo AI — Deployment Guide (Non-Developer)

Two goals covered here:
1. **Run it on your laptop** — for in-person demos
2. **Get a live link** — to send investors (deploy to Vercel, free)

---

## Part 1 — Get the Code onto Your Computer

### Step 1: Install the tools you need (one-time setup)

You need three things installed on your Mac or Windows machine.

**A. Node.js** (runs the app)
- Go to: https://nodejs.org
- Download the **LTS** version (the green button)
- Install it. Click through all the defaults.
- Verify: open Terminal (Mac) or Command Prompt (Windows), type `node -v` — you should see a version number like `v20.x.x`

**B. Git** (downloads your code)
- Mac: Git is likely already installed. Type `git --version` in Terminal to check.
- Windows: Download from https://git-scm.com and install with defaults.

**C. A code editor** (to edit your API key — that's all)
- Download VS Code: https://code.visualstudio.com (free)

---

### Step 2: Get the code

The code lives in a Git repository. You need to push it to GitHub first so you can download it to your own machine.

**Create a GitHub account** (if you don't have one): https://github.com

**Create a new repository on GitHub:**
1. Go to https://github.com/new
2. Name it `varo-ai` (or anything you like)
3. Keep it **Private**
4. Click **Create repository**
5. Copy the URL shown — it will look like: `https://github.com/YOUR-USERNAME/varo-ai.git`

**Push the code from the server to GitHub:**

In the Claude Code terminal, run these commands (replace the URL with yours):

```bash
git remote add github https://github.com/YOUR-USERNAME/varo-ai.git
git push github claude/add-claude-documentation-NAjgg:main
```

**Download the code to your laptop:**

Open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
git clone https://github.com/YOUR-USERNAME/varo-ai.git
cd varo-ai
```

---

## Part 2 — Get Your Anthropic API Key

This is what powers the AI. You need one API key.

1. Go to: https://console.anthropic.com
2. Sign up or log in
3. Click **API Keys** in the left menu
4. Click **Create Key** — name it "Varo AI"
5. Copy the key — it starts with `sk-ant-...`
6. **Save it somewhere safe** — you only see it once

**Add $5–10 credit** (required to make API calls):
- In the Anthropic console, go to **Billing** → **Add Credits**
- $10 covers hundreds of demo runs

---

## Part 3 — Run It on Your Laptop

Do this first to make sure everything works before deploying publicly.

### Step 1: Install dependencies

In Terminal, inside the `varo-ai` folder:

```bash
npm install
```

This downloads all the packages the app needs. Takes 1–2 minutes. You'll see a lot of output — that's normal.

### Step 2: Set up your API key

```bash
cp .env.local.example .env.local
```

Open the file `.env.local` in VS Code. Find this line:

```
ANTHROPIC_API_KEY=your_key_from_console.anthropic.com
```

Replace `your_key_from_console.anthropic.com` with your actual key:

```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxx
```

Save the file. Do not share this file or commit it to Git.

### Step 3: Start the app

```bash
npm run dev
```

You'll see output ending in something like:
```
✓ Ready in 2.1s
○ Local: http://localhost:3000
```

### Step 4: Open it

Open your browser and go to: **http://localhost:3000**

The app is running. To stop it, press `Ctrl + C` in Terminal.

**To demo:** Go to `/incidents/new`, click one of the three scenario buttons (Scenario 1, 2, or 3), then click **Analyse Alert →**.

---

## Part 4 — Deploy Publicly (Get a Shareable Link)

This puts the app on the internet so you can send a link to investors. Uses **Vercel** — free, no credit card needed, designed for Next.js apps.

### Step 1: Create a Vercel account

Go to: https://vercel.com
Click **Sign Up** → **Continue with GitHub** (use the same GitHub account as above)

### Step 2: Import your project

1. On the Vercel dashboard, click **Add New → Project**
2. Find `varo-ai` in the list and click **Import**
3. Leave all settings as defaults — Vercel detects Next.js automatically

### Step 3: Add your API key to Vercel

Before clicking Deploy, scroll down to **Environment Variables**:

| Name | Value |
|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-xxxxxxxxxxxx` (your real key) |
| `AI_PROVIDER` | `claude` |

Click **Add** after each one.

### Step 4: Deploy

Click **Deploy**. Vercel builds and deploys the app — takes about 2 minutes.

When it's done, you'll see a green checkmark and a URL like:
```
https://varo-ai-yourname.vercel.app
```

That's your live link. Share it with investors.

---

## Part 5 — Making Changes

If you need to update the app after deployment:

1. Make changes in Claude Code (as you've been doing)
2. Claude will commit and push to the branch
3. You push that branch to GitHub:
   ```bash
   git push github claude/add-claude-documentation-NAjgg:main --force
   ```
4. Vercel automatically re-deploys within 1–2 minutes

---

## Quick Reference

| Task | Command |
|---|---|
| Start app locally | `npm run dev` |
| Open in browser | http://localhost:3000 |
| Stop the app | Ctrl + C in Terminal |
| Your live URL | https://varo-ai-yourname.vercel.app |

---

## Troubleshooting

**"command not found: node"**
Node.js isn't installed or didn't install correctly. Re-download from https://nodejs.org and restart your Terminal after installing.

**"npm install" fails**
Make sure you're inside the `varo-ai` folder. Run `cd varo-ai` first.

**App loads but AI analysis fails**
Your API key is wrong or has no credit. Check the key in `.env.local` and add credit at https://console.anthropic.com/billing.

**Vercel deployment fails**
Check that you added the `ANTHROPIC_API_KEY` environment variable before deploying. You can add it after: go to your project on Vercel → Settings → Environment Variables → add it → Redeploy.

**"I changed something and it broke"**
Restart the dev server: press Ctrl + C, then run `npm run dev` again.
