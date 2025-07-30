const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const config = {};

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupProject() {
  console.log('🎥 Welcome to Personal Creator Website Setup!');
  console.log('Please provide the following information:\n');

  // Basic Information
  config.creatorName = await askQuestion('Enter your name/brand name: ');
  config.websiteTitle = await askQuestion('Enter your website title: ');
  config.description = await askQuestion('Enter a brief description of your content: ');

  // YouTube Configuration
  console.log('\n🎬 YouTube Configuration:');
  config.youtube = {
    apiKey: await askQuestion('Enter your YouTube Data API key: '),
    channelId: await askQuestion('Enter your YouTube Channel ID: '),
    channelUrl: await askQuestion('Enter your YouTube channel URL: '),
    maxVideos: await askQuestion('How many recent videos to display? (default: 6): ') || '6'
  };

  // Social Media Links
  console.log('\n📱 Social Media Links (press Enter to skip):');
  config.socialMedia = {
    instagram: await askQuestion('Instagram URL: '),
    twitter: await askQuestion('Twitter/X URL: '),
    tiktok: await askQuestion('TikTok URL: '),
    discord: await askQuestion('Discord URL: '),
    twitch: await askQuestion('Twitch URL: '),
    facebook: await askQuestion('Facebook URL: ')
  };

  // Merchandise Configuration
  console.log('\n👕 Merchandise Configuration:');
  const merchType = await askQuestion('Merchandise platform (teespring/shopify/custom/none): ');
  config.merchandise = {
    platform: merchType,
    url: '',
    embedCode: ''
  };

  if (merchType !== 'none') {
    if (merchType === 'teespring') {
      config.merchandise.url = await askQuestion('Enter your Teespring store URL: ');
    } else if (merchType === 'shopify') {
      config.merchandise.embedCode = await askQuestion('Enter your Shopify Buy Button embed code: ');
    } else if (merchType === 'custom') {
      config.merchandise.url = await askQuestion('Enter your custom merchandise store URL: ');
    }
  }

  // Contact Form Configuration
  console.log('\n📬 Contact Form Configuration:');
  const formService = await askQuestion('Contact form service (formspree/emailjs): ');
  config.contactForm = {
    service: formService,
    endpoint: '',
    email: await askQuestion('Enter your contact email: ')
  };

  if (formService === 'formspree') {
    config.contactForm.endpoint = await askQuestion('Enter your Formspree form ID: ');
  } else if (formService === 'emailjs') {
    config.contactForm.serviceId = await askQuestion('Enter your EmailJS Service ID: ');
    config.contactForm.templateId = await askQuestion('Enter your EmailJS Template ID: ');
    config.contactForm.publicKey = await askQuestion('Enter your EmailJS Public Key: ');
  }

  // Color Theme
  console.log('\n🎨 Theme Configuration:');
  config.theme = {
    primaryColor: await askQuestion('Primary color (hex code, e.g., #ff6b6b): ') || '#ff6b6b',
    secondaryColor: await askQuestion('Secondary color (hex code, e.g., #4ecdc4): ') || '#4ecdc4',
    backgroundColor: await askQuestion('Background color (hex code, e.g., #f8f9fa): ') || '#f8f9fa'
  };

  // Save configuration
  const configPath = path.join(__dirname, 'config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  console.log('\n✅ Configuration saved to config.json');
  console.log('🚀 Generating your website files...');
  
  // Generate website files
  generateWebsiteFiles(config);
  
  rl.close();
}

function generateWebsiteFiles(config) {
  // Generate HTML
  generateHTML(config);
  // Generate CSS
  generateCSS(config);
  // Generate JavaScript
  generateJS(config);
  // Create assets folder
  if (!fs.existsSync('assets')) {
    fs.mkdirSync('assets');
  }
  
  console.log('\n🎉 Website generated successfully!');
  console.log('📁 Files created:');
  console.log('  - index.html');
  console.log('  - style.css');
  console.log('  - script.js');
  console.log('  - config.json');
  console.log('  - assets/ (folder)');
  console.log('\n🌐 Open index.html in your browser to view your website!');
}

function generateHTML(config) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.websiteTitle}</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">
                <h1>${config.creatorName}</h1>
            </div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#videos">Videos</a></li>
                ${config.merchandise.platform !== 'none' ? '<li><a href="#merch">Merch</a></li>' : ''}
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <div class="hero-content">
                <h2>Welcome to ${config.creatorName}</h2>
                <p>${config.description}</p>
                <div class="social-links">
                    ${generateSocialLinks(config.socialMedia)}
                </div>
            </div>
        </section>

        <section id="videos" class="videos-section">
            <h2>Latest Videos</h2>
            <div id="videos-container" class="videos-grid">
                <div class="loading">Loading videos...</div>
            </div>
        </section>

        ${config.merchandise.platform !== 'none' ? generateMerchSection(config.merchandise) : ''}

        <section id="contact" class="contact-section">
            <h2>Get In Touch</h2>
            <div class="contact-container">
                <div class="contact-info">
                    <h3>Contact Information</h3>
                    <p><i class="fas fa-envelope"></i> ${config.contactForm.email}</p>
                </div>
                <div class="contact-form">
                    ${generateContactForm(config.contactForm)}
                </div>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 ${config.creatorName}. All rights reserved.</p>
    </footer>

    <script src="script.js"></script>
    ${config.contactForm.service === 'emailjs' ? '<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>' : ''}
