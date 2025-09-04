const vader = require('vader-sentiment');

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
    if (!text) {
      return { statusCode: 400, headers: {'Access-Control-Allow-Origin':'*'}, body: JSON.stringify({ error: 'text is required' }) };
    }
    const scores = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ text, scores })
    };
  } catch (err) {
    return { statusCode: 500, headers: {'Access-Control-Allow-Origin':'*'}, body: JSON.stringify({ error: err.message }) };
  }
};
