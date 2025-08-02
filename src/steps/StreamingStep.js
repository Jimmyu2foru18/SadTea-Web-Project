const BaseSetupStep = require('./BaseSetupStep');
const colors = require('../utils/colors');

class StreamingStep extends BaseSetupStep {
  constructor(configHandler, uiHandler) {
    super(configHandler, uiHandler);
    this.stepName = 'STREAMING INTEGRATION';
    this.stepIcon = '📺';
    this.stepDescription = 'Add live streaming features to your website';
  }

  async runStep() {
    const enableTwitch = (await this.uiHandler.question(colors.cyan + 'Enable Twitch live stream embed? (y/n): ' + colors.reset)).toLowerCase() === 'y';
    
    this.setConfig('streaming.twitch.enabled', enableTwitch);
    this.setConfig('streaming.twitch.username', '');
    this.setConfig('streaming.twitch.showChat', false);

    if (enableTwitch) {
      const username = await this.uiHandler.question(colors.cyan + 'Enter your Twitch username: ' + colors.reset);
      this.setConfig('streaming.twitch.username', username);

      const showChat = (await this.uiHandler.question(colors.cyan + 'Show Twitch chat alongside stream? (y/n): ' + colors.reset)).toLowerCase() === 'y';
      this.setConfig('streaming.twitch.showChat', showChat);
    } else {
      this.uiHandler.displayInfo('Twitch integration skipped.');
    }
  }
}

module.exports = StreamingStep;