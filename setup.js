#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

console.log('🚀 Setting up News AI environment...\n');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists!');
  process.exit(0);
}

// Create .env.example if it doesn't exist
if (!fs.existsSync(envExamplePath)) {
  const envContent = `# News API Key - Get from https://newsapi.org/
VITE_NEWSAPI_KEY=your_news_api_key_here

# OpenAI API Key - Get from https://platform.openai.com/
VITE_OPENAI_API_KEY=your_openai_api_key_here
`;

  fs.writeFileSync(envExamplePath, envContent);
  console.log('📝 Created .env.example file');
}

// Create .env file
const envContent = `# News API Key - Get from https://newsapi.org/
VITE_NEWSAPI_KEY=your_news_api_key_here

# OpenAI API Key - Get from https://platform.openai.com/
VITE_OPENAI_API_KEY=your_openai_api_key_here
`;

fs.writeFileSync(envPath, envContent);

console.log('✅ Created .env file');
console.log('\n📋 Next steps:');
console.log('1. Get your News API key from: https://newsapi.org/');
console.log('2. Get your OpenAI API key from: https://platform.openai.com/');
console.log('3. Replace the placeholder values in the .env file with your actual API keys');
console.log('4. Run "npm run dev" to start the application');
console.log('\n⚠️  Remember: Never commit your .env file to version control!');
