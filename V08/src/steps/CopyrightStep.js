const BaseSetupStep = require('./BaseSetupStep');
const colors = require('../utils/colors');

class CopyrightStep extends BaseSetupStep {
  constructor(configHandler, uiHandler) {
    super(configHandler, uiHandler);
    this.stepName = 'COPYRIGHT & FOOTER';
    this.stepIcon = '©️';
    this.stepDescription = 'Add your copyright information and website credits';
  }

  async runStep() {
    const currentYear = new Date().getFullYear();
    const creatorName = this.getConfig('creatorName');
    const defaultCopyright = `© ${currentYear} ${creatorName}. All rights reserved.`;

    const copyright = await this.uiHandler.question(colors.cyan + `Copyright text (default: "${defaultCopyright}"): ` + colors.reset) || defaultCopyright;
    this.setConfig('copyright.text', copyright);

    const showCredit = (await this.uiHandler.question(colors.cyan + 'Show "Powered by https://github.com/Jimmyu2foru18" credit? (y/n): ' + colors.reset)).toLowerCase() === 'y';
    this.setConfig('showCredit', showCredit);
  }
}

module.exports = CopyrightStep;