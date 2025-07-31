// Personal Creator Website - Generated JavaScript

// Configuration
const CONFIG = {
  youtube: {
    apiKey: 'AIzaSyBfWEUDtIAfJLp7nLqYvNh5Ra2FbowYJI8',
    channelId: 'UCQjpnt3fOWSyN6JbTkDcPZQ',
    maxVideos: 25,
    showPlaylists: false,
    maxPlaylists: 0
  },
  contactForm: {
    service: 'none',
    enabled: false
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
      // Use a more efficient API endpoint with pagination
      const maxResults = Math.min(CONFIG.youtube.maxVideos, 50); // YouTube API limit is 50 per request
      let allVideos = [];
      let nextPageToken = '';
      let remainingVideos = CONFIG.youtube.maxVideos;
      
      // Fetch videos in batches to avoid overloading
      while (remainingVideos > 0 && (nextPageToken !== undefined || allVideos.length === 0)) {
        const pageSize = Math.min(remainingVideos, 50);
        const pageUrl = `${this.baseUrl}/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet,id&order=date&maxResults=${pageSize}&type=video${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
        
        const response = await fetch(pageUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch videos: ${response.status}`);
        }
        
        const data = await response.json();
        allVideos = [...allVideos, ...data.items];
        nextPageToken = data.nextPageToken;
        remainingVideos -= data.items.length;
        
        // Add a small delay between requests to avoid rate limiting
        if (nextPageToken && remainingVideos > 0) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      return allVideos;
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      return [];
    }
  }

  async fetchChannelPlaylists() {
    if (!CONFIG.youtube.showPlaylists) return [];
    
    try {
      // Use a more efficient API endpoint with pagination
      const maxResults = Math.min(CONFIG.youtube.maxPlaylists, 50); // YouTube API limit is 50 per request
      let allPlaylists = [];
      let nextPageToken = '';
      let remainingPlaylists = CONFIG.youtube.maxPlaylists;
      
      // Fetch playlists in batches to avoid overloading
      while (remainingPlaylists > 0 && (nextPageToken !== undefined || allPlaylists.length === 0)) {
        const pageSize = Math.min(remainingPlaylists, 50);
        const pageUrl = `${this.baseUrl}/playlists?key=${this.apiKey}&channelId=${this.channelId}&part=snippet,contentDetails&maxResults=${pageSize}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
        
        const response = await fetch(pageUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch playlists: ${response.status}`);
        }
        
        const data = await response.json();
        allPlaylists = [...allPlaylists, ...data.items];
        nextPageToken = data.nextPageToken;
        remainingPlaylists -= data.items.length;
        
        // Add a small delay between requests to avoid rate limiting
        if (nextPageToken && remainingPlaylists > 0) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      return allPlaylists;
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

    // Clear loading indicator
    container.innerHTML = '';
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Render videos in batches for better performance
    const renderBatch = (startIdx, endIdx) => {
      for (let i = startIdx; i < endIdx && i < videos.length; i++) {
        const video = videos[i];
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.medium.url;
        const publishedAt = new Date(video.snippet.publishedAt).toLocaleDateString();
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
          <div class="video-thumbnail">
            <a href="${videoUrl}" target="_blank" rel="noopener noreferrer">
              <img src="${thumbnail}" alt="${title}" loading="lazy">
            </a>
          </div>
          <div class="video-info">
            <h3 class="video-title"><a href="${videoUrl}" target="_blank" rel="noopener noreferrer">${title}</a></h3>
            <p class="video-date">${publishedAt}</p>
          </div>
        `;
        
        fragment.appendChild(videoCard);
      }
      
      container.appendChild(fragment);
    };
    
    // Initial batch of videos (first 10)
    renderBatch(0, 10);
    
    // Render remaining videos in batches with a slight delay
    if (videos.length > 10) {
      setTimeout(() => {
        renderBatch(10, videos.length);
      }, 100);
    }
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
      const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

      return `
        <div class="playlist-card">
          <div class="playlist-thumbnail">
            <a href="${playlistUrl}" target="_blank" rel="noopener noreferrer">
              <img src="${thumbnail}" alt="${title}" loading="lazy">
            </a>
          </div>
          <div class="playlist-info">
            <h3 class="playlist-title">
              <a href="${playlistUrl}" target="_blank" rel="noopener noreferrer">${title}</a>
            </h3>
            <p class="playlist-count">${itemCount} videos</p>
          </div>
        </div>
      `;
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

    // Add loading state styles
    const style = document.createElement('style');
    style.textContent = `
      .form-loading { opacity: 0.7; pointer-events: none; }
      .form-message { padding: 1rem; margin: 1rem 0; border-radius: 5px; }
      .form-message-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
      .form-message-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    `;
    document.head.appendChild(style);

    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.form);
    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
      // Show loading state
      this.form.classList.add('form-loading');
      submitButton.textContent = 'Sending...';
      
      // Clear previous messages
      this.clearMessages();
      
      if (CONFIG.contactForm.service === 'emailjs') {
        await this.sendWithEmailJS(formData);
      } else if (CONFIG.contactForm.service === 'formspree') {
        await this.sendWithFormspree(formData);
      }
      
      this.showMessage('Message sent successfully! Thank you for reaching out.', 'success');
      this.form.reset();
      
    } catch (error) {
      console.error('Contact form error:', error);
      this.showMessage('Failed to send message. Please try again or contact directly via email.', 'error');
    } finally {
      // Reset loading state
      this.form.classList.remove('form-loading');
      submitButton.textContent = originalText;
    }
  }

  async sendWithFormspree(formData) {
    const response = await fetch(this.form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Formspree submission failed');
    }
  }

  async sendWithEmailJS(formData) {
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
    messageEl.className = `form-message form-message-${type}`;
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

  clearMessages() {
    const messages = document.querySelectorAll('.form-message');
    messages.forEach(msg => msg.remove());
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
    if (CONFIG.contactForm.enabled && CONFIG.contactForm.service !== 'none') {
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
}