const BaseSetupStep = require('./BaseSetupStep');
const colors = require('../utils/colors');

class ThemeStep extends BaseSetupStep {
  constructor(configHandler) {
    super(configHandler);
    this.stepName = 'VISUAL STYLING & THEMES';
    this.stepIcon = '🎨';
    this.stepDescription = 'Customize your website\'s appearance to match your brand perfectly';
  }

  async runStep() {
    await this.setupFonts();
    await this.setupTheme();
  }

  async setupFonts() {
    const fontOptions = [
      'Modern & Clean (Inter + Source Sans Pro)',
      'Creative & Artistic (Poppins + Open Sans)',
      'Professional & Corporate (Roboto + Lato)',
      'Elegant & Sophisticated (Playfair Display + Source Sans Pro)',
      'Tech & Gaming (Orbitron + Exo 2)',
      'Friendly & Approachable (Nunito + Mukti)'
    ];

    this.displayOptions(fontOptions, 'Choose your font style');
    const fontChoice = await this.selectFromOptions(fontOptions, 'Select font option (1-6): ');

    const fontPairs = [
      { primary: 'Inter', secondary: 'Source Sans Pro', googleFonts: 'Inter:wght@300;400;500;600;700|Source+Sans+Pro:wght@300;400;600;700' },
      { primary: 'Poppins', secondary: 'Open Sans', googleFonts: 'Poppins:wght@300;400;500;600;700|Open+Sans:wght@300;400;600;700' },
      { primary: 'Roboto', secondary: 'Lato', googleFonts: 'Roboto:wght@300;400;500;700|Lato:wght@300;400;700' },
      { primary: 'Playfair Display', secondary: 'Source Sans Pro', googleFonts: 'Playfair+Display:wght@400;500;600;700|Source+Sans+Pro:wght@300;400;600;700' },
      { primary: 'Orbitron', secondary: 'Exo 2', googleFonts: 'Orbitron:wght@400;500;600;700;800;900|Exo+2:wght@300;400;500;600;700' },
      { primary: 'Nunito', secondary: 'Mukti', googleFonts: 'Nunito:wght@300;400;500;600;700;800|Mukti:wght@300;400;600;700' }
    ];

    this.setConfig('theme.fonts', fontPairs[fontChoice]);
  }

  async setupTheme() {
    const styleOptions = [
      'Minimalist (Clean, simple design with lots of white space)',
      'Bold & Vibrant (Eye-catching colors and strong contrasts)',
      'Dark Mode (Dark backgrounds with light text)',
      'Gradient (Beautiful color gradients throughout)',
      'Gaming (Neon accents and tech-inspired design)',
      'Professional (Corporate-style layout and colors)',
      'Custom Colors (Choose your own color scheme)'
    ];

    this.displayOptions(styleOptions, 'Choose your visual theme');
    const styleChoice = await this.selectFromOptions(styleOptions, 'Select theme option (1-7): ');

    const themePresets = [
      { name: 'minimalist', primary: '#2c3e50', secondary: '#d35400', background: '#ffffff', text: '#333333', accent: '#e67e22' },
      { name: 'vibrant', primary: '#e74c3c', secondary: '#27ae60', background: '#ffffff', text: '#2c3e50', accent: '#f39c12' },
      { name: 'dark', primary: '#3498db', secondary: '#e67e22', background: '#2c3e50', text: '#ecf0f1', accent: '#f39c12' },
      { name: 'gradient', primary: '#9b59b6', secondary: '#f39c12', background: '#ffffff', text: '#2c3e50', accent: '#e67e22' },
      { name: 'gaming', primary: '#00ff88', secondary: '#ff6600', background: '#0a0a0a', text: '#ffffff', accent: '#ff3366' },
      { name: 'professional', primary: '#34495e', secondary: '#e67e22', background: '#ffffff', text: '#2c3e50', accent: '#d35400' }
    ];

    if (styleChoice === 6) { // Custom colors
      await this.setupCustomColors();
      this.setConfig('theme.style', 'custom');
    } else {
      const preset = themePresets[styleChoice];
      this.setConfig('theme.style', preset.name);
      this.setConfig('theme.primaryColor', preset.primary);
      this.setConfig('theme.secondaryColor', preset.secondary);
      this.setConfig('theme.backgroundColor', preset.background);
      this.setConfig('theme.textColor', preset.text);
      this.setConfig('theme.accentColor', preset.accent);
      this.setConfig('theme.headingColor', preset.text);
      this.setConfig('theme.bodyTextColor', preset.text);
      this.setConfig('theme.linkColor', preset.primary);
      this.displaySuccess(`${styleOptions[styleChoice].split(' ')[0]} theme configured!`);
    }
  }

  async setupCustomColors() {
    console.log(colors.cyan + '\nCustom Color Configuration:' + colors.reset);
    
    const primaryColor = await this.getValidHexColor('Primary color (buttons, headings)', '#3498db');
    this.setConfig('theme.primaryColor', primaryColor);

    const secondaryColor = await this.getValidHexColor('Secondary color (hover effects)', '#2ecc71');
    this.setConfig('theme.secondaryColor', secondaryColor);

    const backgroundColor = await this.getValidHexColor('Background color', '#ffffff');
    this.setConfig('theme.backgroundColor', backgroundColor);

    const textColor = await this.getValidHexColor('Text color', '#333333');
    this.setConfig('theme.textColor', textColor);

    const accentColor = await this.getValidHexColor('Accent color (highlights)', '#e74c3c');
    this.setConfig('theme.accentColor', accentColor);

    const customFontColors = (await this.question(colors.cyan + 'Do you want to customize font colors? (y/n): ' + colors.reset)).toLowerCase() === 'y';
    if (customFontColors) {
      const headingColor = await this.getValidHexColor('Heading font color', '#2c3e50');
      this.setConfig('theme.headingColor', headingColor);

      const bodyTextColor = await this.getValidHexColor('Body text color', '#333333');
      this.setConfig('theme.bodyTextColor', bodyTextColor);

      const linkColor = await this.getValidHexColor('Link color', '#3498db');
      this.setConfig('theme.linkColor', linkColor);
    } else {
      this.setConfig('theme.headingColor', textColor);
      this.setConfig('theme.bodyTextColor', textColor);
      this.setConfig('theme.linkColor', primaryColor);
    }
    
    this.displaySuccess('Custom color scheme configured!');
  }
}

module.exports = ThemeStep;