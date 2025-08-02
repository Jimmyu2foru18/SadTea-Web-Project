const BaseSetupStep = require('./BaseSetupStep');
const colors = require('../utils/colors');

class SocialMediaStep extends BaseSetupStep {
  constructor(configHandler, uiHandler) {
    super(configHandler, uiHandler);
    this.stepName = 'SOCIAL MEDIA LINKS';
    this.stepIcon = '📱';
    this.stepDescription = 'Add links to all your social media profiles (press Enter to skip any)';
  }

  async runStep() {
    const socialPlatforms = [
      { key: 'youtube', name: 'YouTube channel URL' },
      { key: 'instagram', name: 'Instagram URL' },
      { key: 'twitter', name: 'Twitter/X URL' },
      { key: 'tiktok', name: 'TikTok URL' },
      { key: 'discord', name: 'Discord URL' },
      { key: 'twitch', name: 'Twitch URL' },
      { key: 'facebook', name: 'Facebook URL' },
      { key: 'linkedin', name: 'LinkedIn URL' },
      { key: 'kick', name: 'Kick URL' }
    ];

    for (const platform of socialPlatforms) {
      const url = await this.uiHandler.question(colors.cyan + `${platform.name}: ` + colors.reset);
      this.setConfig(`socialMedia.${platform.key}`, url);
    }
  }
}

module.exports = SocialMediaStep;