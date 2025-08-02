const fs = require('fs');
const path = require('path');

class BaseConfigHandler {
  constructor() {
    this.config = {};
    this.configPath = path.join(process.cwd(), 'config.json');
  }

  initializeConfig() {
    this.config = {
      creatorName: '',
      websiteTitle: '',
      description: '',
      youtube: {
        apiKey: '',
        channelId: '',
        maxVideos: 6,
        showPlaylists: false,
        maxPlaylists: 0,
        showLiveVideos: false,
        maxLiveVideos: 0
      },
      streaming: {
        twitch: {
          enabled: false,
          username: '',
          showChat: false
        }
      },
      socialMedia: {
        youtube: '',
        instagram: '',
        twitter: '',
        tiktok: '',
        discord: '',
        twitch: '',
        facebook: '',
        linkedin: '',
        kick: ''
      },
      merchandise: {
        enabled: false,
        platform: '',
        url: '',
        embedCode: ''
      },
      contactForm: {
        enabled: false,
        service: 'none',
        email: ''
      },
      theme: {
        fonts: {
          primary: 'Poppins',
          secondary: 'Open Sans',
          googleFonts: 'Poppins:wght@300;400;500;600;700|Open+Sans:wght@300;400;600;700'
        },
        style: 'vibrant',
        primaryColor: '#e74c3c',
        secondaryColor: '#27ae60',
        backgroundColor: '#ffffff',
        textColor: '#2c3e50',
        accentColor: '#f39c12',
        headingColor: '#2c3e50',
        bodyTextColor: '#2c3e50',
        linkColor: '#e74c3c'
      },
      copyright: '',
      showCredit: true
    };
  }

  loadExistingConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = fs.readFileSync(this.configPath, 'utf8');
        this.config = JSON.parse(configData);
        return true;
      }
    } catch (error) {
      console.error('Error loading existing config:', error.message);
    }
    return false;
  }

  saveConfig() {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving config:', error.message);
      return false;
    }
  }

  getConfig() {
    return this.config;
  }

  setConfigValue(path, value) {
    const keys = path.split('.');
    let current = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  getConfigValue(path) {
    const keys = path.split('.');
    let current = this.config;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        return undefined;
      }
      current = current[key];
    }
    
    return current;
  }

  validateConfig() {
    const errors = [];
    
    if (!this.config.creatorName) {
      errors.push('Creator name is required');
    }
    
    if (!this.config.websiteTitle) {
      errors.push('Website title is required');
    }
    
    if (this.config.youtube.apiKey && !this.config.youtube.channelId) {
      errors.push('YouTube Channel ID is required when API key is provided');
    }
    
    return errors;
  }
}

module.exports = BaseConfigHandler;