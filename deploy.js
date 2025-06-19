#!/usr/bin/env node

/**
 * Deployment helper script for Pledge Admin
 * This script helps prepare and deploy the application to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.cyan}Pledge Admin - Vercel Deployment Helper${colors.reset}\n`);

// Check if Vercel CLI is installed
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Run build to check for errors
function runBuild() {
  console.log(`${colors.yellow}Running build to check for errors...${colors.reset}`);
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log(`${colors.green}Build successful!${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Build failed. Please fix the errors before deploying.${colors.reset}`);
    return false;
  }
}

// Deploy to Vercel
function deployToVercel(production = false) {
  const command = production ? 'vercel --prod' : 'vercel';
  console.log(`${colors.yellow}Deploying to Vercel...${colors.reset}`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`${colors.green}Deployment successful!${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Deployment failed.${colors.reset}`);
    return false;
  }
}

// Main function
async function main() {
  // Check if Vercel CLI is installed
  if (!checkVercelCLI()) {
    console.log(`${colors.red}Vercel CLI is not installed. Installing now...${colors.reset}`);
    try {
      execSync('npm install -g vercel', { stdio: 'inherit' });
    } catch (error) {
      console.error(`${colors.red}Failed to install Vercel CLI. Please install it manually with 'npm install -g vercel'.${colors.reset}`);
      process.exit(1);
    }
  }

  // Ask if user wants to run build first
  rl.question(`${colors.yellow}Do you want to run a build first to check for errors? (y/n) ${colors.reset}`, (answer) => {
    if (answer.toLowerCase() === 'y') {
      const buildSuccess = runBuild();
      if (!buildSuccess) {
        rl.close();
        return;
      }
    }

    // Ask if user wants to deploy to production
    rl.question(`${colors.yellow}Do you want to deploy to production? (y/n) ${colors.reset}`, (answer) => {
      const production = answer.toLowerCase() === 'y';
      deployToVercel(production);
      rl.close();
    });
  });
}

// Run the main function
main().catch(error => {
  console.error(`${colors.red}An error occurred:${colors.reset}`, error);
  process.exit(1);
});
