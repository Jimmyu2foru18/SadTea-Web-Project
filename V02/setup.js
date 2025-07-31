const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Enhanced color system for beautiful terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function displayHeader() {
  console.clear();
  console.log(colors.cyan + colors.bright + '╔══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                              ║');
  console.log('║                    🎥 PERSONAL CREATOR WEBSITE SETUP 🎥                     ║');
  console.log('║                                                                              ║');
  console.log('║              Professional Website Builder for Content Creators              ║');
  console.log('║                          No Coding Experience Required!                     ║');
  console.log('║                                                                              ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════════╝' + colors.reset);
  console.log();
  console.log(colors.green + '✨ Features: YouTube Integration • Contact Forms • Merchandise • Social Media ✨' + colors.reset);
  console.log();
}

function displaySection(title, icon, description = '') {
  console.log(colors.yellow + colors.bright + `\n${icon} ${title}` + colors.reset);
  console.log(colors.dim + '─'.repeat(80) + colors.reset);
  if (description) {
    console.log(colors.dim + description + colors.reset);
    console.log();
  }
}

function displayOptions(options, title) {
  console.log(colors.cyan + `\n${title}:` + colors.reset);
  options.forEach((option, index) => {
    console.log(colors.white + `  ${colors.bright}${index + 1}.${colors.reset}${colors.white} ${option}` + colors.reset);
  });
  console.log();
}

function displaySuccess(message) {
  console.log(colors.green + colors.bright + '✅ ' + message + colors.reset);
}

function displayInfo(message) {
  console.log(colors.blue + 'ℹ️  ' + message + colors.reset);
}

function displayWarning(message) {
  console.log(colors.yellow + '⚠️  ' + message + colors.reset);
}

async function selectFromOptions(options, prompt, allowEmpty = false) {
  while (true) {
    const choice = await question(colors.green + prompt + colors.reset);
    
    if (allowEmpty && choice.trim() === '') {
      return -1; // Indicates empty/skip
    }
    
    const index = parseInt(choice) - 1;
    if (index >= 0 && index < options.length) {
      return index;
    }
    console.log(colors.red + '❌ Invalid choice. Please try again.' + colors.reset);
  }
}

