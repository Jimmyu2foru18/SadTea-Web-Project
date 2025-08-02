const fs = require('fs');
const path = require('path');

class FileGenerators {
  constructor() {
    this.outputDir = process.cwd();
  }

  generateHTML(config) {
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
                    ${this.generateSocialLinks(config.socialMedia)}
                </div>
                <div class="hero-cta">
                    <a href="#videos" class="btn btn-primary">Watch Latest Videos</a>
                    ${config.merchandise.enabled ? '<a href="#merch" class="btn btn-secondary">Shop Merch</a>' : ''}
                </div>
            </div>
        </section>

        ${config.streaming && config.streaming.twitch.enabled ? this.generateTwitchSection(config.streaming) : ''}

        ${config.youtube.showLiveVideos ? this.generateLiveVideosSection() : ''}

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

        ${config.youtube.showPlaylists ? this.generatePlaylistsSection() : ''}

        ${config.merchandise.enabled ? this.generateMerchSection(config.merchandise) : ''}

        <section id="contact" class="contact-section">
            <div class="container">
                <h2 class="section-title">Get In Touch</h2>
                <div class="contact-container">
                    <div class="contact-info">
                        <h3>Let's Connect!</h3>
                        <p>Have a question, collaboration idea, or just want to say hi? I'd love to hear from you!</p>
                        ${config.contactForm.email ? `<p class="contact-email"><i class="fas fa-envelope"></i> ${config.contactForm.email}</p>` : ''}
                        <div class="contact-social">
                            ${this.generateSocialLinks(config.socialMedia, true)}
                        </div>
                    </div>
                    ${config.contactForm.enabled ? this.generateContactForm(config.contactForm) : ''}
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <p class="footer-copyright">${config.copyright?.text || config.copyright || ''}</p>
                ${config.showCredit ? '<p class="footer-credit">Website powered by <a href="https://github.com/Jimmyu2foru18/" target="_blank">Jimmyu2foru18/</a></p>' : ''}
            </div>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(this.outputDir, 'index.html'), html);
    return html;
  }

  generateSocialLinks(socialMedia, compact = false) {
    const platforms = [
      { key: 'youtube', icon: 'fab fa-youtube', name: 'YouTube' },
      { key: 'instagram', icon: 'fab fa-instagram', name: 'Instagram' },
      { key: 'twitter', icon: 'fab fa-twitter', name: 'Twitter' },
      { key: 'tiktok', icon: 'fab fa-tiktok', name: 'TikTok' },
      { key: 'discord', icon: 'fab fa-discord', name: 'Discord' },
      { key: 'twitch', icon: 'fab fa-twitch', name: 'Twitch' },
      { key: 'facebook', icon: 'fab fa-facebook', name: 'Facebook' },
      { key: 'linkedin', icon: 'fab fa-linkedin', name: 'LinkedIn' },
      { key: 'kick', icon: 'fas fa-gamepad', name: 'Kick' }
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

  generateTwitchSection(streaming) {
    if (!streaming.twitch.enabled) return '';
    
    const chatWidth = streaming.twitch.showChat ? '40%' : '100%';
    const streamWidth = streaming.twitch.showChat ? '60%' : '100%';
    
    return `
        <section id="twitch-stream" class="twitch-section">
            <div class="container">
                <h2 class="section-title">Live Stream</h2>
                <div class="twitch-container">
                    <div class="twitch-player" style="width: ${streamWidth};">
                        <iframe
                            src="https://player.twitch.tv/?channel=${streaming.twitch.username}&parent=localhost&autoplay=false&muted=false"
                            height="400"
                            width="550"
                            allowfullscreen="true"
                            scrolling="no"
                            frameborder="0">
                        </iframe>
                    </div>
                    ${streaming.twitch.showChat ? `
                    <div class="twitch-chat" style="width: ${chatWidth};">
                        <iframe
                            src="https://www.twitch.tv/embed/${streaming.twitch.username}/chat?parent=localhost"
                            height="400"
                            width="200"
                            frameborder="0"
                            scrolling="no">
                        </iframe>
                    </div>` : ''}
                </div>
                <div class="twitch-info">
                    <p>Watch live on <a href="https://twitch.tv/${streaming.twitch.username}" target="_blank" rel="noopener noreferrer">Twitch</a></p>
                </div>
            </div>
        </section>`;
  }

  generateLiveVideosSection() {
    return `
        <section id="live-videos" class="live-videos-section">
            <div class="container">
                <h2 class="section-title">Live Videos</h2>
                <div id="live-videos-container" class="videos-grid">
                    <div class="loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Loading live videos...</p>
                    </div>
                </div>
            </div>
        </section>`;
  }

  generatePlaylistsSection() {
    return `
        <section id="playlists" class="playlists-section">
            <div class="container">
                <h2 class="section-title">Video Playlists</h2>
                <div id="playlists-container" class="videos-grid">
                    <div class="loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Loading playlists...</p>
                    </div>
                </div>
            </div>
        </section>`;
  }

  generateMerchSection(merchandise) {
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

  generateContactForm(contactForm) {
    if (contactForm.service === 'formspree') {
      return `
                    <div class="contact-form-container">
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
                        </form>
                    </div>`;
    } else if (contactForm.service === 'emailjs') {
      return `
                    <div class="contact-form-container">
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
                        </form>
                    </div>`;
    } else if (contactForm.service === 'mailto') {
      return `
                    <div class="contact-form-container">
                        <div class="mailto-contact">
                            <h3>Get In Touch</h3>
                            <p>Click the button below to send me an email directly!</p>
                            <a href="mailto:${contactForm.email}?subject=Contact%20from%20Website" class="btn btn-primary">
                                <i class="fas fa-envelope"></i>
                                Send Email
                            </a>
                        </div>
                    </div>`;
    }
    return '';
  }

  generateCSS(config) {
    const css = this.buildCSS(config);
    fs.writeFileSync(path.join(this.outputDir, 'style.css'), css);
  }

  generateJS(config) {
    const js = this.buildJS(config);
    fs.writeFileSync(path.join(this.outputDir, 'script.js'), js);
  }

  buildCSS(config) {
    // Determine if theme uses dark backgrounds
    const isDarkTheme = config.theme?.style === 'dark' || config.theme?.style === 'gaming' || 
                       (config.theme?.backgroundColor && 
                        (config.theme.backgroundColor.toLowerCase().includes('#0') || 
                         config.theme.backgroundColor.toLowerCase().includes('black') ||
                         config.theme.backgroundColor === '#0a0a0a'));
    
    return `/* Personal Creator Website - Advanced Styles */

/* CSS Variables for Theme */
:root {
  --primary-color: ${config.theme?.primaryColor || '#3498db'};
  --secondary-color: ${config.theme?.secondaryColor || '#2ecc71'};
  --background-color: ${config.theme?.backgroundColor || '#ffffff'};
  --text-color: ${config.theme?.textColor || '#333333'};
  --accent-color: ${config.theme?.accentColor || '#e74c3c'};
  --heading-color: ${config.theme?.headingColor || config.theme?.textColor || '#2c3e50'};
  --body-text-color: ${config.theme?.bodyTextColor || config.theme?.textColor || '#333333'};
  --link-color: ${config.theme?.linkColor || config.theme?.primaryColor || '#3498db'};
  --primary-font: '${config.theme?.fonts?.primary || 'Inter'}', sans-serif;
  --secondary-font: '${config.theme?.fonts?.secondary || 'Inter'}', sans-serif;
  
  /* Advanced Design Variables */
  --border-radius: 12px;
  --border-radius-lg: 20px;
  --border-radius-sm: 8px;
  --box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  --box-shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.15);
  --box-shadow-hover: 0 15px 35px rgba(0, 0, 0, 0.2);
  --transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: all 0.2s ease;
  --gradient-primary: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  --gradient-accent: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  --backdrop-blur: blur(20px);
  --section-padding: 6rem 0;
  --container-padding: 2rem;
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
  color: var(--body-text-color);
  background-color: var(--background-color);
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--primary-font);
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 1rem;
  color: var(--heading-color);
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }

p {
  margin-bottom: 1rem;
}

a {
  text-decoration: none;
  color: var(--link-color);
  transition: var(--transition);
}

a:hover {
  color: var(--secondary-color);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: var(--border-radius);
  font-family: var(--primary-font);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;
  min-width: 150px;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--box-shadow);
}

.btn-primary:hover {
  background: var(--gradient-accent);
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--box-shadow-hover);
}

.btn-secondary {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--box-shadow-hover);
}

/* Header */
.header {
  background-color: ${isDarkTheme ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
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
  align-items: center;
  gap: 1.5rem;
  margin: 3rem 0;
  flex-wrap: wrap;
  padding: 2rem;
  background: ${config.theme.style === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'};
  border-radius: var(--border-radius-lg);
  backdrop-filter: var(--backdrop-blur);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 1rem 1.5rem;
  background: var(--gradient-primary);
  border-radius: var(--border-radius);
  text-decoration: none;
  color: white;
  font-weight: 600;
  transition: var(--transition);
  box-shadow: var(--box-shadow);
  min-width: 120px;
}

.social-link:hover {
  background: var(--gradient-accent);
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--box-shadow-hover);
}

.social-link i {
  font-size: 1.2rem;
}

/* Sections */
.section-title {
  text-align: center;
  margin-bottom: 4rem;
  color: var(--primary-color);
  position: relative;
  font-size: 2.5rem;
  font-weight: 700;
}

.section-title::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius-sm);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 2px;
  background: var(--gradient-accent);
  border-radius: 2px;
}

/* Videos Section */
.videos-section {
  padding: var(--section-padding);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0.02) 100%);
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  margin-top: 2rem;
}

.video-card {
  background-color: ${isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.video-thumbnail {
  background-color: ${isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.live-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ff0000;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 2;
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
  color: ${isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
  font-size: 0.9rem;
}

/* Twitch Section */
.twitch-section {
  padding: var(--section-padding);
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.05) 0%, rgba(75, 0, 130, 0.05) 100%);
}

.twitch-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.twitch-player {
  flex: 1;
  min-width: 300px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--box-shadow-lg);
}

.twitch-player iframe {
  width: 100%;
  height: 400px;
  border: none;
}

.twitch-chat {
  flex: 0 0 350px;
  min-width: 300px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--box-shadow-lg);
}

.twitch-chat iframe {
  width: 100%;
  height: 400px;
  border: none;
}

.twitch-info {
  text-align: center;
  margin-top: 2rem;
}

.twitch-info a {
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  background: rgba(138, 43, 226, 0.1);
  transition: var(--transition);
}

.twitch-info a:hover {
  background: rgba(138, 43, 226, 0.2);
  transform: translateY(-2px);
}

/* Contact Section */
.contact-section {
  padding: var(--section-padding);
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.03) 0%, rgba(155, 89, 182, 0.03) 100%);
}

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.contact-info {
  padding: 2rem;
  background: ${isDarkTheme ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.8)'};
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow);
  backdrop-filter: var(--backdrop-blur);
}

.contact-info h3 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.contact-email {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: ${isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(52, 152, 219, 0.1)'};
  border-radius: var(--border-radius);
  font-weight: 500;
}

.contact-social {
  margin-top: 2rem;
}

.social-link-compact {
  padding: 0.8rem;
  margin: 0.3rem;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  color: white;
  transition: var(--transition);
}

.social-link-compact:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: var(--box-shadow-hover);
}

/* Contact Form */
.contact-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.contact-form {
  background: ${isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.95)'};
  padding: 2.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-lg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  width: 100%;
  max-width: 600px;
}

.mailto-contact {
  background: ${isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.95)'};
  padding: 3rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-lg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  text-align: center;
  width: 100%;
  max-width: 600px;
}

.mailto-contact h3 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.mailto-contact p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
  color: var(--text-color);
}

.form-group {
  margin-bottom: 2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.8rem;
  font-weight: 600;
  color: var(--text-color);
  font-size: 1.1rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 2px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: var(--border-radius);
  font-family: var(--secondary-font);
  font-size: 1rem;
  background: ${isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)'};
  color: var(--text-color);
  transition: var(--transition);
  backdrop-filter: blur(10px);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.15);
  transform: translateY(-2px);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

/* Footer */
.footer {
  background: ${isDarkTheme ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.95))' : 'linear-gradient(135deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.08))'};
  padding: 3rem 0;
  text-align: center;
  backdrop-filter: var(--backdrop-blur);
  border-top: 1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-copyright {
  margin: 0;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 500;
}

.footer-credit {
  margin: 0;
  font-size: 0.95rem;
  color: ${isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
  padding: 0.8rem 1.5rem;
  background: ${isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  border-radius: var(--border-radius);
  backdrop-filter: blur(10px);
}

.footer-credit a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
}

.footer-credit a:hover {
  color: var(--secondary-color);
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
@media (max-width: 1024px) {
  .twitch-container {
    flex-direction: column;
    align-items: center;
  }
  
  .twitch-player,
  .twitch-chat {
    flex: none;
    width: 100%;
    max-width: 600px;
  }
}

@media (max-width: 768px) {
  :root {
    --section-padding: 4rem 0;
    --container-padding: 1rem;
  }
  
  .container {
    padding: 0 var(--container-padding);
  }
  
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
    gap: 1rem;
  }
  
  .social-links {
    gap: 1rem;
    padding: 1.5rem;
  }
  
  .social-link {
    min-width: 100px;
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .videos-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .contact-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-form {
    padding: 2rem;
  }
  
  .btn {
    min-width: 120px;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
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
  
  .videos-grid {
    grid-template-columns: 1fr;
  }
}`;
  }

  buildJS(config) {
    return `// Personal Creator Website - Generated JavaScript

// Configuration
const CONFIG = {
  youtube: {
    apiKey: "${config.youtube.apiKey}",
    channelId: "${config.youtube.channelId}",
    maxVideos: ${config.youtube.maxVideos},
    showPlaylists: ${config.youtube.showPlaylists || false},
    maxPlaylists: ${config.youtube.maxPlaylists || 0},
    showLiveVideos: ${config.youtube.showLiveVideos || false},
    maxLiveVideos: ${config.youtube.maxLiveVideos || 0}
  },
  contactForm: {
    service: "${config.contactForm?.service || ''}",
    ${config.contactForm?.service === 'emailjs' ? `emailjs: {
      serviceId: "${config.contactForm.emailjs?.serviceId || ''}",
      templateId: "${config.contactForm.emailjs?.templateId || ''}",
      publicKey: "${config.contactForm.emailjs?.publicKey || ''}"
    }` : ''}
    ${config.contactForm?.service === 'formspree' ? `formspreeId: "${config.contactForm.formspreeId || ''}"` : ''}
  }
};

// YouTube API Class
class YouTubeAPI {
  constructor() {
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    this.apiKey = CONFIG.youtube.apiKey;
    this.channelId = CONFIG.youtube.channelId;
  }

  async fetchChannelVideos() {
    if (!this.apiKey || !this.channelId) {
      console.error('YouTube API key or Channel ID not configured');
      return [];
    }
    
    try {
      // First, get the channel's uploads playlist ID
      const channelUrl = \`\${this.baseUrl}/channels?key=\${this.apiKey}&id=\${this.channelId}&part=contentDetails\`;
      const channelResponse = await fetch(channelUrl);
      
      if (!channelResponse.ok) {
        throw new Error('YouTube API error: ' + channelResponse.statusText);
      }
      
      const channelData = await channelResponse.json();
      if (!channelData.items || channelData.items.length === 0) {
        throw new Error('Channel not found');
      }
      
      const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
      
      // Then get the videos from the uploads playlist
      const videosUrl = \`\${this.baseUrl}/playlistItems?key=\${this.apiKey}&playlistId=\${uploadsPlaylistId}&part=snippet&maxResults=\${CONFIG.youtube.maxVideos}&order=date\`;
      const videosResponse = await fetch(videosUrl);
      
      if (!videosResponse.ok) {
        throw new Error('YouTube API error: ' + videosResponse.statusText);
      }
      
      const videosData = await videosResponse.json();
      return videosData.items || [];
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      return [];
    }
  }

  renderVideos(videos) {
    const container = document.getElementById('videos-container');
    if (!videos || videos.length === 0) {
      container.innerHTML = '<div class="loading"><p>No videos found or API key not configured.</p></div>';
      return;
    }

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    videos.forEach(video => {
      const videoId = video.snippet.resourceId ? video.snippet.resourceId.videoId : video.id.videoId;
      const title = video.snippet.title;
      const thumbnail = video.snippet.thumbnails.medium.url;
      const publishedAt = new Date(video.snippet.publishedAt).toLocaleDateString();
      const videoUrl = \`https://www.youtube.com/watch?v=\${videoId}\`;

      const videoCard = document.createElement('div');
      videoCard.className = 'video-card';
      videoCard.innerHTML = \`
        <div class="video-thumbnail">
          <a href="\${videoUrl}" target="_blank" rel="noopener noreferrer">
            <img src="\${thumbnail}" alt="\${title}" loading="lazy">
          </a>
        </div>
        <div class="video-info">
          <h3 class="video-title"><a href="\${videoUrl}" target="_blank" rel="noopener noreferrer">\${title}</a></h3>
          <p class="video-date">\${publishedAt}</p>
        </div>
      \`;
      
      fragment.appendChild(videoCard);
    });
    
    container.appendChild(fragment);
  }

  async fetchPlaylists() {
    if (!this.apiKey || !this.channelId) {
      console.error('YouTube API key or Channel ID not configured');
      return [];
    }
    
    try {
      const url = \`\${this.baseUrl}/playlists?key=\${this.apiKey}&channelId=\${this.channelId}&part=snippet,contentDetails&maxResults=\${CONFIG.youtube.maxPlaylists}\`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('YouTube API error: ' + response.statusText);
      }
      
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching YouTube playlists:', error);
      return [];
    }
  }

  renderPlaylists(playlists) {
    const container = document.getElementById('playlists-container');
    if (!container) return;
    
    if (!playlists || playlists.length === 0) {
      container.innerHTML = '<div class="loading"><p>No playlists found or API key not configured.</p></div>';
      return;
    }

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    playlists.forEach(playlist => {
      const playlistId = playlist.id;
      const title = playlist.snippet.title;
      const thumbnail = playlist.snippet.thumbnails.medium.url;
      const videoCount = playlist.contentDetails.itemCount;
      const playlistUrl = \`https://www.youtube.com/playlist?list=\${playlistId}\`;

      const playlistCard = document.createElement('div');
      playlistCard.className = 'video-card';
      playlistCard.innerHTML = \`
        <div class="video-thumbnail">
          <a href="\${playlistUrl}" target="_blank" rel="noopener noreferrer">
            <img src="\${thumbnail}" alt="\${title}" loading="lazy">
          </a>
        </div>
        <div class="video-info">
          <h3 class="video-title"><a href="\${playlistUrl}" target="_blank" rel="noopener noreferrer">\${title}</a></h3>
          <p class="video-date">\${videoCount} videos</p>
        </div>
      \`;
      
      fragment.appendChild(playlistCard);
    });
    
    container.appendChild(fragment);
  }

  async fetchLiveVideos() {
    if (!this.apiKey || !this.channelId) {
      console.error('YouTube API key or Channel ID not configured');
      return [];
    }
    
    try {
      // First, get the channel's uploads playlist ID
      const channelUrl = \`\${this.baseUrl}/channels?key=\${this.apiKey}&id=\${this.channelId}&part=contentDetails\`;
      const channelResponse = await fetch(channelUrl);
      
      if (!channelResponse.ok) {
        throw new Error('YouTube API error: ' + channelResponse.statusText);
      }
      
      const channelData = await channelResponse.json();
      if (!channelData.items || channelData.items.length === 0) {
        throw new Error('Channel not found');
      }
      
      const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
      
      // Then get recent videos from the uploads playlist (treating as "live" section)
      const videosUrl = \`\${this.baseUrl}/playlistItems?key=\${this.apiKey}&playlistId=\${uploadsPlaylistId}&part=snippet&maxResults=\${CONFIG.youtube.maxLiveVideos}&order=date\`;
      const videosResponse = await fetch(videosUrl);
      
      if (!videosResponse.ok) {
        throw new Error('YouTube API error: ' + videosResponse.statusText);
      }
      
      const videosData = await videosResponse.json();
      return videosData.items || [];
    } catch (error) {
      console.error('Error fetching YouTube live videos:', error);
      return [];
    }
  }

  renderLiveVideos(videos) {
    const container = document.getElementById('live-videos-container');
    if (!container) return;
    
    if (!videos || videos.length === 0) {
      container.innerHTML = '<div class="loading"><p>No recent videos found.</p></div>';
      return;
    }

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    videos.forEach(video => {
      const videoId = video.snippet.resourceId ? video.snippet.resourceId.videoId : video.id.videoId;
      const title = video.snippet.title;
      const thumbnail = video.snippet.thumbnails.medium.url;
      const publishedAt = new Date(video.snippet.publishedAt).toLocaleDateString();
      const videoUrl = \`https://www.youtube.com/watch?v=\${videoId}\`;

      const videoCard = document.createElement('div');
      videoCard.className = 'video-card';
      videoCard.innerHTML = \`
        <div class="video-thumbnail">
          <a href="\${videoUrl}" target="_blank" rel="noopener noreferrer">
            <img src="\${thumbnail}" alt="\${title}" loading="lazy">
          </a>
        </div>
        <div class="video-info">
          <h3 class="video-title"><a href="\${videoUrl}" target="_blank" rel="noopener noreferrer">\${title}</a></h3>
          <p class="video-date">\${publishedAt}</p>
        </div>
      \`;
      
      fragment.appendChild(videoCard);
    });
    
    container.appendChild(fragment);
  }
}

// Contact Form Class
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
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;

    try {
      if (CONFIG.contactForm.service === 'emailjs') {
        await this.sendWithEmailJS();
      }
      
      this.showMessage('Message sent successfully!', 'success');
      this.form.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      this.showMessage('Failed to send message. Please try again.', 'error');
    } finally {
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
    const messageEl = document.createElement('div');
    messageEl.className = \`form-message form-message-\${type}\`;
    messageEl.textContent = message;
    
    this.form.parentNode.insertBefore(messageEl, this.form.nextSibling);
    
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
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎥 Personal Creator Website - Initializing...');
  
  try {
    if (CONFIG.youtube.apiKey && CONFIG.youtube.channelId) {
      const youtube = new YouTubeAPI();
      
      // Load main videos
      const videos = await youtube.fetchChannelVideos();
      youtube.renderVideos(videos);
      console.log('✅ YouTube videos loaded');
      
      // Load playlists if enabled
      if (CONFIG.youtube.showPlaylists) {
        const playlists = await youtube.fetchPlaylists();
        youtube.renderPlaylists(playlists);
        console.log('✅ YouTube playlists loaded');
      }
      
      // Load live videos if enabled
      if (CONFIG.youtube.showLiveVideos) {
        const liveVideos = await youtube.fetchLiveVideos();
        youtube.renderLiveVideos(liveVideos);
        console.log('✅ YouTube live videos loaded');
      }
      
      console.log('✅ YouTube integration loaded');
    } else {
      console.warn('⚠️ YouTube API not configured');
    }
    
    if (CONFIG.contactForm.service !== 'none') {
      new ContactForm();
      console.log('✅ Contact form initialized');
    }
    
    new SmoothScroll();
    console.log('✅ Navigation initialized');
    
    console.log('🎉 Website fully loaded!');
  } catch (error) {
    console.error('❌ Error initializing website:', error);
  }
});`;
  }

  generateDeployYml() {
    const deployYml = `name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pages: write
      id-token: write
    
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Setup Pages
      uses: actions/configure-pages@v4
    
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: '.'
    
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4`;

    // Create .github/workflows directory if it doesn't exist
    const githubDir = path.join(this.outputDir, '.github');
    const workflowsDir = path.join(githubDir, 'workflows');
    
    if (!fs.existsSync(githubDir)) {
      fs.mkdirSync(githubDir);
    }
    
    if (!fs.existsSync(workflowsDir)) {
      fs.mkdirSync(workflowsDir);
    }
    
    fs.writeFileSync(path.join(workflowsDir, 'deploy.yml'), deployYml);
  }

  createAssetsFolder() {
    const assetsPath = path.join(this.outputDir, 'assets');
    if (!fs.existsSync(assetsPath)) {
      fs.mkdirSync(assetsPath);
    }
  }
}

module.exports = FileGenerators;