</body>
</html>`;

  fs.writeFileSync('index.html', html);
}

function generateSocialLinks(socialMedia) {
  let links = '';
  const icons = {
    instagram: 'fab fa-instagram',
    twitter: 'fab fa-twitter',
    tiktok: 'fab fa-tiktok',
    discord: 'fab fa-discord',
    twitch: 'fab fa-twitch',
    facebook: 'fab fa-facebook'
  };

  for (const [platform, url] of Object.entries(socialMedia)) {
    if (url) {
      links += `<a href="${url}" target="_blank"><i class="${icons[platform]}"></i></a>\n                    `;
    }
  }
  return links;
}

function generateMerchSection(merchandise) {
  if (merchandise.platform === 'teespring') {
    return `
        <section id="merch" class="merch-section">
            <h2>Merchandise</h2>
            <div class="merch-container">
                <iframe src="${merchandise.url}?embed=true" width="320" height="420" frameborder="0" scrolling="no"></iframe>
            </div>
        </section>`;
  } else if (merchandise.platform === 'shopify') {
    return `
        <section id="merch" class="merch-section">
            <h2>Merchandise</h2>
            <div class="merch-container">
                ${merchandise.embedCode}
            </div>
        </section>`;
  } else {
    return `
        <section id="merch" class="merch-section">
            <h2>Merchandise</h2>
            <div class="merch-container">
                <a href="${merchandise.url}" target="_blank" class="merch-link">Visit Our Store</a>
            </div>
        </section>`;
  }
}

function generateContactForm(contactForm) {
  if (contactForm.service === 'formspree') {
    return `<form action="https://formspree.io/f/${contactForm.endpoint}" method="POST">
                        <input type="text" name="name" placeholder="Your Name" required>
                        <input type="email" name="_replyto" placeholder="Your Email" required>
                        <textarea name="message" placeholder="Your Message" required></textarea>
                        <button type="submit">Send Message</button>
                    </form>`;
  } else {
    return `<form id="contact-form">
                        <input type="text" name="name" placeholder="Your Name" required>
                        <input type="email" name="email" placeholder="Your Email" required>
                        <textarea name="message" placeholder="Your Message" required></textarea>
                        <button type="submit">Send Message</button>
                    </form>`;
  }
}

function generateCSS(config) {
  const css = `/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: ${config.theme.backgroundColor};
}

/* Header Styles */
header {
    background: linear-gradient(135deg, ${config.theme.primaryColor}, ${config.theme.secondaryColor});
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.logo h1 {
    font-size: 1.8rem;
    font-weight: bold;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.3s;
}

.nav-links a:hover {
    opacity: 0.8;
}

/* Main Content */
main {
    margin-top: 80px;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, ${config.theme.primaryColor}20, ${config.theme.secondaryColor}20);
    padding: 4rem 2rem;
    text-align: center;
}

.hero-content h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: ${config.theme.primaryColor};
}

.hero-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

/* Social Links */
.social-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
}

.social-links a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: ${config.theme.primaryColor};
    color: white;
    border-radius: 50%;
    text-decoration: none;
    font-size: 1.5rem;
    transition: transform 0.3s, background-color 0.3s;
}

.social-links a:hover {
    transform: translateY(-3px);
    background: ${config.theme.secondaryColor};
}

/* Videos Section */
.videos-section {
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.videos-section h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: ${config.theme.primaryColor};
}

.videos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.video-item {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.video-item:hover {
    transform: translateY(-5px);
}

.video-item iframe {
    width: 100%;
    height: 200px;
}

.video-info {
    padding: 1rem;
}

.video-info h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #333;
}

.loading {
    text-align: center;
    font-size: 1.2rem;
    color: ${config.theme.primaryColor};
    grid-column: 1 / -1;
}

