# Step-by-Step Deployment Guide for Vercel

This guide provides detailed instructions for deploying your Webertron Technologies website to Vercel.

## Quick Start (5 minutes)

### Option A: Using Vercel CLI (Fastest)

1. **Open Terminal/Command Prompt** in your project directory:
   ```bash
   cd "D:\new website"
   ```

2. **Install Vercel CLI** (one-time setup):
   ```bash
   npm install -g vercel
   ```
   If you don't have Node.js, download it from [nodejs.org](https://nodejs.org/)

3. **Login to Vercel**:
   ```bash
   vercel login
   ```
   This will open your browser to authenticate.

4. **Deploy**:
   ```bash
   vercel
   ```

5. **Follow the prompts**:
   - Set up and deploy? → Type `Y` and press Enter
   - Which scope? → Select your account (usually option 1)
   - Link to existing project? → Type `N` and press Enter
   - What's your project's name? → Type `webertron-technologies` and press Enter
   - In which directory is your code located? → Press Enter (uses current directory)
   - Want to override the settings? → Type `N` and press Enter

6. **Your site is live!** 
   - You'll see a URL like: `https://webertron-technologies-xxxxx.vercel.app`
   - Copy this URL and share it!

7. **For production** (optional):
   ```bash
   vercel --prod
   ```
   This assigns a cleaner URL: `https://webertron-technologies.vercel.app`

---

### Option B: Using GitHub (Recommended for Updates)

1. **Create GitHub Account** (if you don't have one):
   - Go to [github.com](https://github.com) and sign up

2. **Install Git** (if not installed):
   - Download from [git-scm.com](https://git-scm.com/downloads)
   - Install with default settings

3. **Initialize Git in your project**:
   ```bash
   cd "D:\new website"
   git init
   git add .
   git commit -m "Initial commit - Webertron Technologies website"
   ```

4. **Create GitHub Repository**:
   - Go to [github.com/new](https://github.com/new)
   - Repository name: `webertron-technologies`
   - Description: "Webertron Technologies company website"
   - Choose Public or Private
   - **DO NOT** check "Initialize with README"
   - Click "Create repository"

5. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/webertron-technologies.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

6. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "Add New Project"
   - Click "Import Git Repository"
   - Select your `webertron-technologies` repository
   - Click "Import"

7. **Configure Project**:
   - Project Name: `webertron-technologies` (or leave default)
   - Framework Preset: **Other**
   - Root Directory: `./` (leave as is)
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: (leave empty)
   - Click "Deploy"

8. **Wait for deployment** (usually 30-60 seconds)

9. **Your site is live!**
   - URL: `https://webertron-technologies.vercel.app`
   - Every time you push to GitHub, Vercel will automatically redeploy!

---

### Option C: Drag & Drop (No Git Required)

1. **Zip your project folder**:
   - Right-click on "new website" folder
   - Select "Send to" → "Compressed (zipped) folder"
   - Name it `webertron-technologies.zip`

2. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com) and sign up/login
   - Click "Add New Project"

3. **Upload**:
   - Look for "Deploy" or "Upload" option
   - Drag and drop your zip file OR click to browse and select it

4. **Configure**:
   - Project Name: `webertron-technologies`
   - Framework Preset: **Other**
   - Click "Deploy"

5. **Your site is live!**

---

## Post-Deployment Checklist

After deployment, verify everything works:

- [ ] Visit your live URL
- [ ] Test navigation (click all menu items)
- [ ] Test dark mode toggle
- [ ] Test chatbot (click chat button, send a message)
- [ ] Test voice search (if browser supports it)
- [ ] Test on mobile device (responsive design)
- [ ] Check that HTTPS is enabled (padlock icon in browser)
- [ ] Verify all images and styles load correctly

## Updating Your Site

### If using Vercel CLI:
```bash
# Make your changes to files
# Then redeploy:
vercel --prod
```

### If using GitHub:
```bash
# Make your changes
git add .
git commit -m "Update website"
git push
# Vercel automatically redeploys!
```

### If using Drag & Drop:
- Just upload the updated files again through Vercel dashboard

## Troubleshooting

### Issue: "Command not found: vercel"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/), then run `npm install -g vercel`

### Issue: "Permission denied" when pushing to GitHub
**Solution**: Make sure you're logged into GitHub. Try: `git config --global user.name "Your Name"` and `git config --global user.email "your.email@example.com"`

### Issue: Site shows 404 error
**Solution**: Make sure `index.html` is in the root directory and `vercel.json` is configured correctly

### Issue: Styles not loading
**Solution**: Check that `styles.css` is in the same directory as `index.html` and the path in HTML is correct

### Issue: Chatbot not working
**Solution**: Check browser console for errors. Make sure `script.js` is loaded and localStorage is enabled

## Getting Help

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- GitHub Issues: Create an issue in your repository

## Next Steps

1. **Custom Domain**: Once you have a domain, follow the custom domain setup in README.md
2. **Analytics**: Add Google Analytics or Vercel Analytics
3. **SEO**: Submit your sitemap to Google Search Console
4. **Backup**: Keep a backup of your files locally or in GitHub

---

**Congratulations! Your website is now live on the internet! 🎉**

