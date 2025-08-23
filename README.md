# AI Outfit Rater 🤖✨

A modern TikTok-style Next.js application for rating outfits using AI technology.

## Features

- 🎨 Modern TikTok-inspired UI design
- 📱 Mobile-first responsive layout
- 🤖 AI-powered outfit analysis with OpenAI Vision API
- ⚡ Real-time image analysis and rating
- 💫 Smooth loading states and animations
- 🎭 Drag & drop file upload
- 🌟 Beautiful gradients and TikTok-style effects

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API Key

1. Copy `env.example` to `.env.local`
2. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
3. Add your API key to `.env.local`:

```
OPENAI_API_KEY=your_actual_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## API Integration

The app uses OpenAI's GPT-4 Vision API to analyze outfit photos and provide:

- **Rating**: 1-10 score based on style, fit, and coordination
- **Style Category**: Classification (casual, elegant, sporty, etc.)
- **Description**: Detailed analysis of the outfit's strengths

## Project Structure

```
/pages
  - index.js          # Main homepage with state management
  - _app.js           # App wrapper
  - /api
    - analyze.js      # OpenAI Vision API integration
/components
  - UploadForm.js     # File upload with API integration
  - ResultCard.js     # AI analysis result display
  - LoadingCard.js    # Loading state component
/styles
  - globals.css       # Global styles and Tailwind
```

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion
- OpenAI Vision API
- Formidable (file uploads)

## Usage

1. Upload an outfit photo by dragging & dropping or clicking to browse
2. Wait for AI analysis (usually 3-5 seconds)
3. View your personalized rating and style feedback
4. Share results or try another outfit!

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for vision analysis
