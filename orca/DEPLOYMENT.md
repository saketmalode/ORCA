# 🚀 ORCA Deployment Guide (GitHub & Cloud Hosting)

This repository is **100% production-ready** for GitHub and automated cloud deployment.

---

## 📦 What Has Been Prepared

1. **`requirements.txt`**: Standard Python dependencies for FastAPI, Uvicorn, Shapely, HTTPX, and Pydantic.
2. **`Dockerfile`**: Multi-stage production container that builds the Vite React frontend and serves both Frontend and Backend together via FastAPI.
3. **`docker-compose.yml`**: One-command local or cloud container orchestration.
4. **`render.yaml`**: One-click deployment blueprint for [Render.com](https://render.com).
5. **`frontend/vercel.json`**: Static SPA configuration for [Vercel](https://vercel.com).
6. **`.github/workflows/ci.yml`**: GitHub Actions automated testing and container build workflow.
7. **Ready-to-Upload ZIP**: `orca-ready-for-github.zip` located in the parent folder.

---

## 🌐 Option 1: Upload Directly to GitHub

### Method A: Using GitHub Web (Drag & Drop)
1. Go to [GitHub.com](https://github.com) and create a new repository named `orca-marine-platform` (Public or Private).
2. Do **not** initialize with a README (keep it empty).
3. Extract `orca-ready-for-github.zip` on your computer.
4. Drag and drop the files from the extracted `orca/` folder into GitHub, or use the **"uploading an existing file"** link.
5. Commit changes to `main`.

### Method B: Using Git Command Line
In the `orca` folder:
```bash
git init
git add .
git commit -m "feat: initial commit of ORCA Marine Intelligence Platform"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/orca-marine-platform.git
git push -u origin main
```

---

## ☁️ Option 2: 1-Click Free Cloud Deployment (Render.com)

1. Sign in to [Render.com](https://render.com) (Free account).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository `orca-marine-platform`.
4. Render will automatically detect the **Dockerfile** or `render.yaml`.
5. Select the **Free** tier and click **Create Web Service**.
6. Your app will build and go live with an HTTPS URL (e.g., `https://orca-marine-platform.onrender.com`) serving both the interactive map frontend and the `/api` backend!

---

## 🐳 Option 3: Run Anywhere with Docker

To build and run the complete system locally or on any cloud VPS (AWS, DigitalOcean, GCP):
```bash
docker compose up --build
```
Then open:
* Frontend & App: `http://localhost:8000/`
* API Documentation: `http://localhost:8000/docs`
* Health Check: `http://localhost:8000/api/health`

---

## ⚡ Option 4: Deploy Frontend to Vercel

If you want to host the frontend on Vercel:
1. Connect the `orca/frontend` directory to Vercel.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. In `frontend/src/services/api.ts`, update `BASE_URLS` with your deployed backend URL.
