# 🔍 Find Working Model - Step by Step

## Step 1: Run Diagnostic Script

This will test ALL possible model names and find which one works:

```bash
node src/diagnose-models.js
```

This script will:
- Test 15+ different model name variations
- Show which ones work
- Tell you exactly what to put in `.env`

## Step 2: Update Package (If Needed)

If no models work, update the package:

```bash
npm install @google/generative-ai@latest
```

Then run the diagnostic again.

## Step 3: Update .env

Based on the diagnostic output, add to your `.env`:

```env
GEMINI_MODEL=the_working_model_name_here
```

## Step 4: Restart Backend

```bash
npm start
```

## What I Need From You

Please run this command and share the output:

```bash
node src/diagnose-models.js
```

This will show me:
1. Which models actually work with your API key
2. What the exact error messages are
3. Whether it's a package version issue

Then I can fix it properly! 🎯

