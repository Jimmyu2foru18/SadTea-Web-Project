const BaseSetupStep = require('./BaseSetupStep');
const colors = require('../utils/colors');

class YouTubeStep extends BaseSetupStep {
  constructor(configHandler) {
    super(configHandler);
    this.stepName = 'YOUTUBE INTEGRATION';
    this.stepIcon = '🎬';
    this.stepDescription = 'Connect your YouTube channel to automatically display your latest videos and playlists';
  }

  async runStep() {
    this.displayInfo('You\'ll need a YouTube Data API v3 key. Check the README.md for detailed setup instructions.');
    
    const apiKey = await this.question(colors.cyan + 'Enter your YouTube API key: ' + colors.reset);
    this.setConfig('youtube.apiKey', apiKey);

    const channelId = await this.question(colors.cyan + 'Enter your YouTube Channel ID: ' + colors.reset);
    this.setConfig('youtube.channelId', channelId);

    const maxVideos = parseInt(await this.question(colors.cyan + 'How many recent videos to display? (default: 6): ' + colors.reset) || '6');
    this.setConfig('youtube.maxVideos', maxVideos);

    const showPlaylists = (await this.question(colors.cyan + 'Show YouTube playlists on your website? (y/n): ' + colors.reset)).toLowerCase() === 'y';
    this.setConfig('youtube.showPlaylists', showPlaylists);

    if (showPlaylists) {
      const maxPlaylists = parseInt(await this.question(colors.cyan + 'How many playlists to display? (default: 4): ' + colors.reset) || '4');
      this.setConfig('youtube.maxPlaylists', maxPlaylists);
    } else {
      this.setConfig('youtube.maxPlaylists', 0);
    }

    const showLiveVideos = (await this.question(colors.cyan + 'Show YouTube live videos section? (y/n): ' + colors.reset)).toLowerCase() === 'y';
    this.setConfig('youtube.showLiveVideos', showLiveVideos);

    if (showLiveVideos) {
      const maxLiveVideos = parseInt(await this.question(colors.cyan + 'How many live videos to display? (default: 3): ' + colors.reset) || '3');
      this.setConfig('youtube.maxLiveVideos', maxLiveVideos);
    } else {
      this.setConfig('youtube.maxLiveVideos', 0);
    }
  }
}

module.exports = YouTubeStep;