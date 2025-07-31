# 🎥 Personal Creator Website – Complete Setup Guide

## 📌 Overview

Welcome to your **Personal Creator Website**! This is a complete, professional website solution designed specifically for content creators, YouTubers, streamers, and online personalities. No coding experience required!

### What This Website Does:
- **Automatically displays your latest YouTube videos** using YouTube's official API
- **Showcases your merchandise** from any online store (Teespring, Shopify, Etsy, etc.)
- **Links to all your social media** with beautiful, clickable icons
- **Provides a working contact form** so fans can reach you directly
- **Hosts for FREE** on GitHub Pages with your own custom web address
- **Works perfectly on mobile** and all devices
- **Updates automatically** when you upload new content
- **Shows your YouTube playlists** organized by category

### Perfect For:
- YouTubers and content creators
- Twitch streamers and gamers
- Artists and musicians
- Podcasters and influencers
- Small business owners
- Anyone wanting a professional online presence

---

## ✅ Core Features

| Feature                | Description                                                                 |
|----------------------- |-----------------------------------------------------------------------------|
| 🎬 **YouTube Integration** | Automatically fetches and displays your latest videos and playlists |
| 👕 **Merchandise Store** | Showcase products from Teespring, Shopify, Etsy, or any online store |
| 📱 **Social Media Hub** | Beautiful icons linking to Instagram, Twitter, TikTok, Discord, etc. |
| 📬 **Contact Form** | Professional contact form that sends emails directly to your inbox |
| 🎨 **Custom Styling** | Choose your brand colors, fonts, and visual style |
| 📱 **Mobile Responsive** | Looks perfect on phones, tablets, and computers |
| 🌐 **Free Hosting** | Deploy to GitHub Pages completely free with custom domain support |
| ⚡ **Fast Loading** | Optimized for speed and search engines |

---

## 🧰 Technology Stack

| Component   | Technology                       | Purpose                          |
|-------------|----------------------------------|----------------------------------|
| Frontend    | HTML5, CSS3, JavaScript ES6     | Modern, responsive website       |
| API         | YouTube Data API v3              | Fetch videos and playlists       |
| Forms       | Formspree or EmailJS             | Handle contact form submissions  |
| Hosting     | GitHub Pages                     | Free, reliable web hosting       |
| Icons       | Font Awesome 6                   | Beautiful social media icons    |
| Styling     | CSS Grid & Flexbox              | Professional, responsive layout  |

---

## 🚀 Quick Start Guide (For Complete Beginners)

### Step 1: Install Node.js (Required)

**What is Node.js?** Node.js is a free program that allows your computer to run the setup script for this website. Think of it like installing a special app that helps create your website.

