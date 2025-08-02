const BaseSetupStep = require('./BaseSetupStep');
const colors = require('../utils/colors');

class MerchandiseStep extends BaseSetupStep {
  constructor(configHandler, uiHandler) {
    super(configHandler, uiHandler);
    this.stepName = 'MERCHANDISE INTEGRATION';
    this.stepIcon = '👕';
    this.stepDescription = 'Showcase and sell your products directly from your website';
  }

  async runStep() {
    const merchOptions = [
      'Teespring/Spring (Print-on-demand - Recommended for beginners)',
      'Shopify (Professional e-commerce platform)',
      'Etsy (Handmade and unique items)',
      'Custom store (Any other platform)',
      'No merchandise (Skip this section)'
    ];

    this.uiHandler.displayOptions(merchOptions, 'Choose your merchandise platform');

    const merchChoice = await this.uiHandler.selectFromOptions(merchOptions, 'Select option (1-5): ');
    const merchTypes = ['teespring', 'shopify', 'etsy', 'custom', 'none'];
    const merchType = merchTypes[merchChoice];

    this.setConfig('merchandise.enabled', merchType !== 'none');
    this.setConfig('merchandise.platform', merchType);
    this.setConfig('merchandise.url', '');
    this.setConfig('merchandise.embedCode', '');

    if (merchType !== 'none') {
      const url = await this.uiHandler.question(colors.cyan + 'Enter your store URL: ' + colors.reset);
      this.setConfig('merchandise.url', url);

      if (merchType === 'shopify') {
        const hasEmbed = (await this.uiHandler.question(colors.cyan + 'Do you have Shopify embed code? (y/n): ' + colors.reset)).toLowerCase() === 'y';
        if (hasEmbed) {
          const embedCode = await this.uiHandler.question(colors.cyan + 'Enter Shopify embed code: ' + colors.reset);
          this.setConfig('merchandise.embedCode', embedCode);
        }
      }

      this.uiHandler.displaySuccess(`${merchOptions[merchChoice].split(' ')[0]} integration configured!`);
    } else {
      this.uiHandler.displayInfo('Merchandise section skipped.');
    }
  }
}

module.exports = MerchandiseStep;