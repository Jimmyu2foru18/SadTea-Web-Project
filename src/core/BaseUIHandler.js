const readline = require('readline');
const colors = require('../utils/colors');

class BaseUIHandler {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  displayHeader() {
    console.clear();
    console.log(colors.cyan + colors.bright + '╔══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                              ║');
    console.log('║                    🎥 PERSONAL CREATOR WEBSITE SETUP 🎥                      ║');
    console.log('║                                                                              ║');
    console.log('║              Professional Website Builder for Content Creators               ║');
    console.log('║                          No Coding Experience Required!                      ║');
    console.log('║                                                                              ║');
    console.log('╚══════════════════════════════════════════════════════════════════════════════╝' + colors.reset);
    console.log();
    console.log(colors.green + '✨ Features: YouTube Integration • Contact Forms • Merchandise • Social Media ✨' + colors.reset);
    console.log();
  }

  displaySection(title, icon, description = '') {
    console.log(colors.yellow + colors.bright + `\n${icon} ${title}` + colors.reset);
    console.log(colors.dim + '─'.repeat(80) + colors.reset);
    if (description) {
      console.log(colors.dim + description + colors.reset);
      console.log();
    }
  }

  displayOptions(options, title) {
    console.log(colors.cyan + `\n${title}:` + colors.reset);
    options.forEach((option, index) => {
      console.log(colors.white + `  ${colors.bright}${index + 1}.${colors.reset}${colors.white} ${option}` + colors.reset);
    });
    console.log();
  }

  displaySuccess(message) {
    console.log(colors.green + colors.bright + '✅ ' + message + colors.reset);
  }

  displayInfo(message) {
    console.log(colors.blue + 'ℹ️  ' + message + colors.reset);
  }

  displayWarning(message) {
    console.log(colors.yellow + '⚠️  ' + message + colors.reset);
  }

  async selectFromOptions(options, prompt, allowEmpty = false) {
    while (true) {
      const choice = await this.question(colors.green + prompt + colors.reset);
      
      if (allowEmpty && choice.trim() === '') {
        return -1; // Indicates empty/skip
      }
      
      const index = parseInt(choice) - 1;
      if (index >= 0 && index < options.length) {
        return index;
      }
      console.log(colors.red + '❌ Invalid choice. Please try again.' + colors.reset);
    }
  }

  validateHexColor(color) {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
  }

  async getValidHexColor(prompt, defaultColor) {
    while (true) {
      const color = await this.question(colors.cyan + prompt + colors.dim + ` (default: ${defaultColor}): ` + colors.reset) || defaultColor;
      if (this.validateHexColor(color)) {
        return color;
      }
      console.log(colors.red + '❌ Invalid hex color format. Please use format like #3498db' + colors.reset);
    }
  }

  close() {
    this.rl.close();
  }
}

module.exports = BaseUIHandler;