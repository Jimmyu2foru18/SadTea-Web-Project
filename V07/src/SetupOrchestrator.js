const BaseUIHandler = require('./core/BaseUIHandler');
const BaseConfigHandler = require('./core/BaseConfigHandler');
const FileGenerators = require('./generators/FileGenerators');
const colors = require('./utils/colors');

// Import all setup steps
const BasicInfoStep = require('./steps/BasicInfoStep');
const YouTubeStep = require('./steps/YouTubeStep');
const StreamingStep = require('./steps/StreamingStep');
const SocialMediaStep = require('./steps/SocialMediaStep');
const MerchandiseStep = require('./steps/MerchandiseStep');
const ContactFormStep = require('./steps/ContactFormStep');
const ThemeStep = require('./steps/ThemeStep');
const CopyrightStep = require('./steps/CopyrightStep');

class SetupOrchestrator extends BaseUIHandler {
  constructor() {
    super();
    this.configHandler = new BaseConfigHandler();
    this.fileGenerators = new FileGenerators();
    this.setupSteps = [];
    this.initializeSteps();
  }

  initializeSteps() {
    this.setupSteps = [
      new BasicInfoStep(this.configHandler),
      new YouTubeStep(this.configHandler),
      new StreamingStep(this.configHandler),
      new SocialMediaStep(this.configHandler),
      new MerchandiseStep(this.configHandler),
      new ContactFormStep(this.configHandler),
      new ThemeStep(this.configHandler),
      new CopyrightStep(this.configHandler)
    ];
  }

  async checkExistingConfig() {
    if (this.configHandler.loadExistingConfig()) {
      const useExisting = await this.question(colors.yellow + 'Found existing config.json. Use existing config? (y/n): ' + colors.reset);
      if (useExisting.toLowerCase() === 'y') {
        try {
          console.log(colors.green + 'Using existing configuration...' + colors.reset);
          await this.generateWebsiteFiles();
          return true;
        } catch (error) {
          console.log(colors.red + '❌ Error using existing config: ' + error.message + colors.reset);
          console.log(colors.yellow + 'Starting fresh setup...' + colors.reset);
        }
      }
    }
    return false;
  }

  async runSetup() {
    this.displayHeader();
    
    console.log(colors.green + 'Welcome! Let\'s build your amazing creator website step by step.' + colors.reset);
    console.log(colors.dim + 'This setup will take about 5-10 minutes to complete.\n' + colors.reset);
    
    await this.question(colors.yellow + colors.bright + 'Press Enter to begin your journey...' + colors.reset);

    // Check for existing config
    if (await this.checkExistingConfig()) {
      this.close();
      return;
    }

    // Initialize fresh config
    this.configHandler.initializeConfig();

    // Run all setup steps
    for (const step of this.setupSteps) {
      await step.execute();
    }

    // Show configuration summary
    await this.showConfigurationSummary();

    // Generate website files
    await this.generateWebsiteFiles();

    this.showSuccessMessage();
    this.close();
  }

  async showConfigurationSummary() {
    this.displaySection('CONFIGURATION SUMMARY', '📋', 'Review your website configuration');
    
    const config = this.configHandler.getConfig();
    
    console.log(colors.white + `Creator Name: ${colors.cyan}${config.creatorName}${colors.reset}`);
    console.log(colors.white + `Website Title: ${colors.cyan}${config.websiteTitle}${colors.reset}`);
    console.log(colors.white + `YouTube Integration: ${colors.cyan}${config.youtube.apiKey ? 'Enabled' : 'Disabled'}${colors.reset}`);
    console.log(colors.white + `Playlists: ${colors.cyan}${config.youtube.showPlaylists ? 'Enabled' : 'Disabled'}${colors.reset}`);
    console.log(colors.white + `Merchandise: ${colors.cyan}${config.merchandise.enabled ? config.merchandise.platform : 'Disabled'}${colors.reset}`);
    console.log(colors.white + `Contact Form: ${colors.cyan}${config.contactForm.enabled ? config.contactForm.service : 'Disabled'}${colors.reset}`);
    console.log(colors.white + `Theme: ${colors.cyan}${config.theme.style}${colors.reset}`);
    console.log(colors.white + `Fonts: ${colors.cyan}${config.theme.fonts.primary} + ${config.theme.fonts.secondary}${colors.reset}`);
    
    console.log();
    const confirm = await this.question(colors.yellow + 'Does this look correct? (y/n): ' + colors.reset);
    
    if (confirm.toLowerCase() !== 'y') {
      console.log(colors.red + 'Setup cancelled. Run the script again to restart.' + colors.reset);
      this.close();
      process.exit(0);
    }
  }

  async generateWebsiteFiles() {
    this.displaySection('GENERATING WEBSITE', '🚀', 'Creating your professional creator website...');
    
    try {
      const config = this.configHandler.getConfig();
      
      // Save config
      if (this.configHandler.saveConfig()) {
        this.displaySuccess('Configuration saved to config.json');
      }
      
      // Generate website files
      this.fileGenerators.generateHTML(config);
      this.displaySuccess('Generated index.html');
      
      this.fileGenerators.generateCSS(config);
      this.displaySuccess('Generated style.css');
      
      this.fileGenerators.generateJS(config);
      this.displaySuccess('Generated script.js');
      
      // Create assets folder
      this.fileGenerators.createAssetsFolder();
      this.displaySuccess('Created assets folder');
      
      // Generate deploy.yml for GitHub Actions
      this.fileGenerators.generateDeployYml();
      this.displaySuccess('Generated .github/workflows/deploy.yml');
      
    } catch (error) {
      console.log(colors.red + '❌ Error generating website: ' + error.message + colors.reset);
      throw error;
    }
  }

  showSuccessMessage() {
    console.log();
    console.log(colors.green + colors.bright + '🎉 WEBSITE GENERATED SUCCESSFULLY! 🎉' + colors.reset);
    console.log();
    console.log(colors.cyan + '📁 Files created:' + colors.reset);
    console.log(colors.white + '  ✅ index.html (Your main website page)' + colors.reset);
    console.log(colors.white + '  ✅ style.css (All styling and themes)' + colors.reset);
    console.log(colors.white + '  ✅ script.js (Interactive functionality)' + colors.reset);
    console.log(colors.white + '  ✅ config.json (Your configuration settings)' + colors.reset);
    console.log(colors.white + '  ✅ assets/ (Folder for your images and media)' + colors.reset);
    console.log(colors.white + '  ✅ .github/workflows/deploy.yml (GitHub Pages deployment)' + colors.reset);
    console.log();
    console.log(colors.yellow + '🌐 Next Steps:' + colors.reset);
    console.log(colors.white + '  1. Open index.html in your browser to preview' + colors.reset);
    console.log(colors.white + '  2. Add your profile images to the assets/ folder' + colors.reset);
    console.log(colors.white + '  3. Test your contact form and YouTube integration' + colors.reset);
    console.log(colors.white + '  4. Deploy to GitHub Pages (see DEPLOYMENT.md)' + colors.reset);
    console.log();
    console.log(colors.green + '📖 For detailed instructions, check:' + colors.reset);
    console.log(colors.white + '  • README.md - Complete setup guide' + colors.reset);
    console.log(colors.white + '  • SETUP-GUIDE.md - Customization instructions' + colors.reset);
    console.log(colors.white + '  • DEPLOYMENT.md - GitHub Pages deployment' + colors.reset);
    console.log();
  }
}

module.exports = SetupOrchestrator;