const BaseSetupStep = require('./BaseSetupStep');
const colors = require('../utils/colors');

class BasicInfoStep extends BaseSetupStep {
  constructor(configHandler, uiHandler) {
    super(configHandler, uiHandler);
    this.stepName = 'BASIC INFORMATION';
    this.stepIcon = '📝';
    this.stepDescription = 'Tell us about yourself and your brand';
  }

  async runStep() {
    const creatorName = await this.uiHandler.question(colors.cyan + 'Enter your creator name/brand: ' + colors.reset);
    this.setConfig('creatorName', creatorName);

    const websiteTitle = await this.uiHandler.question(colors.cyan + 'Enter your website title: ' + colors.reset);
    this.setConfig('websiteTitle', websiteTitle);

    const description = await this.uiHandler.question(colors.cyan + 'Enter a brief description of your content: ' + colors.reset);
    this.setConfig('description', description);
  }
}

module.exports = BasicInfoStep;