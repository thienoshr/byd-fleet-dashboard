# Replace these with your actual GitHub username and repository name
$GITHUB_USERNAME = "YOUR_USERNAME"
$REPO_NAME = "byd-fleet-dashboard"

# Add the remote repository
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main

Write-Host "✅ Code pushed to GitHub! Now go to https://vercel.com to deploy."