#### For Windows Users:
1. **Download Node.js:**
   - Go to [nodejs.org](https://nodejs.org/)
   - Click the **"LTS"** version (recommended for most users)
   - This will download a file like `node-v20.x.x-x64.msi`

2. **Install Node.js:**
   - Double-click the downloaded file
   - Click "Next" through all the installation steps
   - **Important:** Make sure "Add to PATH" is checked (it usually is by default)
   - Click "Install" and wait for it to finish
   - Restart your computer when done

3. **Verify Installation:**
   - Press `Windows Key + R`
   - Type `cmd` and press Enter
   - In the black window that opens, type: `node --version`
   - You should see something like `v20.x.x` - this means it worked!

#### For Mac Users:
1. **Download Node.js:**
   - Go to [nodejs.org](https://nodejs.org/)
   - Click the **"LTS"** version
   - This downloads a `.pkg` file

2. **Install Node.js:**
   - Double-click the downloaded `.pkg` file
   - Follow the installation wizard
   - Enter your Mac password when prompted

3. **Verify Installation:**
   - Press `Cmd + Space` and type "Terminal"
   - In Terminal, type: `node --version`
   - You should see the version number

### Step 2: Set Up Your Website

1. **Download this project:**
   - Click the green "Code" button on this GitHub page
   - Select "Download ZIP"
   - Extract the ZIP file to your Desktop

2. **Open the project folder:**
   - Navigate to the extracted folder
   - You should see files like `setup.js`, `index.html`, etc.

3. **Install dependencies:**
   - **Windows:** Right-click in the folder and select "Open PowerShell window here" or "Open command window here"
   - **Mac:** Right-click and select "New Terminal at Folder"
   - Type this command and press Enter:
   ```bash
   npm install -y
   ```
   - Wait for it to finish (you'll see some text scrolling)

4. **Run the setup:**
   - In the same command window, type:
   ```bash
   node setup.js
   ```
   - Follow the prompts to enter your information

---

## 🧱 Project Structure

After setup, your website will have these files:

```
your-website/
│
├── index.html                    # Your main website page
├── style.css                     # All the visual styling and colors
├── script.js                     # Makes your website interactive
├── config.json                   # Stores all your personal settings
├── assets/                       # Folder for images and media
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions auto-deployment
├── SETUP-GUIDE.md                # Detailed setup instructions
└── README.md                     # This file you're reading now
```

---

## 🎬 YouTube Integration Setup (Step-by-Step)

### What is the YouTube Data API?
The YouTube Data API is a free service from Google that allows your website to automatically fetch information about your YouTube channel, including your latest videos and playlists. Think of it as a bridge that connects your website to your YouTube channel.

### Why do you need an API key?
An API key is like a special password that tells YouTube "this website is allowed to access this channel's information." It's completely free and takes about 5 minutes to set up.

### 🔧 Getting Your YouTube API Key (Detailed Steps):

#### Step 1: Create a Google Cloud Project
1. **Go to Google Cloud Console:**
   - Visit [console.cloud.google.com](https://console.cloud.google.com/)
   - Sign in with your Google account (the same one you use for YouTube)

2. **Create a New Project:**
   - Click the project dropdown at the top (it might say "Select a project")
   - Click "New Project"
   - **Project Name:** Enter something like "My Website" or "[Your Channel Name] Website"
   - Click "Create" and wait a few seconds

#### Step 2: Enable YouTube Data API
1. **Find the API Library:**
   - In the left sidebar, click "APIs & Services" → "Library"
   - In the search box, type "YouTube Data API v3"
   - Click on "YouTube Data API v3" from the results

2. **Enable the API:**
   - Click the blue "Enable" button
   - Wait for it to enable (usually takes 10-30 seconds)

#### Step 3: Create Your API Key
1. **Go to Credentials:**
   - In the left sidebar, click "APIs & Services" → "Credentials"
   - Click "+ Create Credentials" at the top
   - Select "API Key"

2. **Copy Your API Key:**
   - A popup will show your new API key (it looks like: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - **IMPORTANT:** Copy this key and save it somewhere safe
   - Click "Close"

#### Step 4: Find Your YouTube Channel ID
1. **Go to Your YouTube Channel:**
   - Visit [youtube.com](https://youtube.com) and sign in
   - Click your profile picture → "Your Channel"

2. **Get Your Channel ID:**
   - Look at the URL in your browser
   - **If it looks like:** `youtube.com/@yourhandle` - this is your handle
   - **If it looks like:** `youtube.com/channel/UCxxxxxxxxxxxxxxxxxxxxx` - the part after `/channel/` is your Channel ID
   - **If you have a handle (@yourhandle):** You can find your Channel ID by:
     - Going to your channel page
     - Right-clicking and selecting "View Page Source"
     - Pressing Ctrl+F (or Cmd+F on Mac) and searching for "channelId"
     - Look for something like `"channelId":"UCxxxxxxxxxxxxxxxxxxxxx"`

#### Step 5: Test Your Setup
During the website setup, you'll enter:
- **API Key:** The long string you copied (starts with `AIzaSy`)
- **Channel ID:** Usually starts with `UC` followed by letters and numbers
- **Max Videos:** How many recent videos to show (recommended: 6-12)

### 🎥 What Your Website Will Show:
- **Latest Videos:** Your most recent uploads, automatically updated
- **Video Thumbnails:** Clickable previews that open the full video
- **Video Titles:** Automatically pulled from YouTube
- **Upload Dates:** When each video was published
- **Playlists:** Your organized video collections displayed below videos

---

## 👕 Merchandise Integration (Sell Your Products!)

### What is Merchandise Integration?
This feature allows you to showcase and sell your products directly from your website! Whether you sell t-shirts, mugs, stickers, digital products, or anything else, your website can display them beautifully and link customers directly to your store.

### 🛍️ Supported Platforms:

#### **Option 1: Teespring/Spring (Recommended for Beginners)**
- **What it is:** A print-on-demand service that handles everything for you
- **Perfect for:** T-shirts, hoodies, mugs, phone cases, stickers
- **How it works:** You upload designs, they print and ship when someone orders
- **Setup:** Just paste your Teespring store URL during website setup
- **Example:** `https://teespring.com/stores/your-store-name`
- **Cost:** Free to start, they take a percentage of sales

#### **Option 2: Shopify (For Serious Sellers)**
- **What it is:** Professional e-commerce platform
- **Perfect for:** Any type of product, multiple items, inventory management
- **How it works:** You manage inventory, they provide "Buy Button" code
- **Setup:** Create products in Shopify, copy the embed code
- **Cost:** Monthly subscription ($29+), but very powerful

#### **Option 3: Etsy (For Handmade/Unique Items)**
- **What it is:** Marketplace for handmade and vintage items
- **Perfect for:** Art, crafts, vintage items, digital downloads
- **Setup:** Just link to your Etsy shop
- **Example:** `https://etsy.com/shop/YourShopName`
- **Cost:** Small listing fees and transaction fees

#### **Option 4: Custom Store (Any Platform)**
- **What it is:** Link to any online store you already have
- **Perfect for:** Amazon stores, eBay, your own website, etc.
- **Setup:** Just provide the URL to your store

### 🎯 What Your Visitors Will See:
- **Professional "Visit Store" button** that matches your website design
- **Direct links** to your products or store
- **Embedded product displays** (for Shopify and Teespring)
- **Mobile-friendly** product showcases

### 💡 Pro Tips:
- **Start simple:** Use Teespring if you're new to selling merchandise
- **Test first:** Create a few products before launching your website
- **Update regularly:** Add new products to keep visitors coming back
- **Cross-promote:** Mention your merch in your videos and social media

---

## 📬 Contact Form Setup (Let Fans Reach You!)

### Why Do You Need a Contact Form?
A contact form allows your fans, potential sponsors, and business partners to reach you directly through your website. It's more professional than just listing your email address and helps filter serious inquiries.

### 🔧 Form Service Options:

#### **Option 1: Formspree (Recommended for Beginners)**

**What is Formspree?**
Formspree is a simple service that handles contact forms for static websites. When someone fills out your contact form, Formspree sends the message directly to your email inbox.

**Why Choose Formspree:**
- ✅ **Free plan available** (up to 50 submissions per month)
- ✅ **No coding required** - just sign up and get a form ID
- ✅ **Spam protection** built-in with reCAPTCHA
- ✅ **Email notifications** sent directly to your inbox
- ✅ **Professional appearance** - no "powered by" branding on free plan

**Setup Steps:**
1. **Sign Up:**
   - Go to [formspree.io](https://formspree.io)
   - Click "Get Started" and create a free account
   - Verify your email address

2. **Create a Form:**
   - Click "+ New Form"
   - **Form Name:** Enter something like "Website Contact Form"
   - **Email:** Enter the email where you want to receive messages
   - Click "Create Form"

3. **Get Your Form ID:**
   - You'll see a form ID that looks like: `xpzgkqyw`
   - Copy this ID - you'll enter it during website setup

4. **Test It:**
   - After setup, test your contact form by sending yourself a message
   - Check your email (including spam folder) for the test message

#### **Option 2: EmailJS (For Advanced Users)**

**What is EmailJS?**
EmailJS sends emails directly from your website using JavaScript, without needing a backend server.

**Why Choose EmailJS:**
- ✅ **More customization options**
- ✅ **Custom email templates**
- ✅ **Multiple email services** (Gmail, Outlook, etc.)
- ✅ **Real-time sending** without page refresh

**Setup Steps:**
1. **Sign Up:**
   - Go to [emailjs.com](https://www.emailjs.com/)
   - Create a free account

2. **Connect Email Service:**
   - Add your Gmail, Outlook, or other email service
   - Follow the authentication steps

3. **Create Email Template:**
   - Design how you want to receive contact form messages
   - Include fields for name, email, and message

4. **Get Your IDs:**
   - Copy your Service ID, Template ID, and Public Key
   - Enter these during website setup

### 🛡️ Security Features:
- **Spam Protection:** Both services include spam filtering
- **Rate Limiting:** Prevents form abuse
- **Email Validation:** Ensures valid email addresses
- **Honeypot Fields:** Hidden fields that catch bots

### 📧 What Happens When Someone Contacts You:
1. **Visitor fills out form** on your website
2. **Form service processes** the message
3. **Email is sent** to your inbox immediately
4. **You can reply** directly from your email
5. **Professional impression** for potential business opportunities

---

## 🎨 Enhanced Styling & Customization

### Font Options Available:
During setup, you can choose from these professional font combinations:

1. **Modern & Clean:** Inter + Source Sans Pro
2. **Creative & Artistic:** Poppins + Open Sans
3. **Professional & Corporate:** Roboto + Lato
4. **Elegant & Sophisticated:** Playfair Display + Source Sans Pro
5. **Tech & Gaming:** Orbitron + Exo 2
6. **Friendly & Approachable:** Nunito + Mukti

### Color Customization:
- **Primary Color:** Your main brand color (buttons, headings, accents)
- **Secondary Color:** Complementary color (hover effects, highlights)
- **Background Color:** Main page background
- **Text Color:** Primary text color
- **Accent Color:** Special highlights and call-to-action elements

### Style Themes Available:
1. **Minimalist:** Clean, simple design with lots of white space
2. **Bold & Vibrant:** Eye-catching colors and strong contrasts
3. **Dark Mode:** Dark backgrounds with light text
4. **Gradient:** Beautiful color gradients throughout
5. **Gaming:** Neon accents and tech-inspired design
6. **Professional:** Corporate-style layout and colors

---

## 🌐 GitHub Pages Deployment

### Will Deployment Work After Setup?
**Yes!** Once you complete the setup process, your website will be 100% ready for GitHub Pages deployment.

### Repository Naming:
Your GitHub repository name **does not** need to match your brand name. Here's how it works:

#### If your brand name is "Th3viousGameus":
- **Repository name can be:** `th3viousgameus-website`, `my-creator-site`, `personal-website`, or anything you want
- **Your website URL will be:** `https://yourusername.github.io/repository-name/`
- **Example:** `https://james123.github.io/th3viousgameus-website/`

#### For a Custom Domain (Optional):
- You can purchase a domain like `th3viousgameus.com`
- Point it to your GitHub Pages site
- Your URL becomes: `https://th3viousgameus.com`

### Deployment Steps:

1. **Create GitHub Account:**
   - Go to [github.com](https://github.com) and sign up
   - Choose a username (this will be in your website URL)

2. **Create Repository:**
   - Click "New Repository"
   - **Name:** Choose any name (e.g., `my-creator-website`)
   - Make it **Public**
   - Don't initialize with README (you already have files)

3. **Upload Your Files:**
   - After running the setup, you'll have all the files ready
   - Upload all generated files including `index.html`, `style.css`, `script.js`, `assets/` folder, and `.github/workflows/deploy.yml`
   - Or use Git commands if you're comfortable with them

4. **Enable GitHub Pages (Automatic Deployment):**
   - Go to repository Settings → Pages
   - **Source:** GitHub Actions (recommended - uses the included deploy.yml)
   - OR **Source:** Deploy from a branch → **Branch:** main → **Folder:** / (root)
   - Click Save

5. **Your Website is Live!**
   - With GitHub Actions: Automatic deployment on every push to main branch
   - GitHub will provide your website URL
   - It usually takes 5-10 minutes to go live
   - Share this URL with your audience!

---

## 📜 Copyright & Legal Information

### What You Own:
- **Your Content:** All your videos, images, text, and creative work
- **Your Brand:** Your channel name, logo, and brand identity
- **Your Data:** All information collected through your contact form

### What This Project Provides:
- **Website Template:** The HTML, CSS, and JavaScript code structure
- **Setup Tools:** Scripts to help you configure your website
- **Documentation:** All guides and instructions

### License Information:
This project is released under the **MIT License**, which means:
- ✅ **Free to use** for personal and commercial purposes
- ✅ **Free to modify** and customize as needed
- ✅ **Free to distribute** and share with others
- ✅ **No attribution required** (but appreciated!)

### Recommended Copyright Notice for Your Website:
Add this to your website footer (the setup will ask for this):

```
© 2024 [Your Name/Brand]. All rights reserved.
Website powered by Personal Creator Website Template.
```

### Third-Party Services:
When you use external services, you agree to their terms:
- **YouTube Data API:** [Google's Terms of Service](https://developers.google.com/terms/)
- **Formspree:** [Formspree Terms](https://formspree.io/legal/terms/)
- **EmailJS:** [EmailJS Terms](https://www.emailjs.com/legal/terms/)
- **GitHub Pages:** [GitHub Terms](https://docs.github.com/en/github/site-policy/github-terms-of-service)

---

## 🆘 Troubleshooting & Support

### Common Issues:

#### **Node.js Installation Problems:**
- **Windows:** Make sure to restart your computer after installation
- **Mac:** You might need to install Xcode Command Line Tools
- **Both:** Try downloading the LTS version instead of the latest

#### **YouTube Videos Not Loading:**
- ✅ Check your API key is correct (starts with `AIzaSy`)
- ✅ Verify your Channel ID format (usually starts with `UC`)
- ✅ Ensure YouTube Data API v3 is enabled in Google Cloud
- ✅ Check browser console for error messages (F12)

#### **Contact Form Not Working:**
- ✅ Verify Formspree form ID is correct
- ✅ Check your email (including spam folder)
- ✅ Test with a simple message first
- ✅ Make sure form action URL is correct

#### **Website Not Displaying Correctly:**
- ✅ Check all files are uploaded to GitHub
- ✅ Verify GitHub Pages is enabled
- ✅ Wait 5-10 minutes for changes to take effect
- ✅ Clear your browser cache

### Getting Help:
1. **Check the SETUP-GUIDE.md** file for detailed instructions
2. **Review this README** for comprehensive information
3. **Search GitHub Issues** for similar problems
4. **Create a new issue** if you need specific help

---

## 🎯 Next Steps After Setup

### Immediate Actions:
1. **Test Everything:**
   - Check all links work correctly
   - Test contact form with a real message
   - Verify videos load properly
   - Test on mobile devices

2. **Customize Content:**
   - Add your actual profile photos
   - Write compelling descriptions
   - Update social media links
   - Add merchandise if you have any

3. **Deploy to GitHub Pages:**
   - Follow the deployment guide above
   - Share your new website URL
   - Update your social media bios with the link

### Long-term Improvements:
1. **SEO Optimization:**
   - Add meta descriptions
   - Include relevant keywords
   - Create a sitemap

2. **Analytics:**
   - Add Google Analytics
   - Track visitor behavior
   - Monitor popular content

3. **Content Updates:**
   - Regular website maintenance
   - Update colors/themes seasonally
   - Add new sections as you grow

---

## 🎉 Congratulations!

You now have everything you need to create a professional creator website! This website will:

- **Automatically showcase your latest content**
- **Help you sell merchandise and grow your brand**
- **Provide a professional way for fans and businesses to contact you**
- **Work perfectly on all devices**
- **Cost absolutely nothing to host**

Remember: Your website is a reflection of your brand. Take time to customize it, keep it updated, and use it to connect with your audience in new ways.

**Ready to get started?** Run `node setup.js` and let's build your amazing creator website! 🚀

---

*This project is maintained by the creator community. Feel free to contribute improvements and share your success stories!*
