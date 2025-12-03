# Deployment Instructions

## Step 1: Push to GitHub

After creating your GitHub repository, run these commands (replace `YOUR_USERNAME` and `YOUR_REPO_NAME`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign up/login (you can use your GitHub account)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and configure everything
5. Click "Deploy"
6. Wait 2-3 minutes for deployment
7. You'll get a public URL like: `https://your-project.vercel.app`

## That's it! Your site will be live and accessible to anyone with the URL.

