# Creator Website Builder

A automated website generator designed specifically for YouTube creators, streamers, and content creators. 
Build a professional website with YouTube integration, contact forms, merchandise sections, and more - all through an interactive setup process.

## ✨ Features

- **YouTube Integration**: Automatically fetch and display your latest videos, playlists, and live streams
- **Multiple Contact Forms**: Support for Formspree, EmailJS, and simple mailto links
- **Merchandise Integration**: Showcase your products with embedded stores (Teespring, Shopify, Etsy, Custom)
- **Streaming Integration**: Embed Twitch streams with chat
- **Social Media Links**: Connect all your social platforms
- **Responsive Design**: Mobile-friendly layouts that work on all devices
- **Multiple Themes**: Choose from Professional, Creative, Gaming, Dark, and Minimalist themes
- **Advanced CSS**: Modern design with animations, gradients, and glassmorphism effects
- **GitHub Pages Ready**: Automatic deployment configuration included

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- A YouTube channel
- (Optional) YouTube Data API key for video integration
- (Optional) Contact form service accounts (Formspree/EmailJS)

### Installation

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/Jimmyu2foru18/Website-Builder-Beta.git
   cd youtube-creator-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the setup wizard**
   ```bash
   npm run setup
   ```
   Or on Windows:
   ```bash
   setup.bat
   ```

4. **Follow the interactive prompts** to configure:
   - Basic information (name, description, email)
   - Theme selection
   - YouTube integration
   - Social media links
   - Contact form setup
   - Merchandise integration
   - Streaming setup
   - Copyright information

5. **Re-Generate your website after changes**
   ```bash
   node regenerate.js
   ```

6. **Open `index.html`** in your browser to view your website!

## 📋 Setup Guide

### Basic Information
- **Creator Name**: Your name or channel name
- **Description**: Brief description of your content
- **Contact Email**: Primary contact email address

### Theme Selection
Choose from 5 professionally designed themes:
- **Professional**: Clean, business-like design
- **Creative**: Vibrant, artistic layout
- **Gaming**: Dark theme perfect for gamers
- **Dark**: Sleek dark mode design
- **Minimalist**: Clean, simple aesthetic

### YouTube Integration

#### Getting a YouTube API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key for setup

#### Channel ID
- Go to your YouTube channel
- Copy the channel ID from the URL or use online tools
- Format: `UC...` (24 characters)

### Contact Forms

Choose from three options:

#### 1. Formspree (Recommended)
- Sign up at [formspree.io](https://formspree.io)
- Create a new form
- Copy the form endpoint URL
- Free tier: 50 submissions/month

#### 2. EmailJS
- Sign up at [emailjs.com](https://www.emailjs.com/)
- Create email service and template
- Get Service ID, Template ID, and Public Key
- Free tier: 200 emails/month

#### 3. Mailto
- Simple email link that opens user's default email client
- No external service required
- Works offline

### Merchandise Integration

Supported platforms:
- **Teespring**: Enter your store URL
- **Shopify**: Store URL + optional embed code
- **Etsy**: Shop URL
- **Custom**: Any merchandise URL

### Social Media

Supported platforms:
- YouTube
- Twitch
- Twitter/X
- Instagram
- TikTok
- Discord
- Facebook
- LinkedIn
- GitHub

### Streaming (Twitch)
- Enter your Twitch username
- Automatically embeds live stream and chat
- Shows offline message when not streaming

## 🔧 Configuration

All settings are stored in `config.json`. You can manually edit this file or re-run the setup:

```json
{
  "basic": {
    "name": "Your Name",
    "description": "Content Creator",
    "email": "your@email.com"
  },
  "theme": {
    "style": "professional",
    "primaryColor": "#3498db",
    "backgroundColor": "#ffffff"
  },
  "youtube": {
    "enabled": true,
    "apiKey": "your-api-key",
    "channelId": "your-channel-id"
  }
}
```

## 🎨 Customization

### Regenerating the Website
After making changes to `config.json`:
```bash
node regenerate.js
```

### Custom CSS
Edit the generated `style.css` file for additional customizations.

### Custom JavaScript
Modify `script.js` for additional functionality.

## 🚀 Deployment

### GitHub Pages (Automatic)
1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select "GitHub Actions" as source
4. The included workflow will automatically deploy your site

### Manual Deployment
Upload these files to any web hosting service:
- `index.html`
- `style.css`
- `script.js`
- `assets/` folder (if you add images)

## 📁 Project Structure

```
├── config.json              # Configuration file
├── index.html              # Generated website
├── style.css               # Generated styles
├── script.js               # Generated JavaScript
├── setup.js                # Setup wizard
├── regenerate.js           # Website regenerator
├── package.json            # Dependencies
├── .github/workflows/      # GitHub Actions
└── src/
    ├── SetupOrchestrator.js # Main setup controller
    ├── core/               # Core functionality
    ├── generators/         # File generators
    ├── steps/              # Setup steps
    └── utils/              # Utilities
```

## 🔍 Troubleshooting

### YouTube Videos Not Loading
- Verify your API key is correct
- Check that YouTube Data API v3 is enabled
- Ensure your channel ID is correct (24 characters starting with UC)
- Check browser console for error messages

### Contact Form Not Working
- Verify your form service credentials
- Check spam folders for test emails
- Ensure form endpoints are correct

### Styling Issues
- Clear browser cache
- Check for JavaScript errors in console
- Verify all files are uploaded correctly

### API Rate Limits
- YouTube API: 10,000 units/day (free tier)
- Formspree: 50 submissions/month (free tier)
- EmailJS: 200 emails/month (free tier)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Include your `config.json` (remove sensitive data)

## 🎯 Roadmap

- [ ] Additional theme options
- [ ] More social media platforms
- [ ] Blog integration
- [ ] Analytics integration
- [ ] SEO optimization tools
- [ ] Multi-language support

---

**Built with ❤️ for content creators**
