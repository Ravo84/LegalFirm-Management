# Webertron Technologies - Company Website

A modern, responsive website for Webertron Technologies, an IT service company specializing in web development, digital marketing, and comprehensive technology solutions.

## Features

- **Modern Design**: Minimalist layout with bold typography and generous whitespace
- **Dark Mode**: Toggle between light and dark themes with persistent preference
- **AI-Powered Chatbot**: Interactive chatbot with CRUD functionality for managing conversations
- **Voice Search**: Web Speech API integration for voice-activated navigation
- **Responsive Design**: Mobile-first approach, fully responsive across all devices
- **Performance Optimized**: Fast loading times with optimized assets
- **Security**: SSL-ready with security headers and badges

## Tech Stack

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- Web Speech API
- LocalStorage for data persistence

## Project Structure

```
.
├── index.html          # Main HTML file
├── styles.css          # All styles and themes
├── script.js           # JavaScript functionality
├── vercel.json         # Vercel deployment configuration
└── README.md           # This file
```

## Deployment to Vercel

### Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Git installed on your computer
- Your website files ready

### Method 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to your project directory**:
   ```bash
   cd "D:\new website"
   ```

4. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - What's your project's name? `webertron-technologies` (or your preferred name)
   - In which directory is your code located? `./` (current directory)
   - Want to override the settings? **No**

5. **Your site will be live!** You'll get a URL like: `https://webertron-technologies.vercel.app`

6. **For production deployment**:
   ```bash
   vercel --prod
   ```

### Method 2: Deploy via GitHub Integration

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a GitHub repository**:
   - Go to [github.com](https://github.com) and create a new repository
   - Don't initialize with README, .gitignore, or license

3. **Push your code to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

4. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: **Other**
     - Root Directory: `./`
     - Build Command: (leave empty)
     - Output Directory: (leave empty)
   - Click "Deploy"

5. **Your site will be automatically deployed!**

### Method 3: Deploy via Vercel Dashboard (Drag & Drop)

1. **Prepare your files**:
   - Ensure all files (index.html, styles.css, script.js, vercel.json) are in the root directory

2. **Go to Vercel Dashboard**:
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"

3. **Upload files**:
   - Select "Deploy" tab
   - Drag and drop your project folder or zip file

4. **Configure and deploy**:
   - Project name: `webertron-technologies`
   - Framework Preset: **Other**
   - Click "Deploy"

## Custom Domain Setup (For Later)

Once you have a domain name:

1. **In Vercel Dashboard**:
   - Go to your project
   - Click "Settings" → "Domains"
   - Click "Add Domain"
   - Enter your domain name (e.g., `webertron.com`)

2. **Configure DNS**:
   - Vercel will provide DNS records
   - Add these records to your domain registrar:
     - Type: `A` or `CNAME`
     - Name: `@` or `www`
     - Value: Provided by Vercel

3. **Wait for propagation** (usually 24-48 hours)

4. **SSL Certificate**: Vercel automatically provisions SSL certificates for custom domains

## Local Development

To test the website locally:

1. **Using a simple HTTP server** (Python):
   ```bash
   python -m http.server 8000
   ```
   Then visit: `http://localhost:8000`

2. **Using Node.js http-server**:
   ```bash
   npx http-server
   ```

3. **Using VS Code Live Server extension**:
   - Install "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

## Features Documentation

### Dark Mode
- Toggle button in navigation bar
- Preference saved in localStorage
- Automatically applies on page load

### AI Chatbot
- Click the chat button in bottom-right corner
- Full CRUD functionality:
  - Create: Send new messages
  - Read: View conversation history
  - Update: Edit your messages
  - Delete: Remove messages or conversations
- All data persisted in localStorage

### Voice Search
- Click microphone icon in navigation
- Speak your query
- Automatically navigates to relevant sections

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lighthouse Score: 90+ (expected)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- All assets optimized for fast loading

## Security

- HTTPS enabled by default on Vercel
- Security headers configured in vercel.json
- XSS protection enabled
- Content Security Policy ready

## Support

For issues or questions:
- Email: info@webertron.com
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)

## License

© 2024 Webertron Technologies. All rights reserved.