function validateHexColor(color) {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

async function getValidHexColor(prompt, defaultColor) {
  while (true) {
    const color = await question(colors.cyan + prompt + colors.dim + ` (default: ${defaultColor}): ` + colors.reset) || defaultColor;
    if (validateHexColor(color)) {
      return color;
    }
    console.log(colors.red + '❌ Invalid hex color format. Please use format like #3498db' + colors.reset);
  }
}

async function setup() {
  displayHeader();
  
  console.log(colors.green + 'Welcome! Let\'s build your amazing creator website step by step.' + colors.reset);
  console.log(colors.dim + 'This setup will take about 5-10 minutes to complete.\n' + colors.reset);
  
  await question(colors.yellow + colors.bright + 'Press Enter to begin your journey...' + colors.reset);

  const config = {};

  // Basic Information
  displaySection('BASIC INFORMATION', '📝', 'Tell us about yourself and your brand');
  
  config.creatorName = await question(colors.cyan + 'Enter your creator name/brand: ' + colors.reset);
  config.websiteTitle = await question(colors.cyan + 'Enter your website title: ' + colors.reset);
  config.description = await question(colors.cyan + 'Enter a brief description of your content: ' + colors.reset);
  
  displaySuccess('Basic information saved!');

  // YouTube Integration
  displaySection('YOUTUBE INTEGRATION', '🎬', 'Connect your YouTube channel to automatically display your latest videos and playlists');
  
  displayInfo('You\'ll need a YouTube Data API v3 key. Check the README.md for detailed setup instructions.');
  
  config.youtube = {
    apiKey: await question(colors.cyan + 'Enter your YouTube API key: ' + colors.reset),
    channelId: await question(colors.cyan + 'Enter your YouTube Channel ID: ' + colors.reset),
    maxVideos: parseInt(await question(colors.cyan + 'How many recent videos to display? (default: 6): ' + colors.reset) || '6')
  };
  
  const showPlaylists = (await question(colors.cyan + 'Show YouTube playlists on your website? (y/n): ' + colors.reset)).toLowerCase() === 'y';
  config.youtube.showPlaylists = showPlaylists;
  
  if (showPlaylists) {
    config.youtube.maxPlaylists = parseInt(await question(colors.cyan + 'How many playlists to display? (default: 4): ' + colors.reset) || '4');
    displaySuccess('YouTube integration with playlists configured!');
  } else {
    config.youtube.maxPlaylists = 0;
    displaySuccess('YouTube integration configured!');
  }

  // Social Media Links
  displaySection('SOCIAL MEDIA LINKS', '📱', 'Add links to all your social media profiles (press Enter to skip any)');
  
  config.socialMedia = {
    youtube: await question(colors.cyan + 'YouTube channel URL: ' + colors.reset),
    instagram: await question(colors.cyan + 'Instagram URL: ' + colors.reset),
    twitter: await question(colors.cyan + 'Twitter/X URL: ' + colors.reset),
    tiktok: await question(colors.cyan + 'TikTok URL: ' + colors.reset),
    discord: await question(colors.cyan + 'Discord URL: ' + colors.reset),
    twitch: await question(colors.cyan + 'Twitch URL: ' + colors.reset),
    facebook: await question(colors.cyan + 'Facebook URL: ' + colors.reset),
    linkedin: await question(colors.cyan + 'LinkedIn URL: ' + colors.reset)
  };
  
  displaySuccess('Social media links configured!');

  // Merchandise Configuration
  displaySection('MERCHANDISE INTEGRATION', '👕', 'Showcase and sell your products directly from your website');
  
  const merchOptions = [
    'Teespring/Spring (Print-on-demand - Recommended for beginners)',
    'Shopify (Professional e-commerce platform)',
    'Etsy (Handmade and unique items)',
    'Custom store (Any other platform)',
    'No merchandise (Skip this section)'
  ];
  
  displayOptions(merchOptions, 'Choose your merchandise platform');
  
  const merchChoice = await selectFromOptions(merchOptions, 'Select option (1-5): ');
  const merchTypes = ['teespring', 'shopify', 'etsy', 'custom', 'none'];
  const merchType = merchTypes[merchChoice];
  
  config.merchandise = {
    enabled: merchType !== 'none',
    platform: merchType,
    url: '',
    embedCode: ''
  };
  
  if (merchType !== 'none') {
    config.merchandise.url = await question(colors.cyan + 'Enter your store URL: ' + colors.reset);
    
    if (merchType === 'shopify') {
      const hasEmbed = (await question(colors.cyan + 'Do you have Shopify embed code? (y/n): ' + colors.reset)).toLowerCase() === 'y';
      if (hasEmbed) {
        config.merchandise.embedCode = await question(colors.cyan + 'Enter Shopify embed code: ' + colors.reset);
      }
    }
    
    displaySuccess(`${merchOptions[merchChoice].split(' ')[0]} integration configured!`);
  } else {
    displayInfo('Merchandise section skipped.');
  }

  // Contact Form Setup
  displaySection('CONTACT FORM SETUP', '📬', 'Let fans and business partners reach you through a professional contact form');
  
  const formOptions = [
    'Formspree (Recommended for beginners - Free plan available)',
    'EmailJS (Advanced customization options)',
    'No contact form (Skip this section)'
  ];
  
  displayOptions(formOptions, 'Choose your contact form service');
  
  const formChoice = await selectFromOptions(formOptions, 'Select option (1-3): ');
  const formServices = ['formspree', 'emailjs', 'none'];
  const formService = formServices[formChoice];
  
  config.contactForm = {
    enabled: formService !== 'none',
    service: formService,
    email: ''
  };

  if (formService !== 'none') {
    config.contactForm.email = await question(colors.cyan + 'Enter your contact email: ' + colors.reset);
    
    if (formService === 'formspree') {
      displayInfo('You\'ll need to create a Formspree account and get a form ID. Check the README.md for instructions.');
      config.contactForm.formspreeId = await question(colors.cyan + 'Enter your Formspree form ID: ' + colors.reset);
      displaySuccess('Formspree contact form configured!');
    } else if (formService === 'emailjs') {
      displayInfo('You\'ll need EmailJS account credentials. Check the README.md for setup instructions.');
      config.contactForm.emailjs = {
        serviceId: await question(colors.cyan + 'Enter EmailJS Service ID: ' + colors.reset),
        templateId: await question(colors.cyan + 'Enter EmailJS Template ID: ' + colors.reset),
        publicKey: await question(colors.cyan + 'Enter EmailJS Public Key: ' + colors.reset)
      };
      displaySuccess('EmailJS contact form configured!');
    }
  } else {
    displayInfo('Contact form section skipped.');
  }

  // Enhanced Theme Customization
  displaySection('VISUAL STYLING & THEMES', '🎨', 'Customize your website\'s appearance to match your brand perfectly');
  
  // Font Selection
  const fontOptions = [
    'Modern & Clean (Inter + Source Sans Pro)',
    'Creative & Artistic (Poppins + Open Sans)',
    'Professional & Corporate (Roboto + Lato)',
    'Elegant & Sophisticated (Playfair Display + Source Sans Pro)',
    'Tech & Gaming (Orbitron + Exo 2)',
    'Friendly & Approachable (Nunito + Mukti)'
  ];
  
  displayOptions(fontOptions, 'Choose your font style');
  const fontChoice = await selectFromOptions(fontOptions, 'Select font option (1-6): ');
  
  const fontPairs = [
    { primary: 'Inter', secondary: 'Source Sans Pro', googleFonts: 'Inter:wght@300;400;500;600;700|Source+Sans+Pro:wght@300;400;600;700' },
    { primary: 'Poppins', secondary: 'Open Sans', googleFonts: 'Poppins:wght@300;400;500;600;700|Open+Sans:wght@300;400;600;700' },
    { primary: 'Roboto', secondary: 'Lato', googleFonts: 'Roboto:wght@300;400;500;700|Lato:wght@300;400;700' },
    { primary: 'Playfair Display', secondary: 'Source Sans Pro', googleFonts: 'Playfair+Display:wght@400;500;600;700|Source+Sans+Pro:wght@300;400;600;700' },
    { primary: 'Orbitron', secondary: 'Exo 2', googleFonts: 'Orbitron:wght@400;500;600;700;800;900|Exo+2:wght@300;400;500;600;700' },
    { primary: 'Nunito', secondary: 'Mukti', googleFonts: 'Nunito:wght@300;400;500;600;700;800|Mukti:wght@300;400;600;700' }
  ];
  
  // Style Theme Selection
  const styleOptions = [
    'Minimalist (Clean, simple design with lots of white space)',
    'Bold & Vibrant (Eye-catching colors and strong contrasts)',
    'Dark Mode (Dark backgrounds with light text)',
    'Gradient (Beautiful color gradients throughout)',
    'Gaming (Neon accents and tech-inspired design)',
    'Professional (Corporate-style layout and colors)',
    'Custom Colors (Choose your own color scheme)'
  ];
  
  displayOptions(styleOptions, 'Choose your visual theme');
  const styleChoice = await selectFromOptions(styleOptions, 'Select theme option (1-7): ');
  
  const themePresets = [
    { name: 'minimalist', primary: '#2c3e50', secondary: '#3498db', background: '#ffffff', text: '#333333', accent: '#e74c3c' },
    { name: 'vibrant', primary: '#e74c3c', secondary: '#f39c12', background: '#ffffff', text: '#2c3e50', accent: '#9b59b6' },
    { name: 'dark', primary: '#3498db', secondary: '#2ecc71', background: '#2c3e50', text: '#ecf0f1', accent: '#e74c3c' },
    { name: 'gradient', primary: '#9b59b6', secondary: '#3498db', background: '#ffffff', text: '#2c3e50', accent: '#e74c3c' },
    { name: 'gaming', primary: '#00ff88', secondary: '#00ccff', background: '#0a0a0a', text: '#ffffff', accent: '#ff0066' },
    { name: 'professional', primary: '#34495e', secondary: '#3498db', background: '#ffffff', text: '#2c3e50', accent: '#e74c3c' }
  ];
  
  config.theme = {
    fonts: fontPairs[fontChoice],
    style: styleChoice < 6 ? themePresets[styleChoice].name : 'custom'
  };
  
  if (styleChoice === 6) { // Custom colors
    console.log(colors.cyan + '\nCustom Color Configuration:' + colors.reset);
    config.theme.primaryColor = await getValidHexColor('Primary color (buttons, headings)', '#3498db');
    config.theme.secondaryColor = await getValidHexColor('Secondary color (hover effects)', '#2ecc71');
    config.theme.backgroundColor = await getValidHexColor('Background color', '#ffffff');
    config.theme.textColor = await getValidHexColor('Text color', '#333333');
    config.theme.accentColor = await getValidHexColor('Accent color (highlights)', '#e74c3c');
    displaySuccess('Custom color scheme configured!');
  } else {
    const preset = themePresets[styleChoice];
    config.theme.primaryColor = preset.primary;
    config.theme.secondaryColor = preset.secondary;
    config.theme.backgroundColor = preset.background;
    config.theme.textColor = preset.text;
    config.theme.accentColor = preset.accent;
    displaySuccess(`${styleOptions[styleChoice].split(' ')[0]} theme configured!`);
  }

  // Copyright and Footer
  displaySection('COPYRIGHT & FOOTER', '©️', 'Add your copyright information and website credits');
  
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} ${config.creatorName}. All rights reserved.`;
  
  config.copyright = await question(colors.cyan + `Copyright text (default: "${defaultCopyright}"): ` + colors.reset) || defaultCopyright;
  
  const showCredit = (await question(colors.cyan + 'Show "Powered by https://github.com/Jimmyu2foru18" credit? (y/n): ' + colors.reset)).toLowerCase() === 'y';
  config.showCredit = showCredit;
  
  displaySuccess('Copyright and footer configured!');

  // Final Configuration Summary
  displaySection('CONFIGURATION SUMMARY', '📋', 'Review your website configuration');
  
  console.log(colors.white + `Creator Name: ${colors.cyan}${config.creatorName}${colors.reset}`);
  console.log(colors.white + `Website Title: ${colors.cyan}${config.websiteTitle}${colors.reset}`);
  console.log(colors.white + `YouTube Integration: ${colors.cyan}${config.youtube.apiKey ? 'Enabled' : 'Disabled'}${colors.reset}`);
  console.log(colors.white + `Playlists: ${colors.cyan}${config.youtube.showPlaylists ? 'Enabled' : 'Disabled'}${colors.reset}`);
  console.log(colors.white + `Merchandise: ${colors.cyan}${config.merchandise.enabled ? config.merchandise.platform : 'Disabled'}${colors.reset}`);
  console.log(colors.white + `Contact Form: ${colors.cyan}${config.contactForm.enabled ? config.contactForm.service : 'Disabled'}${colors.reset}`);
  console.log(colors.white + `Theme: ${colors.cyan}${config.theme.style}${colors.reset}`);
  console.log(colors.white + `Fonts: ${colors.cyan}${config.theme.fonts.primary} + ${config.theme.fonts.secondary}${colors.reset}`);
  
  console.log();
  const confirm = await question(colors.yellow + 'Does this look correct? (y/n): ' + colors.reset);
  
  if (confirm.toLowerCase() !== 'y') {
    console.log(colors.red + 'Setup cancelled. Run the script again to restart.' + colors.reset);
    rl.close();
    return;
  }

  // Save configuration and generate files
  displaySection('GENERATING WEBSITE', '🚀', 'Creating your professional creator website...');
  
  try {
    // Save config
    const configPath = path.join(__dirname, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    displaySuccess('Configuration saved to config.json');
    
    // Generate website files
    generateHTML(config);
    displaySuccess('Generated index.html');
    
    generateCSS(config);
    displaySuccess('Generated style.css');
    
    generateJS(config);
    displaySuccess('Generated script.js');
    
    // Create assets folder
    const assetsPath = path.join(__dirname, 'assets');
    if (!fs.existsSync(assetsPath)) {
      fs.mkdirSync(assetsPath);
      displaySuccess('Created assets folder');
    }
    
    // Final success message
    console.log();
    console.log(colors.green + colors.bright + '🎉 WEBSITE GENERATED SUCCESSFULLY! 🎉' + colors.reset);
    console.log();
    console.log(colors.cyan + '📁 Files created:' + colors.reset);
    console.log(colors.white + '  ✅ index.html (Your main website page)' + colors.reset);
    console.log(colors.white + '  ✅ style.css (All styling and themes)' + colors.reset);
    console.log(colors.white + '  ✅ script.js (Interactive functionality)' + colors.reset);
    console.log(colors.white + '  ✅ config.json (Your configuration settings)' + colors.reset);
    console.log(colors.white + '  ✅ assets/ (Folder for your images and media)' + colors.reset);
    console.log();
    console.log(colors.yellow + '🌐 Next Steps:' + colors.reset);
    console.log(colors.white + '  1. Open index.html in your browser to preview' + colors.reset);
    console.log(colors.white + '  2. Add your profile images to the assets/ folder' + colors.reset);
    console.log(colors.white + '  3. Test your contact form and YouTube integration' + colors.reset);
    console.log(colors.white + '  4. Deploy to GitHub Pages (see DEPLOYMENT.md)' + colors.reset);
    console.log();
    console.log(colors.green + '📖 For detailed instructions, check:' + colors.reset);
    console.log(colors.white + '  • README.md - Complete setup guide' + colors.reset);
    console.log(colors.white + '  • SETUP-GUIDE.md - Customization instructions' + colors.reset);
    console.log(colors.white + '  • DEPLOYMENT.md - GitHub Pages deployment' + colors.reset);
    console.log();
    
  } catch (error) {
    console.log(colors.red + '❌ Error generating website: ' + error.message + colors.reset);
  }
  
  rl.close();
}

function generateHTML(config) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.websiteTitle}</title>
    <meta name="description" content="${config.description}">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?${config.theme.fonts.googleFonts}&display=swap" rel="stylesheet">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-brand">
                <h1>${config.creatorName}</h1>
            </div>
            <ul class="nav-menu">
                <li><a href="#home" class="nav-link">Home</a></li>
                <li><a href="#videos" class="nav-link">Videos</a></li>
                ${config.youtube.showPlaylists ? '<li><a href="#playlists" class="nav-link">Playlists</a></li>' : ''}
                ${config.merchandise.enabled ? '<li><a href="#merch" class="nav-link">Merch</a></li>' : ''}
                <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
            <div class="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <div class="hero-content">
                <h1 class="hero-title">Welcome to ${config.creatorName}</h1>
                <p class="hero-description">${config.description}</p>
                <div class="social-links">
                    ${generateSocialLinks(config.socialMedia)}
                </div>
                <div class="hero-cta">
                    <a href="#videos" class="btn btn-primary">Watch Latest Videos</a>
                    ${config.merchandise.enabled ? '<a href="#merch" class="btn btn-secondary">Shop Merch</a>' : ''}
                </div>
            </div>
        </section>

        <section id="videos" class="videos-section">
            <div class="container">
                <h2 class="section-title">Latest Videos</h2>
                <div id="videos-container" class="videos-grid">
                    <div class="loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Loading latest videos...</p>
                    </div>
                </div>
            </div>
        </section>

        ${config.youtube.showPlaylists ? generatePlaylistsSection() : ''}

        ${config.merchandise.enabled ? generateMerchSection(config.merchandise) : ''}

        <section id="contact" class="contact-section">
            <div class="container">
                <h2 class="section-title">Get In Touch</h2>
                <div class="contact-container">
                    <div class="contact-info">
                        <h3>Let's Connect!</h3>
                        <p>Have a question, collaboration idea, or just want to say hi? I'd love to hear from you!</p>
                        ${config.contactForm.email ? `<p class="contact-email"><i class="fas fa-envelope"></i> ${config.contactForm.email}</p>` : ''}
                        <div class="contact-social">
                            ${generateSocialLinks(config.socialMedia, true)}
                        </div>
                    </div>
                    ${config.contactForm.enabled ? generateContactForm(config.contactForm) : ''}
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <p class="footer-copyright">${config.copyright}</p>
                ${config.showCredit ? '<p class="footer-credit">Website powered by <a href="#" target="_blank">Personal Creator Website Template</a></p>' : ''}
            </div>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;

  fs.writeFileSync('index.html', html);
}

function generateSocialLinks(socialMedia, compact = false) {
  const platforms = [
    { key: 'youtube', icon: 'fab fa-youtube', name: 'YouTube' },
    { key: 'instagram', icon: 'fab fa-instagram', name: 'Instagram' },
    { key: 'twitter', icon: 'fab fa-twitter', name: 'Twitter' },
    { key: 'tiktok', icon: 'fab fa-tiktok', name: 'TikTok' },
    { key: 'discord', icon: 'fab fa-discord', name: 'Discord' },
    { key: 'twitch', icon: 'fab fa-twitch', name: 'Twitch' },
    { key: 'facebook', icon: 'fab fa-facebook', name: 'Facebook' },
    { key: 'linkedin', icon: 'fab fa-linkedin', name: 'LinkedIn' }
  ];

  return platforms
    .filter(platform => socialMedia[platform.key])
    .map(platform => {
      const className = compact ? 'social-link social-link-compact' : 'social-link';
      return `<a href="${socialMedia[platform.key]}" target="_blank" rel="noopener noreferrer" class="${className}" title="${platform.name}">
                <i class="${platform.icon}"></i>
                ${compact ? '' : `<span>${platform.name}</span>`}
              </a>`;
    })
    .join('\n                ');
}

function generatePlaylistsSection() {
  return `
        <section id="playlists" class="playlists-section">
            <div class="container">
                <h2 class="section-title">Video Playlists</h2>
                <div id="playlists-container" class="playlists-grid">
                    <div class="loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Loading playlists...</p>
                    </div>
                </div>
            </div>
        </section>`;
}

function generateMerchSection(merchandise) {
  return `
        <section id="merch" class="merch-section">
            <div class="container">
                <h2 class="section-title">Merchandise</h2>
                <div class="merch-content">
                    <div class="merch-info">
                        <h3>Support the Channel</h3>
                        <p>Check out our awesome merchandise and show your support!</p>
                        <a href="${merchandise.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                            <i class="fas fa-shopping-cart"></i>
                            Visit Store
                        </a>
                    </div>
                    ${merchandise.embedCode ? `<div class="merch-embed">${merchandise.embedCode}</div>` : ''}
                </div>
            </div>
        </section>`;
}

function generateContactForm(contactForm) {
  if (contactForm.service === 'formspree') {
    return `
                    <form class="contact-form" action="https://formspree.io/f/${contactForm.formspreeId}" method="POST">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="_replyto" required>
                        </div>
                        <div class="form-group">
                            <label for="subject">Subject</label>
                            <input type="text" id="subject" name="subject" required>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i>
                            Send Message
                        </button>
                    </form>`;
  } else if (contactForm.service === 'emailjs') {
    return `
                    <form class="contact-form" id="contact-form">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="from_name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="from_email" required>
                        </div>
                        <div class="form-group">
                            <label for="subject">Subject</label>
                            <input type="text" id="subject" name="subject" required>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i>
                            Send Message
                        </button>
                    </form>`;
  }
  return '';
}

function generateCSS(config) {
  const css = `/* Personal Creator Website - Generated Styles */

/* CSS Variables for Theme */
:root {
  --primary-color: ${config.theme.primaryColor};
  --secondary-color: ${config.theme.secondaryColor};
  --background-color: ${config.theme.backgroundColor};
  --text-color: ${config.theme.textColor};
  --accent-color: ${config.theme.accentColor};
  --primary-font: '${config.theme.fonts.primary}', sans-serif;
  --secondary-font: '${config.theme.fonts.secondary}', sans-serif;
  --border-radius: 8px;
  --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--secondary-font);
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--background-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--primary-font);
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 1rem;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }

