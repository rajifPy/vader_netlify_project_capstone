# VADER Sentiment Netlify Project (Frontend + Netlify Functions)


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

---
## Notes & Tips
- Netlify Functions will install `vader-sentiment` during build. Ensure Node version compatibility (Node >=16 recommended).
- Keep `maxTokens` small (e.g. 6-12) to limit the number of sentiment computations and avoid long execution time / cold-starts.
- If you need higher accuracy for Bahasa Indonesia, consider replacing function logic with an Indonesian model inference (Hugging Face) or translating text to English before scoring.
