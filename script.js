// Configuration loaded from setup
const CONFIG = {
  "creatorName": "Th3viousGameus",
  "websiteTitle": "Th3vious Website",
  "description": "This is a website for my content",
  "youtube": {
    "apiKey": "AIzaSyBfWEUDtIAfJLp7nLqYvNh5Ra2FbowYJI8",
    "channelId": "UCQjpnt3fOWSyN6JbTkDcPZQ",
    "channelUrl": "https://www.youtube.com/@th3viousgameus",
    "maxVideos": "25"
  },
  "socialMedia": {
    "instagram": "https://www.instagram.com/jimmyu2foru18",
    "twitter": "https://x.com/th3viousgameus",
    "tiktok": "https://www.tiktok.com/@th3viousgameus?lang=en",
    "discord": "https://discord.gg/cq792Zsb6C",
    "twitch": "https://www.twitch.tv/jimmyu2foru18",
    "facebook": "https://www.facebook.com/jimmyu2foru18"
  },
  "merchandise": {
    "platform": "none",
    "url": "",
    "embedCode": ""
  },
  "contactForm": {
    "service": "jimmymcguigan18@gmail.com",
    "endpoint": "",
    "email": "jimmymcguigan18@gmail.com"
  },
  "theme": {
    "primaryColor": "#0000FF",
    "secondaryColor": "#FFFFFF",
    "backgroundColor": "#1E88E5"
  }
};

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
                `${this.baseUrl}/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet,id&order=date&maxResults=${this.maxResults}&type=video`
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

        container.innerHTML = videos.map(video => `
            <div class="video-item">
                <iframe 
                    src="https://www.youtube.com/embed/${video.id.videoId}" 
                    frameborder="0" 
                    allowfullscreen>
                </iframe>
                <div class="video-info">
                    <h3>${video.snippet.title}</h3>
                    <p>${new Date(video.snippet.publishedAt).toLocaleDateString()}</p>
                </div>
            </div>
        `).join('');
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
}