const fs = require('fs');
const FileGenerators = require('./src/generators/FileGenerators');

// Load existing config
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Create file generators instance
const fileGenerators = new FileGenerators();

console.log('🔄 Regenerating website files with improved styling...');

// Generate all files
try {
  // Generate HTML
  console.log('Generating HTML...');
  const html = fileGenerators.generateHTML(config);
  if (!html) throw new Error('HTML generation returned undefined');
  fs.writeFileSync('index.html', html);
  console.log('✅ Generated index.html');
  
  // Generate CSS
  console.log('Generating CSS...');
  const css = fileGenerators.buildCSS(config);
  if (!css) throw new Error('CSS generation returned undefined');
  fs.writeFileSync('style.css', css);
  console.log('✅ Generated style.css with advanced styling');
  
  // Generate JS
  console.log('Generating JS...');
  const js = fileGenerators.buildJS(config);
  if (!js) throw new Error('JS generation returned undefined');
  fs.writeFileSync('script.js', js);
  console.log('✅ Generated script.js');
  
  console.log('\n🎉 Website regenerated successfully with improved styling!');
  console.log('📁 Files updated:');
  console.log('   • index.html - Updated with better structure');
  console.log('   • style.css - Advanced CSS with modern design');
  console.log('   • script.js - Enhanced functionality');
  console.log('\n🌐 Open index.html in your browser to see the improvements!');
  
} catch (error) {
  console.error('❌ Error regenerating files:', error.message);
  process.exit(1);
}