p {
  margin-bottom: 1rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius);
  font-family: var(--primary-font);
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: var(--box-shadow);
}

.btn-secondary {
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-secondary:hover {
  background-color: var(--primary-color);
  color: white;
}

/* Header */
.header {
  background-color: ${config.theme.style === 'dark' ? 'rgba(44, 62, 80, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: var(--box-shadow);
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-brand h1 {
  color: var(--primary-color);
  font-size: 1.5rem;
  margin: 0;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: var(--transition);
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.nav-toggle span {
  width: 25px;
  height: 3px;
  background-color: var(--text-color);
  margin: 3px 0;
  transition: var(--transition);
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  ${config.theme.style === 'gradient' ? 'background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));' : ''}
  ${config.theme.style === 'gaming' ? 'background: linear-gradient(45deg, #0a0a0a, #1a1a2e, #16213e);' : ''}
}

.hero-content {
  max-width: 800px;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  ${config.theme.style === 'gradient' || config.theme.style === 'gaming' ? 'color: white;' : ''}
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  ${config.theme.style === 'gradient' || config.theme.style === 'gaming' ? 'color: rgba(255, 255, 255, 0.9);' : ''}
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

/* Social Links */
.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 10px 15px;
  background-color: ${config.theme.style === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  border-radius: var(--border-radius);
  text-decoration: none;
  color: var(--text-color);
  transition: var(--transition);
  ${config.theme.style === 'gaming' ? 'border: 1px solid var(--accent-color); box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);' : ''}
}

.social-link:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  ${config.theme.style === 'gaming' ? 'box-shadow: 0 0 20px var(--accent-color);' : ''}
}

.social-link-compact {
  padding: 8px;
  width: 40px;
  height: 40px;
  justify-content: center;
}

/* Sections */
.section-title {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--primary-color);
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: var(--accent-color);
  border-radius: 2px;
}

/* Videos Section */
.videos-section {
  padding: 5rem 0;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.video-card {
  background-color: ${config.theme.style === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
  ${config.theme.style === 'gaming' ? 'border: 1px solid rgba(0, 255, 136, 0.3);' : ''}
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.video-card:hover .video-thumbnail img {
  transform: scale(1.05);
}

.video-info {
  padding: 1.5rem;
}

.video-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.video-date {
  color: ${config.theme.style === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
  font-size: 0.9rem;
}

/* Playlists Section */
.playlists-section {
  padding: 5rem 0;
  background-color: ${config.theme.style === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'};
}

.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.playlist-card {
  background-color: ${config.theme.style === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

.playlist-card:hover {
  transform: translateY(-3px);
}

.playlist-thumbnail {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.playlist-info {
  padding: 1.5rem;
}

.playlist-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.playlist-count {
  color: var(--primary-color);
  font-size: 0.9rem;
}

/* Merchandise Section */
.merch-section {
  padding: 5rem 0;
}

.merch-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.merch-info h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.merch-embed {
  text-align: center;
}

/* Contact Section */
.contact-section {
  padding: 5rem 0;
  background-color: ${config.theme.style === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'};
}

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.contact-info h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.contact-email {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
  color: var(--text-color);
}

.contact-social {
  margin-top: 2rem;
}

/* Contact Form */
.contact-form {
  background-color: ${config.theme.style === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid ${config.theme.style === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: var(--border-radius);
  font-family: var(--secondary-font);
  font-size: 1rem;
  background-color: ${config.theme.style === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  color: var(--text-color);
  transition: var(--transition);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/* Footer */
.footer {
  background-color: ${config.theme.style === 'dark' ? 'rgba(44, 62, 80, 0.95)' : 'rgba(0, 0, 0, 0.05)'};
  padding: 2rem 0;
  text-align: center;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-copyright {
  margin: 0;
  color: var(--text-color);
}

.footer-credit {
  margin: 0;
  font-size: 0.9rem;
  color: ${config.theme.style === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
}

.footer-credit a {
  color: var(--primary-color);
  text-decoration: none;
}

/* Loading Animation */
.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-color);
}

.loading i {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .nav-toggle {
    display: flex;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-cta {
    flex-direction: column;
    align-items: center;
  }
  
  .contact-container,
  .merch-content {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }
  
  .hero {
    padding: 1rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .videos-grid,
  .playlists-grid {
    grid-template-columns: 1fr;
  }
}

/* Theme-specific enhancements */
${config.theme.style === 'gaming' ? `
/* Gaming Theme Enhancements */
.hero {
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 0, 102, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.video-card,
.playlist-card {
  border: 1px solid rgba(0, 255, 136, 0.3);
  background: linear-gradient(145deg, rgba(0, 0, 0, 0.8), rgba(26, 26, 46, 0.8));
}

.btn-primary {
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  border: 1px solid var(--accent-color);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}
` : ''}

${config.theme.style === 'minimalist' ? `
/* Minimalist Theme Enhancements */
body {
  font-weight: 300;
}

.section-title::after {
  display: none;
}

.video-card,
.playlist-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.social-link {
  background-color: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
` : ''}`;

  fs.writeFileSync('style.css', css);
}

function generateJS(config) {
  const js = `// Personal Creator Website - Generated JavaScript

// Configuration
const CONFIG = {
  youtube: {
    apiKey: '${config.youtube.apiKey}',
    channelId: '${config.youtube.channelId}',
    maxVideos: ${config.youtube.maxVideos},
    showPlaylists: ${config.youtube.showPlaylists},
    maxPlaylists: ${config.youtube.maxPlaylists}
  },
  contactForm: {
    service: '${config.contactForm.service}',
    ${config.contactForm.service === 'emailjs' ? `emailjs: {
      serviceId: '${config.contactForm.emailjs?.serviceId || ''}',
      templateId: '${config.contactForm.emailjs?.templateId || ''}',
      publicKey: '${config.contactForm.emailjs?.publicKey || ''}'
    }` : ''}
  }
};

// YouTube API Integration
class YouTubeAPI {
  constructor() {
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    this.apiKey = CONFIG.youtube.apiKey;
    this.channelId = CONFIG.youtube.channelId;
  }

  async fetchChannelVideos() {
    try {
      const response = await fetch(
        \`\${this.baseUrl}/search?key=\${this.apiKey}&channelId=\${this.channelId}&part=snippet,id&order=date&maxResults=\${CONFIG.youtube.maxVideos}&type=video\`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      return [];
    }
  }

  async fetchChannelPlaylists() {
    if (!CONFIG.youtube.showPlaylists) return [];
    
    try {
      const response = await fetch(
        \`\${this.baseUrl}/playlists?key=\${this.apiKey}&channelId=\${this.channelId}&part=snippet,contentDetails&maxResults=\${CONFIG.youtube.maxPlaylists}\`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }
      
      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Error fetching YouTube playlists:', error);
      return [];
    }
  }

  renderVideos(videos) {
    const container = document.getElementById('videos-container');
    
    if (!videos || videos.length === 0) {
      container.innerHTML = '<div class="loading"><p>No videos found or API key not configured.</p></div>';
      return;
    }

    const videosHTML = videos.map(video => {
      const videoId = video.id.videoId;
      const title = video.snippet.title;
      const thumbnail = video.snippet.thumbnails.medium.url;
      const publishedAt = new Date(video.snippet.publishedAt).toLocaleDateString();
      const videoUrl = \`https://www.youtube.com/watch?v=\${videoId}\`;

      return \`
        <div class="video-card">
          <div class="video-thumbnail">
            <a href="\${videoUrl}" target="_blank" rel="noopener noreferrer">
              <img src="\${thumbnail}" alt="\${title}" loading="lazy">
            </a>
          </div>
          <div class="video-info">
            <h3 class="video-title">
              <a href="\${videoUrl}" target="_blank" rel="noopener noreferrer">\${title}</a>
            </h3>
            <p class="video-date">\${publishedAt}</p>
          </div>
        </div>
      \`;
    }).join('');

    container.innerHTML = videosHTML;
  }

  renderPlaylists(playlists) {
    const container = document.getElementById('playlists-container');
    
    if (!container) return;
    
    if (!playlists || playlists.length === 0) {
      container.innerHTML = '<div class="loading"><p>No playlists found.</p></div>';
      return;
    }

    const playlistsHTML = playlists.map(playlist => {
      const playlistId = playlist.id;
      const title = playlist.snippet.title;
      const thumbnail = playlist.snippet.thumbnails.medium.url;
      const itemCount = playlist.contentDetails.itemCount;
      const playlistUrl = \`https://www.youtube.com/playlist?list=\${playlistId}\`;

      return \`
        <div class="playlist-card">
          <div class="playlist-thumbnail">
            <a href="\${playlistUrl}" target="_blank" rel="noopener noreferrer">
              <img src="\${thumbnail}" alt="\${title}" loading="lazy">
            </a>
          </div>
          <div class="playlist-info">
            <h3 class="playlist-title">
              <a href="\${playlistUrl}" target="_blank" rel="noopener noreferrer">\${title}</a>
            </h3>
            <p class="playlist-count">\${itemCount} videos</p>
          </div>
        </div>
      \`;
    }).join('');

    container.innerHTML = playlistsHTML;
  }
}

// Contact Form Handler
class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.initializeForm();
  }

  initializeForm() {
    if (!this.form) return;

    if (CONFIG.contactForm.service === 'emailjs') {
      this.initializeEmailJS();
    }

    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  initializeEmailJS() {
    // Load EmailJS SDK
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
      emailjs.init(CONFIG.contactForm.emailjs.publicKey);
    };
    document.head.appendChild(script);
  }

  async handleSubmit(e) {
    e.preventDefault();

    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;

    try {
      if (CONFIG.contactForm.service === 'emailjs') {
        await this.sendWithEmailJS();
      }
      
      // Show success message
      this.showMessage('Message sent successfully!', 'success');
      this.form.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      this.showMessage('Failed to send message. Please try again.', 'error');
    } finally {
      // Restore button
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }
  }

   async sendWithEmailJS() {
     const formData = new FormData(this.form);
     
     const templateParams = {
       from_name: formData.get('from_name'),
       from_email: formData.get('from_email'),
       subject: formData.get('subject'),
       message: formData.get('message')
     };

     return emailjs.send(
       CONFIG.contactForm.emailjs.serviceId,
       CONFIG.contactForm.emailjs.templateId,
       templateParams
     );
   }

   showMessage(message, type) {
     // Create message element
     const messageEl = document.createElement('div');
     messageEl.className = form-message form-message-${type};
     messageEl.textContent = message;
     
     // Insert after form
     this.form.parentNode.insertBefore(messageEl, this.form.nextSibling);
     
     // Remove after 5 seconds
     setTimeout(() => {
       if (messageEl.parentNode) {
         messageEl.parentNode.removeChild(messageEl);
       }
     }, 5000);
   }
 }

 // Smooth Scrolling Navigation
 class SmoothScroll {
   constructor() {
     this.initializeNavigation();
   }

   initializeNavigation() {
     // Smooth scrolling for anchor links
     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
       anchor.addEventListener('click', (e) => {
         e.preventDefault();
         const target = document.querySelector(anchor.getAttribute('href'));
         if (target) {
           const headerHeight = document.querySelector('.header').offsetHeight;
           const targetPosition = target.offsetTop - headerHeight - 20;
           
           window.scrollTo({
             top: targetPosition,
             behavior: 'smooth'
           });
         }
       });
     });

     // Mobile navigation toggle
     const navToggle = document.querySelector('.nav-toggle');
     const navMenu = document.querySelector('.nav-menu');
     
     if (navToggle && navMenu) {
       navToggle.addEventListener('click', () => {
         navMenu.classList.toggle('nav-menu-active');
         navToggle.classList.toggle('nav-toggle-active');
       });
     }
   }
 }

 // Initialize everything when DOM is loaded
 document.addEventListener('DOMContentLoaded', async () => {
   console.log('🎥 Personal Creator Website - Initializing...');
   
   try {
     // Initialize YouTube API
     if (CONFIG.youtube.apiKey && CONFIG.youtube.channelId) {
       const youtube = new YouTubeAPI();
       
       // Load videos
       const videos = await youtube.fetchChannelVideos();
       youtube.renderVideos(videos);
       
       // Load playlists if enabled
       if (CONFIG.youtube.showPlaylists) {
         const playlists = await youtube.fetchChannelPlaylists();
         youtube.renderPlaylists(playlists);
       }
       
       console.log('✅ YouTube integration loaded');
     } else {
       console.warn('⚠️ YouTube API not configured');
     }
     
     // Initialize Contact Form
     if (CONFIG.contactForm.service !== 'none') {
       new ContactForm();
       console.log('✅ Contact form initialized');
     }
     
     // Initialize Smooth Scrolling
     new SmoothScroll();
     console.log('✅ Navigation initialized');
     
     console.log('🎉 Website fully loaded!');
   } catch (error) {
     console.error('❌ Error initializing website:', error);
   }
 });

 // Export for potential future use
 if (typeof module !== 'undefined' && module.exports) {
   module.exports = { YouTubeAPI, ContactForm, SmoothScroll };
 }`;

   fs.writeFileSync('script.js', js);
 }

 // Check if config exists and offer to use it or create new
 if (fs.existsSync('config.json')) {
   (async () => {
     const useExisting = await question(colors.yellow + 'Found existing config.json. Use existing config? (y/n): ' + colors.reset);
     if (useExisting.toLowerCase() === 'y') {
       try {
         const existingConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));
         console.log(colors.green + 'Using existing configuration...' + colors.reset);
         
         // Generate website files with existing config
         generateHTML(existingConfig);
         displaySuccess('Generated index.html');
         
         generateCSS(existingConfig);
         displaySuccess('Generated style.css');
         
         generateJS(existingConfig);
         displaySuccess('Generated script.js');
         
         console.log(colors.green + colors.bright + '\n🎉 Website regenerated successfully!' + colors.reset);
       } catch (error) {
         console.log(colors.red + '❌ Error reading existing config: ' + error.message + colors.reset);
         console.log(colors.yellow + 'Starting fresh setup...' + colors.reset);
         setup();
       }
     } else {
       setup();
     }
     rl.close();
   })();
 } else {
   setup();
 }