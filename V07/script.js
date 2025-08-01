// Personal Creator Website - Generated JavaScript

// Configuration
const CONFIG = {
  youtube: {
    apiKey: "AIzaSyDUrAtpTT3ezacpPosd4XFhVxWf0VGyKwY",
    channelId: "UCQjpnt3fOWSyN6JbTkDcPZQ",
    maxVideos: 6,
    showPlaylists: false,
    maxPlaylists: 0,
    showLiveVideos: true,
    maxLiveVideos: 3
  },
  contactForm: {
    service: "none",
    
    
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
      const url = `${this.baseUrl}/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet,id&order=date&maxResults=${CONFIG.youtube.maxVideos}&type=video`;
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
    messageEl.className = `form-message form-message-${type}`;
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
});