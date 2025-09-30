# News AI

A React-based news application that fetches news articles and provides AI-powered summaries using OpenAI.

## Features

- 📰 Fetch news articles from various topics (tech, sports, finance, health, entertainment)
- 🤖 AI-powered article summaries using OpenAI GPT-3.5
- 🎨 Modern, responsive UI with dark mode support
- 📱 Mobile-friendly design
- 🔊 Text-to-speech for summaries

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd News-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up API keys**
   
   Create a `.env` file in the root directory with the following variables:
   
   ```env
   # News API Key - Get from https://newsapi.org/
   VITE_NEWSAPI_KEY=your_news_api_key_here
   
   # OpenAI API Key - Get from https://platform.openai.com/
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Get API keys**
   - **News API**: Sign up at [newsapi.org](https://newsapi.org/) to get a free API key
   - **OpenAI API**: Sign up at [platform.openai.com](https://platform.openai.com/) to get an API key

5. **Run the development server**
   ```bash
   npm run dev
   ```

## Usage

1. Select a news topic from the dropdown
2. Browse through the fetched articles
3. Click "Summary" to get an AI-generated summary
4. Click "Full News" to read the complete article
5. Use the "Listen" button to hear the summary

## Technologies Used

- React 19
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- News API
- OpenAI API

## API Endpoints

- **News API**: Fetches articles from [newsapi.org](https://newsapi.org/)
- **OpenAI API**: Generates article summaries using GPT-3.5

## Troubleshooting

- **API Error**: Make sure your API keys are correctly set in the `.env` file
- **No News**: Check if your News API key is valid and has remaining requests
- **Summary Failed**: Verify your OpenAI API key and check your account balance

## Deploying to Vercel

1. Ensure you have a Vercel account and the Vercel CLI installed.
   ```bash
   npm i -g vercel
   ```

2. This project includes `vercel.json` for a Vite SPA with proper rewrites.

3. Set environment variables in Vercel (Project Settings → Environment Variables):
   - `VITE_NEWSAPI_KEY`
   - `VITE_OPENAI_API_KEY`
   - (optional) `VITE_HUGGINGFACE_API_KEY` if you use Hugging Face on `ArticlePage`.

4. Deploy
   ```bash
   vercel
   vercel --prod
   ```

Vercel will run `npm run build` and serve the `dist` output. Client-side routing is handled by a SPA rewrite to `index.html`.


