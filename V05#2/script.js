// Personal Creator Website - Generated JavaScript

// Configuration
const CONFIG = {
  youtube: {
    apiKey: 'AIzaSyDUrAtpTT3ezacpPosd4XFhVxWf0VGyKwY',
    channelId: 'UCQjpnt3fOWSyN6JbTkDcPZQ',
    maxVideos: 6,
    showPlaylists: true,
    maxPlaylists: 3,
    showLiveVideos: true,
    maxLiveVideos: 3
  },
  streaming: {
    twitch: {
      enabled: true,
      username: 'jimmyu2foru18',
      showChat: true
    }
  },
  contactForm: {
    service: 'mailto',
    
  }
};

// YouTube API Integration
class YouTubeAPI {
  constructor() {
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    this.apiKey = CONFIG.youtube.apiKey;
    this.channelId = CONFIG.youtube.channelId;
    this.rateLimitDelay = 100;
    this.lastRequestTime = 0;
    
    // Initialize cache
    this.cache = {
      videos: { data: null, timestamp: 0 },
      playlists: { data: null, timestamp: 0 },
      liveVideos: { data: null, timestamp: 0 }
    };
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache expiry
  }

  isCacheValid(type) {
    const cache = this.cache[type];
    return cache.data && (Date.now() - cache.timestamp) < this.cacheExpiry;
  }

  updateCache(type, data) {
    this.cache[type] = {
      data: data,
      timestamp: Date.now()
    };
  }

  async makeRequest(endpoint, params) {
    const maxRetries = 3;
    let retryCount = 0;
    let retryDelay = this.rateLimitDelay;

    while (retryCount <= maxRetries) {
      try {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < retryDelay) {
          await new Promise(resolve => setTimeout(resolve, retryDelay - timeSinceLastRequest));
        }
        this.lastRequestTime = Date.now();

        const url = new URL(`${this.baseUrl}/${endpoint}`);
        url.searchParams.append('key', this.apiKey);
        
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });

        const response = await fetch(url);
        
        if (response.status === 403) {
          throw new Error('quota exceeded');
        } else if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        if (error.message.includes('quota')) {
          throw error;
        }
        
        retryCount++;
        if (retryCount <= maxRetries) {
          retryDelay *= 2;
          console.warn(`Retrying request (${retryCount}/${maxRetries}) after ${retryDelay}ms`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        throw error;
      }
    }
  }

  async fetchChannelVideos() {
    if (this.isCacheValid('videos')) {
      return this.cache.videos.data.slice(0, CONFIG.youtube.maxVideos);
    }

    try {
      const data = await this.makeRequest('search', {
        part: 'snippet',
        channelId: this.channelId,
        maxResults: Math.min(CONFIG.youtube.maxVideos, 20),
        order: 'date',
        type: 'video',
        fields: 'items(id/videoId,snippet(title,description,publishedAt,thumbnails/medium))'
      });
      const items = data.items || [];
      this.updateCache('videos', items);
      return items;
    } catch (error) {
      if (error.message.includes('quota')) {
        console.error('YouTube API quota exceeded. Please try again tomorrow.');
      } else {
        console.error('Error fetching videos:', error);
      }
      return [];
    }
  }

  async fetchChannelPlaylists() {
    if (!CONFIG.youtube.showPlaylists) return [];
    
    if (this.isCacheValid('playlists')) {
      return this.cache.playlists.data.slice(0, CONFIG.youtube.maxPlaylists);
    }

    try {
      const data = await this.makeRequest('playlists', {
        part: 'snippet,contentDetails',
        channelId: this.channelId,
        maxResults: CONFIG.youtube.maxPlaylists,
        fields: 'items(id,contentDetails/itemCount,snippet(title,description,thumbnails/medium))'
      });
      const items = data.items || [];
      this.updateCache('playlists', items);
      return items;
    } catch (error) {
      if (error.message.includes('quota')) {
        console.error('YouTube API quota exceeded. Please try again tomorrow.');
      } else {
        console.error('Error fetching playlists:', error);
      }
      return [];
    }
  }

  async fetchLiveVideos() {
    if (!CONFIG.youtube.showLiveVideos) return [];
    
    if (this.isCacheValid('liveVideos')) {
      return this.cache.liveVideos.data.slice(0, CONFIG.youtube.maxLiveVideos);
    }

    try {
      // Combine live and upcoming streams in a single request
      const data = await this.makeRequest('search', {
        part: 'snippet',
        channelId: this.channelId,
        maxResults: 10,
        order: 'date',
        type: 'video',
        eventType: 'live'
      });
      
      let allLiveVideos = data.items || [];
      
      // If no live videos, check for upcoming
      if (allLiveVideos.length === 0) {
        const upcomingData = await this.makeRequest('search', {
          part: 'snippet',
          channelId: this.channelId,
          maxResults: 5,
          order: 'date',
          type: 'video',
          eventType: 'upcoming'
        });
        allLiveVideos = upcomingData.items || [];
      }
      
      // Cache with shorter expiry for live content (1 minute)
      this.cache.liveVideos = {
        data: allLiveVideos,
        timestamp: Date.now()
      };
      
      return allLiveVideos;
    } catch (error) {
      if (error.message.includes('quota')) {
        console.error('YouTube API quota exceeded. Please try again tomorrow.');
      } else {
        console.error('Error fetching live videos:', error);
      }
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
          <div class="video-embed">
            <iframe 
              src="https://www.youtube.com/embed/${videoId}" 
              title="${title}"
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen>
            </iframe>
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

  renderLiveVideos(liveVideos) {
    const container = document.getElementById('live-videos-container');
    
    if (!container) return;
    
    if (!liveVideos || liveVideos.length === 0) {
      container.innerHTML = '<div class="loading"><p>No live videos found.</p></div>';
      return;
    }

    // Clear loading indicator
    container.innerHTML = '';
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    liveVideos.forEach(video => {
      const videoId = video.id.videoId;
      const title = video.snippet.title;
      const thumbnail = video.snippet.thumbnails.medium.url;
      const publishedAt = new Date(video.snippet.publishedAt).toLocaleDateString();
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      const videoCard = document.createElement('div');
      videoCard.className = 'video-card live-video-card';
      videoCard.innerHTML = `
        <div class="video-thumbnail">
          <a href="${videoUrl}" target="_blank" rel="noopener noreferrer">
            <img src="${thumbnail}" alt="${title}" loading="lazy">
            <div class="live-badge">🔴 LIVE</div>
          </a>
        </div>
        <div class="video-info">
          <h3 class="video-title"><a href="${videoUrl}" target="_blank" rel="noopener noreferrer">${title}</a></h3>
          <p class="video-date">Started: ${publishedAt}</p>
        </div>
      `;
      
      fragment.appendChild(videoCard);
    });
    
    container.appendChild(fragment);
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
       
       // Load live videos if enabled
       if (CONFIG.youtube.showLiveVideos) {
         const liveVideos = await youtube.fetchLiveVideos();
         youtube.renderLiveVideos(liveVideos);
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
 }