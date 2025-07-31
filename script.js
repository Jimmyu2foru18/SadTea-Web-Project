// Configuration from config.json
const CONFIG = {
    youtube: {
        apiKey: 'AIzaSyBfWEUDtIAfJLp7nLqYvNh5Ra2FbowYJI8',
        channelId: 'UCQjpnt3fOWSyN6JbTkDcPZQ',
        maxVideos: 100,
        showPlaylists: true,
        maxPlaylists: 6,
        showLiveVideos: true,
        maxLiveVideos: 66
    },
    streaming: {
        twitch: {
            enabled: true,
            username: 'th3vious',
            showChat: true
        }
    },
    contactForm: {
        enabled: true,
        service: 'formspree',
        email: 'jimmymcguigan18@gmail.com',
        formspreeId: 'th3vious'
    }
};

// YouTube API Integration
class YouTubeAPI {
    constructor(apiKey, channelId) {
        this.apiKey = apiKey;
        this.channelId = channelId;
        this.baseUrl = 'https://www.googleapis.com/youtube/v3';
        this.rateLimitDelay = 100; // ms between requests
        this.lastRequestTime = 0;
    }

    async makeRequest(endpoint, params) {
        // Rate limiting
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.rateLimitDelay) {
            await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest));
        }
        this.lastRequestTime = Date.now();

        const url = new URL(`${this.baseUrl}/${endpoint}`);
        url.searchParams.append('key', this.apiKey);
        
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('YouTube API request failed:', error);
            throw error;
        }
    }

    async fetchVideos(maxResults = 10) {
        try {
            const data = await this.makeRequest('search', {
                part: 'snippet',
                channelId: this.channelId,
                maxResults: maxResults,
                order: 'date',
                type: 'video'
            });
            return data.items || [];
        } catch (error) {
            console.error('Error fetching videos:', error);
            return [];
        }
    }

    async fetchPlaylists(maxResults = 10) {
        try {
            const data = await this.makeRequest('playlists', {
                part: 'snippet,contentDetails',
                channelId: this.channelId,
                maxResults: maxResults
            });
            return data.items || [];
        } catch (error) {
            console.error('Error fetching playlists:', error);
            return [];
        }
    }

    async fetchLiveVideos(maxResults = 10) {
        try {
            const data = await this.makeRequest('search', {
                part: 'snippet',
                channelId: this.channelId,
                maxResults: maxResults,
                order: 'date',
                type: 'video',
                eventType: 'live'
            });
            return data.items || [];
        } catch (error) {
            console.error('Error fetching live videos:', error);
            return [];
        }
    }

    renderVideos(videos, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (videos.length === 0) {
            container.innerHTML = '<p class="no-content">No videos found.</p>';
            return;
        }

        const videosHTML = videos.map(video => {
            const videoId = video.id.videoId;
            const title = video.snippet.title;
            const description = video.snippet.description.substring(0, 100) + '...';
            const thumbnail = video.snippet.thumbnails.medium.url;
            const publishedAt = new Date(video.snippet.publishedAt).toLocaleDateString();

            return `
                <div class="video-card">
                    <div class="video-thumbnail">
                        <img src="${thumbnail}" alt="${title}" loading="lazy">
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">
                            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">${title}</a>
                        </h3>
                        <p class="video-description">${description}</p>
                        <p class="video-date">Published: ${publishedAt}</p>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = videosHTML;
    }

    renderPlaylists(playlists, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (playlists.length === 0) {
            container.innerHTML = '<p class="no-content">No playlists found.</p>';
            return;
        }

        const playlistsHTML = playlists.map(playlist => {
            const playlistId = playlist.id;
            const title = playlist.snippet.title;
            const description = playlist.snippet.description.substring(0, 100) + '...';
            const thumbnail = playlist.snippet.thumbnails.medium.url;
            const itemCount = playlist.contentDetails.itemCount;

            return `
                <div class="playlist-card">
                    <div class="playlist-thumbnail">
                        <img src="${thumbnail}" alt="${title}" loading="lazy">
                    </div>
                    <div class="playlist-info">
                        <h3 class="playlist-title">
                            <a href="https://www.youtube.com/playlist?list=${playlistId}" target="_blank">${title}</a>
                        </h3>
                        <p class="playlist-description">${description}</p>
                        <p class="playlist-count">${itemCount} videos</p>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = playlistsHTML;
    }

    renderLiveVideos(videos, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (videos.length === 0) {
            container.innerHTML = '<p class="no-content">No live videos found.</p>';
            return;
        }

        const videosHTML = videos.map(video => {
            const videoId = video.id.videoId;
            const title = video.snippet.title;
            const description = video.snippet.description.substring(0, 100) + '...';
            const thumbnail = video.snippet.thumbnails.medium.url;

            return `
                <div class="video-card live-video-card">
                    <div class="video-thumbnail">
                        <img src="${thumbnail}" alt="${title}" loading="lazy">
                        <div class="live-badge">LIVE</div>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">
                            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">${title}</a>
                        </h3>
                        <p class="video-description">${description}</p>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = videosHTML;
    }
}

// Contact Form Handler
class ContactForm {
    constructor(config) {
        this.config = config;
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            if (this.config.service === 'formspree') {
                await this.submitToFormspree(data);
            } else if (this.config.service === 'emailjs') {
                await this.submitToEmailJS(data);
            }
            
            this.showMessage('Message sent successfully!', 'success');
            this.form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async submitToFormspree(data) {
        const response = await fetch(`https://formspree.io/f/${this.config.formspreeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Formspree submission failed');
        }
    }

    async submitToEmailJS(data) {
        // EmailJS implementation would go here
        // This requires EmailJS SDK to be loaded
        throw new Error('EmailJS not implemented in this version');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 5px;
            text-align: center;
            font-weight: 600;
            ${type === 'success' ? 
                'background: rgba(0, 255, 136, 0.1); color: var(--primary-color); border: 1px solid var(--primary-color);' : 
                'background: rgba(255, 51, 102, 0.1); color: var(--accent-color); border: 1px solid var(--accent-color);'
            }
        `;
        
        this.form.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Smooth Scrolling and Navigation
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                    }
                }
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                } else {
                    navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                }
            }
        });
    }
}

// Utility function to show messages
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 10000;
        font-weight: 600;
        max-width: 300px;
        ${type === 'error' ? 
            'background: rgba(255, 51, 102, 0.9); color: white;' : 
            'background: rgba(0, 255, 136, 0.9); color: var(--background-color);'
        }
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize YouTube API
        const youtubeAPI = new YouTubeAPI(CONFIG.youtube.apiKey, CONFIG.youtube.channelId);
        
        // Load and render videos
        const videosLoading = document.getElementById('videos-loading');
        try {
            const videos = await youtubeAPI.fetchVideos(CONFIG.youtube.maxVideos);
            youtubeAPI.renderVideos(videos, 'videos-container');
            if (videosLoading) videosLoading.style.display = 'none';
        } catch (error) {
            console.error('Failed to load videos:', error);
            if (videosLoading) {
                videosLoading.innerHTML = '<p class="error-message">Failed to load videos. Please check your API configuration.</p>';
            }
        }
        
        // Load and render playlists if enabled
        if (CONFIG.youtube.showPlaylists) {
            const playlistsLoading = document.getElementById('playlists-loading');
            try {
                const playlists = await youtubeAPI.fetchPlaylists(CONFIG.youtube.maxPlaylists);
                youtubeAPI.renderPlaylists(playlists, 'playlists-container');
                if (playlistsLoading) playlistsLoading.style.display = 'none';
            } catch (error) {
                console.error('Failed to load playlists:', error);
                if (playlistsLoading) {
                    playlistsLoading.innerHTML = '<p class="error-message">Failed to load playlists.</p>';
                }
            }
        }
        
        // Load and render live videos if enabled
        if (CONFIG.youtube.showLiveVideos) {
            const liveVideosLoading = document.getElementById('live-videos-loading');
            try {
                const liveVideos = await youtubeAPI.fetchLiveVideos(CONFIG.youtube.maxLiveVideos);
                youtubeAPI.renderLiveVideos(liveVideos, 'live-videos-container');
                if (liveVideosLoading) liveVideosLoading.style.display = 'none';
            } catch (error) {
                console.error('Failed to load live videos:', error);
                if (liveVideosLoading) {
                    liveVideosLoading.innerHTML = '<p class="error-message">Failed to load live videos.</p>';
                }
            }
        }
        
        // Initialize contact form if enabled
        if (CONFIG.contactForm.enabled && CONFIG.contactForm.service !== 'none') {
            new ContactForm(CONFIG.contactForm);
        }
        
        // Initialize smooth scrolling
        new SmoothScroll();
        
    } catch (error) {
        console.error('Initialization error:', error);
        showMessage('Some features may not work properly. Please refresh the page.', 'error');
    }
});