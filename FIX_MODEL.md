# 🔧 Quick Fix for Model Error

## Step 1: Update the Package (Important!)

The package might be outdated. Update it:

```bash
npm update @google/generative-ai
```

OR install latest version:

```bash
npm install @google/generative-ai@latest
```

## Step 2: Find Which Model Works

Run this to see which models work with your API key:

```bash
node src/list-models.js
```

This will test all model names and show which ones work.

## Step 3: Update .env with Working Model

Based on the output, add to your `.env`:

```env
GEMINI_MODEL=gemini-1.5-flash-latest
```

Or whichever model the script shows as working.

## Step 4: Restart Backend

```bash
npm start
```

## Alternative: Manual Test

If the script doesn't work, try these model names in your `.env` one by one:

```env
# Try these in order:
GEMINI_MODEL=gemini-1.5-flash-latest
# If that fails, try:
GEMINI_MODEL=gemini-1.5-pro-latest
# If that fails, try:
GEMINI_MODEL=gemini-1.5-flash
```

Then restart after each change.

