const BaseSetupStep = require('./BaseSetupStep');
const colors = require('../utils/colors');

class ContactFormStep extends BaseSetupStep {
  constructor(configHandler) {
    super(configHandler);
    this.stepName = 'CONTACT FORM SETUP';
    this.stepIcon = '📬';
    this.stepDescription = 'Let fans and business partners reach you through a professional contact form';
  }

  async runStep() {
    const formOptions = [
      'Formspree (Recommended for beginners - Free plan available)',
      'EmailJS (Advanced customization options)',
      'No contact form (Skip this section)'
    ];

    this.displayOptions(formOptions, 'Choose your contact form service');
    
    const formChoice = await this.selectFromOptions(formOptions, 'Select option (1-3): ');
    const formServices = ['formspree', 'emailjs', 'none'];
    const formService = formServices[formChoice];

    this.setConfig('contactForm.enabled', formService !== 'none');
    this.setConfig('contactForm.service', formService);
    this.setConfig('contactForm.email', '');

    if (formService !== 'none') {
      const email = await this.question(colors.cyan + 'Enter your contact email: ' + colors.reset);
      this.setConfig('contactForm.email', email);

      if (formService === 'formspree') {
        this.displayInfo('You\'ll need to create a Formspree account and get a form ID. Check the README.md for instructions.');
        const formspreeId = await this.question(colors.cyan + 'Enter your Formspree form ID: ' + colors.reset);
        this.setConfig('contactForm.formspreeId', formspreeId);
        this.displaySuccess('Formspree contact form configured!');
      } else if (formService === 'emailjs') {
        this.displayInfo('You\'ll need EmailJS account credentials. Check the README.md for setup instructions.');
        const serviceId = await this.question(colors.cyan + 'Enter EmailJS Service ID: ' + colors.reset);
        const templateId = await this.question(colors.cyan + 'Enter EmailJS Template ID: ' + colors.reset);
        const publicKey = await this.question(colors.cyan + 'Enter EmailJS Public Key: ' + colors.reset);
        
        this.setConfig('contactForm.emailjs', {
          serviceId,
          templateId,
          publicKey
        });
        this.displaySuccess('EmailJS contact form configured!');
      }
    } else {
      this.displayInfo('Contact form section skipped.');
    }
  }
}

module.exports = ContactFormStep;