/* Merchandise Section */
.merch-section {
    padding: 4rem 2rem;
    background: ${config.theme.backgroundColor};
    text-align: center;
}

.merch-section h2 {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: ${config.theme.primaryColor};
}

.merch-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
}

.merch-link {
    display: inline-block;
    background: ${config.theme.primaryColor};
    color: white;
    padding: 1rem 2rem;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    transition: background-color 0.3s;
}

.merch-link:hover {
    background: ${config.theme.secondaryColor};
}

/* Contact Section */
.contact-section {
    padding: 4rem 2rem;
    background: linear-gradient(135deg, ${config.theme.primaryColor}10, ${config.theme.secondaryColor}10);
}

.contact-section h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: ${config.theme.primaryColor};
}

.contact-container {
    max-width: 800px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
}

.contact-info h3 {
    margin-bottom: 1rem;
    color: ${config.theme.primaryColor};
}

.contact-info p {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.contact-form form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-form input,
.contact-form textarea {
    padding: 1rem;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.contact-form input:focus,
.contact-form textarea:focus {
    outline: none;
    border-color: ${config.theme.primaryColor};
}

.contact-form textarea {
    min-height: 120px;
    resize: vertical;
}

.contact-form button {
    background: ${config.theme.primaryColor};
    color: white;
    padding: 1rem;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
}

.contact-form button:hover {
    background: ${config.theme.secondaryColor};
}

/* Footer */
footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-links {
        display: none;
    }
    
    .hero-content h2 {
        font-size: 2rem;
    }
    
    .contact-container {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .videos-grid {
        grid-template-columns: 1fr;
    }
}`;

  fs.writeFileSync('style.css', css);
}

function generateJS(config) {
  const js = `// Configuration loaded from setup
const CONFIG = ${JSON.stringify(config, null, 2)};

// YouTube API Integration
class YouTubeAPI {
    constructor() {
        this.apiKey = CONFIG.youtube.apiKey;
        this.channelId = CONFIG.youtube.channelId;
        this.maxResults = CONFIG.youtube.maxVideos;
        this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    }

    async fetchLatestVideos() {
        try {
            const response = await fetch(
                \`\${this.baseUrl}/search?key=\${this.apiKey}&channelId=\${this.channelId}&part=snippet,id&order=date&maxResults=\${this.maxResults}&type=video\`
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

    renderVideos(videos) {
        const container = document.getElementById('videos-container');
        
        if (videos.length === 0) {
            container.innerHTML = '<div class="loading">No videos found or API error occurred.</div>';
            return;
        }

        container.innerHTML = videos.map(video => \`
            <div class="video-item">
                <iframe 
                    src="https://www.youtube.com/embed/\${video.id.videoId}" 
                    frameborder="0" 
                    allowfullscreen>
                </iframe>
                <div class="video-info">
                    <h3>\${video.snippet.title}</h3>
                    <p>\${new Date(video.snippet.publishedAt).toLocaleDateString()}</p>
                </div>
            </div>
        \`).join('');
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        if (CONFIG.contactForm.service === 'emailjs') {
            await this.sendWithEmailJS(data);
        }
    }

    async sendWithEmailJS(data) {
        try {
            emailjs.init(CONFIG.contactForm.publicKey);
            
            const result = await emailjs.send(
                CONFIG.contactForm.serviceId,
                CONFIG.contactForm.templateId,
                {
                    from_name: data.name,
                    from_email: data.email,
                    message: data.message,
                    to_email: CONFIG.contactForm.email
                }
            );
            
            alert('Message sent successfully!');
            this.form.reset();
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send message. Please try again.');
        }
    }
}

// Smooth Scrolling for Navigation
class SmoothScroll {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize YouTube API
    const youtube = new YouTubeAPI();
    const videos = await youtube.fetchLatestVideos();
    youtube.renderVideos(videos);
    
    // Initialize Contact Form (only for EmailJS)
    if (CONFIG.contactForm.service === 'emailjs') {
        new ContactForm();
    }
    
    // Initialize Smooth Scrolling
    new SmoothScroll();
    
    console.log('Website initialized successfully!');
});

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { YouTubeAPI, ContactForm, SmoothScroll };
}`;

  fs.writeFileSync('script.js', js);
}

// Check if config exists and offer to use it or create new
if (fs.existsSync('config.json')) {
  rl.question('Found existing config.json. Use existing config? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      const existingConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));
      console.log('Using existing configuration...');
      generateWebsiteFiles(existingConfig);
      rl.close();
    } else {
      setupProject();
    }
  });
} else {
  setupProject();
}