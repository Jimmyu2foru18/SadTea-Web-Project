const BaseSetupStep = require('./BaseSetupStep');
const colors = require('../utils/colors');

class ContactFormStep extends BaseSetupStep {
  constructor(configHandler, uiHandler) {
    super(configHandler, uiHandler);
    this.stepName = 'CONTACT FORM SETUP';
    this.stepIcon = '📬';
    this.stepDescription = 'Let fans and business partners reach you through a professional contact form';
  }

  async runStep() {
    const formOptions = [
      'Formspree (Recommended for beginners - Free plan available)',
      'EmailJS (Advanced customization options)',
      'Mailto (Simple email link - opens user\'s email client)',
      'No contact form (Skip this section)'
    ];

    this.uiHandler.displayOptions(formOptions, 'Choose your contact form service');

    const formChoice = await this.uiHandler.selectFromOptions(formOptions, 'Select option (1-4): ');
    const formServices = ['formspree', 'emailjs', 'mailto', 'none'];
    const formService = formServices[formChoice];

    this.setConfig('contactForm.enabled', formService !== 'none');
    this.setConfig('contactForm.service', formService);
    this.setConfig('contactForm.email', '');

    if (formService !== 'none') {
      const email = await this.uiHandler.question(colors.cyan + 'Enter your contact email: ' + colors.reset);
      this.setConfig('contactForm.email', email);

      if (formService === 'formspree') {
        this.uiHandler.displayInfo('You\'ll need to create a Formspree account and get a form ID. Check the README.md for instructions.');
        const formspreeId = await this.uiHandler.question(colors.cyan + 'Enter your Formspree form ID: ' + colors.reset);
        this.setConfig('contactForm.formspreeId', formspreeId);
        this.uiHandler.displaySuccess('Formspree contact form configured!');
      } else if (formService === 'emailjs') {
        this.uiHandler.displayInfo('You\'ll need EmailJS account credentials. Check the README.md for setup instructions.');
        const serviceId = await this.uiHandler.question(colors.cyan + 'Enter EmailJS Service ID: ' + colors.reset);
        const templateId = await this.uiHandler.question(colors.cyan + 'Enter EmailJS Template ID: ' + colors.reset);
        const publicKey = await this.uiHandler.question(colors.cyan + 'Enter EmailJS Public Key: ' + colors.reset);
        
        this.setConfig('contactForm.emailjs', {
          serviceId,
          templateId,
          publicKey
        });
        this.uiHandler.displaySuccess('EmailJS contact form configured!');
      } else if (formService === 'mailto') {
        this.uiHandler.displaySuccess('Mailto contact option configured!');
        this.uiHandler.displayInfo('Visitors will be able to contact you via their default email client.');
      }
    } else {
      this.uiHandler.displayInfo('Contact form section skipped.');
    }
  }
}

module.exports = ContactFormStep;