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
                <p class="footer-copyright">${config.copyright}</p>
                ${config.showCredit ? '<p class="footer-credit">Website powered by <a href="https://github.com/Jimmyu2foru18/" target="_blank">Jimmyu2foru18/</a></p>' : ''}
            </div>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(this.outputDir, 'index.html'), html);
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
                    <div class="twitch-chat" style="width: 30%;">
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
                <div id="playlists-container" class="playlists-grid">
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

  generateCSS(config) {
    const css = this.buildCSS(config);
    fs.writeFileSync(path.join(this.outputDir, 'style.css'), css);
  }

  generateJS(config) {
    const js = this.buildJS(config);
    fs.writeFileSync(path.join(this.outputDir, 'script.js'), js);
  }

  buildCSS(config) {
    return `/* Personal Creator Website - Generated Styles */

/* CSS Variables for Theme */
:root {
  --primary-color: ${config.theme.primaryColor};
  --secondary-color: ${config.theme.secondaryColor};
  --background-color: ${config.theme.backgroundColor};
  --text-color: ${config.theme.textColor};
  --accent-color: ${config.theme.accentColor};
  --heading-color: ${config.theme.headingColor || config.theme.textColor};
  --body-text-color: ${config.theme.bodyTextColor || config.theme.textColor};
  --link-color: ${config.theme.linkColor || config.theme.primaryColor};
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
}

.social-link:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
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
  
  .contact-container {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
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
      const url = \`\${this.baseUrl}/search?key=\${this.apiKey}&channelId=\${this.channelId}&part=snippet,id&order=date&maxResults=\${CONFIG.youtube.maxVideos}&type=video\`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('YouTube API error: ' + response.statusText);
      }
      
      const data = await response.json();
      return data.items || [];
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
      const videoId = video.id.videoId;
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
      const videos = await youtube.fetchChannelVideos();
      youtube.renderVideos(videos);
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