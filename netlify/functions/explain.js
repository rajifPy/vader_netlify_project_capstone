const vader = require('vader-sentiment');

function vaderScore(text) {
  return vader.SentimentIntensityAnalyzer.polarity_scores(text);
}

function tokenize(text) {
  if (!text) return [];
  const rawTokens = text.split(/\s+/).filter(Boolean);
  return rawTokens.map(t => {
    const normalized = t.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
    return { raw: t, token: normalized };
  }).filter(x => x.token.length > 0);
}

exports.handler = async function(event, context) {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const text = body.text || '';
    const maxTokens = body.maxTokens ? Number(body.maxTokens) : 10;
    if (!text) {
      return { statusCode: 400, headers: {'Access-Control-Allow-Origin':'*'}, body: JSON.stringify({ error: 'text is required' }) };
    }

    const tokens = tokenize(text);
    const baseline = vaderScore(text);
    const baselineCompound = baseline.compound ?? 0.0;
    const limited = tokens.slice(0, Math.max(0, Math.min(tokens.length, maxTokens)));

    const contributions = [];
    // compute leave-one-out by removing token at first matching occurrence
    const rawTokens = text.split(/\s+/);
    for (let i = 0; i < limited.length; i++) {
      const t = limited[i];
      // find first occurrence index in rawTokens matching normalized token
      let occurrenceIndex = -1;
      for (let j = 0; j < rawTokens.length; j++) {
        const normalized = rawTokens[j].replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
        if (normalized === t.token) { occurrenceIndex = j; break; }
      }
      let modifiedText;
      if (occurrenceIndex === -1) {
        modifiedText = rawTokens.filter(rt => rt !== t.raw).join(' ');
      } else {
        const copy = rawTokens.slice();
        copy.splice(occurrenceIndex, 1);
        modifiedText = copy.join(' ');
      }
      const sc = vaderScore(modifiedText);
      const tokenCompound = sc.compound ?? 0.0;
      const delta = baselineCompound - tokenCompound;
      contributions.push({ index: i, word: t.token, raw: t.raw, modifiedText, tokenCompound, delta });
    }

    const sorted = contributions.slice().sort((a,b) => Math.abs(b.delta) - Math.abs(a.delta));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ text, baseline, baselineCompound, tokenCount: tokens.length, analyzedTokens: limited.map(t=>t.token), contributions: sorted })
    };

  } catch (err) {
    return { statusCode: 500, headers: {'Access-Control-Allow-Origin':'*'}, body: JSON.stringify({ error: err.message }) };
  }
};
