# 🚀 Trippr AI: Production Deployment Guide (100% Free Tier Stack)

This guide provides a comprehensive, step-by-step walkthrough to deploy the **Trippr AI: Multi-Agent Travel Orchestrator** online for free. 

We will deploy a highly performant, production-ready stack using the following architecture:
*   **Frontend**: [Vercel](https://vercel.com) (Next.js native host, free hobby plan)
*   **Backend**: [Render](https://render.com) (free Python service) OR [Hugging Face Spaces](https://huggingface.co/spaces) (free Docker space, runs 24/7 **without sleeping**)
*   **State Persistence**: Graceful fallback to **In-Memory checkpointer** (zero-setup, zero-cost) OR a free [Aiven MySQL](https://aiven.io) cloud database.

---

## 🛠️ Step 1: Push Your Code to GitHub

All modern free hosting platforms integrate directly with GitHub to trigger automatic builds when you push updates.

1. Create a new repository on [GitHub](https://github.com) (can be Public or Private).
2. Open your terminal in the root of the project directory and run:
   ```bash
   git init
   git add .
   git commit -m "chore: make codebase deployment ready"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## 💾 Step 2: Database Provisioning (Optional)

Trippr AI automatically falls back to **MemorySaver** (in-memory) if no database URL is set. If you want persistent history across backend restarts, set up a free MySQL instance on **Aiven**:

1. Sign up for a free account at [Aiven.io](https://aiven.io/).
2. Click **Create Service**, select **MySQL**, and choose the **Free** tier (under the pricing options).
3. Select your preferred cloud region (e.g., AWS, GCP, or DigitalOcean - choose one close to you).
4. Once the service is running, navigate to the service dashboard and find your **Service URI**.
5. The URI will look like:
   ```
   mysql://avnadmin:password@mysql-xxxxx.aivencloud.com:port/defaultdb?ssl-mode=REQUIRED
   ```
6. Replace the schema prefix from `mysql://` to `mysql+pymysql://` (if using SSL verification libraries) or just pass it as:
   ```
   mysql://avnadmin:password@mysql-xxxxx.aivencloud.com:port/defaultdb
   ```
   *(Trippr's `PyMySQLSaver` will parse this connection string automatically)*.

---

## 🧠 Step 3: Deploy the FastAPI Backend

You have two excellent, free hosting options for your Python FastAPI backend:

### Option A: Hugging Face Spaces (Recommended - No Sleep / Runs 24/7)
Unlike Render's free tier (which goes to sleep after 15 minutes of inactivity), Hugging Face Spaces provides free containers that run **24/7 without sleeping** as long as they are set to Public.

1. Go to [Hugging Face](https://huggingface.co/) and sign up / log in.
2. Click on your profile picture in the top right and click **New Space**.
3. Configure your Space:
   *   **Space Name**: `trippr-backend` (or custom name)
   *   **License**: `mit`
   *   **SDK**: **Docker** (Select the **Blank** template)
   *   **Space Hardware**: `CPU basic • 2 vCPU • 16 GB • Free`
   *   **Visibility**: **Public** (required to run 24/7 for free)
4. In your GitHub repository, create a file named `Dockerfile` in the root folder with the following contents:
   ```dockerfile
   FROM python:3.10-slim

   WORKDIR /code

   COPY ./requirements.txt /code/requirements.txt
   RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

   COPY . /code

   EXPOSE 7860

   CMD ["uvicorn", "backend.api:api", "--host", "0.0.0.0", "--port", "7860"]
   ```
5. Commit and push the `Dockerfile` to GitHub.
6. Back on your Hugging Face Space page, navigate to **Settings**, scroll down to **Variables and Secrets**, and click **New Secret** to add your keys:
   *   `GROQ_API_KEY`: *Your Groq API key*
   *   `TAVILY_API_KEY`: *Your Tavily Search API key*
   *   `AVIATIONSTACK_API_KEY`: *Your AviationStack API key*
   *   `DATABASE_URL`: *Your Aiven MySQL URI (Optional - omit for In-Memory mode)*
   *   `ALLOWED_ORIGINS`: `https://YOUR-FRONTEND-URL.vercel.app` (You will set this after deploying your frontend in Step 4, or set it to `*` temporarily)
7. Connect your GitHub repository to Hugging Face or clone the space's Git remote and push your code directly to HF to build and deploy!

---

### Option B: Render Web Services (Standard Hosting - Auto-Sleeps)
Render compiles and deploys Python backend services directly from Git, but goes to sleep after 15 minutes of quiet time.

1. Sign up/Log in to [Render](https://render.com).
2. Click **New +** in the dashboard and select **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   *   **Name**: `trippr-backend`
   *   **Language**: `Python`
   *   **Region**: Select a region close to your database/users.
   *   **Branch**: `main`
   *   **Root Directory**: Leave blank (root of the repo)
   *   **Build Command**: `pip install -r requirements.txt`
   *   **Start Command**: `python -m uvicorn backend.api:api --host 0.0.0.0 --port $PORT`
   *   **Instance Type**: `Free` ($0/month)
5. Expand the **Advanced** section and click **Add Environment Variable** to add:
   *   `GROQ_API_KEY`: *Your Groq API key*
   *   `TAVILY_API_KEY`: *Your Tavily Search API key*
   *   `AVIATIONSTACK_API_KEY`: *Your AviationStack API key*
   *   `DATABASE_URL`: *Your Aiven MySQL URI (Optional - omit for In-Memory)*
   *   `ALLOWED_ORIGINS`: `https://YOUR-FRONTEND-URL.vercel.app` *(update this after Step 4)*
6. Click **Deploy Web Service**.
7. Note down your backend URL (e.g. `https://trippr-backend.onrender.com`).

---

## ✈️ Step 4: Deploy the Next.js Frontend on Vercel

Vercel is the ultimate host for Next.js web applications, offering instantaneous deployments, automated SSL, and high performance for free.

1. Sign up/Log in to [Vercel](https://vercel.com).
2. Click **Add New** and select **Project**.
3. Import your GitHub repository.
4. In the **Configure Project** window:
   *   **Framework Preset**: Select `Next.js` (detected automatically)
   *   **Root Directory**: Select `frontend-nextjs` (Click **Edit** next to Root Directory, select `frontend-nextjs`, and click **Continue**).
5. Expand the **Environment Variables** accordion and add:
   *   `NEXT_PUBLIC_API_BASE_URL`: *Your Backend URL from Hugging Face or Render* (e.g., `https://xxxxxx.hf.space` or `https://trippr-backend.onrender.com`)
6. Click **Deploy**!
7. Once finished, Vercel will give you a live production URL (e.g., `https://trippr-frontend.vercel.app`).

---

## 🔒 Step 5: Post-Deployment Sync (CORS Setup)

For your browser to allow the Vercel site to talk to the backend, they must align on CORS origins:

1. Copy your Vercel deployment URL (e.g. `https://trippr-frontend.vercel.app`).
2. Go to your backend host dashboard (Render or Hugging Face Space).
3. Navigate to **Environment Variables / Secrets** and update the `ALLOWED_ORIGINS` key to your Vercel URL:
   *   **Key**: `ALLOWED_ORIGINS`
   *   **Value**: `https://trippr-frontend.vercel.app` (or comma-separated URLs if you have multiple)
4. Save the changes. The backend will automatically reboot with the secure CORS configuration.

---

## 🎯 Verification & Health Check

You can verify that your production systems are up, running, and communicating by loading:
```
https://YOUR-BACKEND-URL.com/api/health
```
If it returns `{"status": "ok", "agents": 4}`, your backend is healthy! Load your Vercel URL, and start orchestrating AI travel plans globally for free!
