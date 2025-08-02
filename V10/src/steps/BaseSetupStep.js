class BaseSetupStep {
  constructor(configHandler, uiHandler) {
    this.configHandler = configHandler;
    this.uiHandler = uiHandler;
    this.stepName = 'Base Step';
    this.stepIcon = '⚙️';
    this.stepDescription = '';
  }

  async execute() {
    this.uiHandler.displaySection(this.stepName, this.stepIcon, this.stepDescription);
    await this.runStep();
    this.uiHandler.displaySuccess(`${this.stepName} completed!`);
  }

  async runStep() {
    // Override in child classes
    throw new Error('runStep method must be implemented in child class');
  }

  setConfig(path, value) {
    this.configHandler.setConfigValue(path, value);
  }

  getConfig(path) {
    return this.configHandler.getConfigValue(path);
  }

  getAllConfig() {
    return this.configHandler.getConfig();
  }
}

module.exports = BaseSetupStep;