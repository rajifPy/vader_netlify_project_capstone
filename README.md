# VADER Sentiment Netlify Project (Frontend + Netlify Functions)

This project includes a static frontend (in `public/`) and two Netlify Functions (serverless):
- `/.netlify/functions/sentiment`  -> returns VADER sentiment scores for a given text
- `/.netlify/functions/explain`    -> performs leave-one-out explainability (limited tokens)

**Important:** VADER is primarily designed for English. For Bahasa Indonesia, accuracy may be limited. Consider translating text to English server-side or use an Indonesian model for production.

---
## LINK DEMO
- https://sentimenanalisis.netlify.app/
---
## Local testing with Netlify CLI (recommended)
1. Install Netlify CLI globally (if not installed):
   ```bash
   npm install -g netlify-cli
   ```
2. From project root, install dependencies:
   ```bash
   npm install
   ```
3. Run locally (this serves static site and functions):
   ```bash
   netlify dev
   ```
   - Open `http://localhost:8888` (or as printed).  
   - Functions are available under `/.netlify/functions/*`

---
## Deploy to Netlify (via Git)
1. Create a new Git repository and push the project.  
2. Go to https://app.netlify.com → "New site from Git". Connect your repo.  
3. Build settings: leave default. Netlify will read `netlify.toml` to set `functions` and `publish` folders.  
4. Deploy. After deployment, the frontend will be live and functions accessible at `/.netlify/functions/sentiment` etc.

---
## API Usage (Frontend already wired)
### POST /.netlify/functions/sentiment
Request body (JSON): `{ "text": "your text here" }`  
Response: `{ text, scores }` where `scores` contains `neg`, `neu`, `pos`, `compound`

### POST /.netlify/functions/explain
Request body (JSON): `{ "text": "your text here", "maxTokens": 8 }`  
Response: `{ text, baseline, baselineCompound, contributions: [ { word, raw, tokenCompound, delta, modifiedText }, ... ] }`

---
## Notes & Tips
- Netlify Functions will install `vader-sentiment` during build. Ensure Node version compatibility (Node >=16 recommended).
- Keep `maxTokens` small (e.g. 6-12) to limit the number of sentiment computations and avoid long execution time / cold-starts.
- If you need higher accuracy for Bahasa Indonesia, consider replacing function logic with an Indonesian model inference (Hugging Face) or translating text to English before scoring.
