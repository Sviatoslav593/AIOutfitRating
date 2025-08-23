# Quick Setup Guide 🚀

## 1. Install Dependencies

```bash
npm install
```

## 2. Setup Environment Variables

1. Copy the example environment file:

```bash
cp env.example .env.local
```

2. Edit `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=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
```

**Get your API key from:** https://platform.openai.com/api-keys

## 3. Run the App

```bash
npm run dev
```

The app will be available at http://localhost:3000 (or 3001 if 3000 is in use).

## 4. Test the App

1. Upload an outfit photo
2. Wait for AI analysis (3-5 seconds)
3. View your personalized rating and feedback!

## Troubleshooting

- Make sure you have billing set up on your OpenAI account
- The API key should start with `sk-`
- If port 3000 is busy, the app will automatically use 3001
