#!/usr/bin/env node

/**
 * Personal Creator Website Setup
 * Modular setup system using inheritance and separation of concerns
 */

const SetupOrchestrator = require('./src/SetupOrchestrator');

async function main() {
  const orchestrator = new SetupOrchestrator();
  
  try {
    await orchestrator.runSetup();
  } catch (error) {
    console.error('Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { SetupOrchestrator };