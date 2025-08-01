# 🚀 Deployment Guide

## Prerequisites
1. Node.js installed on your computer
2. Git installed
3. GitHub account
4. YouTube Data API key
5. Formspree or EmailJS account for contact form

## Setup Steps

### 1. Run the Setup
```bash
# On Windows, double-click setup.bat
# Or run manually:
node setup.js
```

### 2. Get YouTube API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key for setup

### 3. Get YouTube Channel ID
1. Go to your YouTube channel
2. Click "View channel source" or check the URL
3. Your Channel ID is in the URL or page source

### 4. Setup Contact Form

#### Option A: Formspree
1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Copy the form ID (e.g., "xpzgkqyw")

#### Option B: EmailJS
1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Create email service
3. Create email template
4. Get Service ID, Template ID, and Public Key

### 5. Deploy to GitHub Pages

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### 6. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click Settings → Pages
3. Under Source, select "Deploy from a branch"
4. Select "main" branch and "/ (root)"
5. Your site will be available at: `https://yourusername.github.io/your-repo-name/`

## Configuration Management

- Your settings are saved in `config.json`
- To update settings, run `node setup.js` again
- The setup will ask if you want to use existing config or create new
- You can manually edit `config.json` for quick changes

## Customization

- Edit `style.css` for visual customizations
- Modify `script.js` for functionality changes
- Update `index.html` for structure changes
- Add images to the `assets/` folder

## Troubleshooting

### YouTube Videos Not Loading
- Check your API key is correct
- Verify your Channel ID
- Ensure YouTube Data API v3 is enabled
- Check browser console for errors

### Contact Form Not Working
- Verify Formspree/EmailJS configuration
- Check form endpoint/service IDs
- Test with simple message first

### Styling Issues
- Check CSS file is linked correctly
- Verify color codes are valid hex values
- Test on different browsers