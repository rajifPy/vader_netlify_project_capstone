const analyzeBtn = document.getElementById('analyzeBtn');
const explainBtn = document.getElementById('explainBtn');
const inputText = document.getElementById('inputText');
const resultDiv = document.getElementById('result');
const explainDiv = document.getElementById('explain');

async function postJson(url, body) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return await r.json();
}

// 🔎 fungsi interpretasi skor
function interpretSentiment(scores) {
  if (scores.compound >= 0.05) return "Positif 🙂";
  if (scores.compound <= -0.05) return "Negatif 🙁";
  return "Netral 😐";
}

analyzeBtn.addEventListener('click', async () => {
  resultDiv.textContent = '...loading';
  explainDiv.textContent = '';
  try {
    const text = inputText.value.trim();
    const data = await postJson('/.netlify/functions/sentiment', { text });
    const sentiment = interpretSentiment(data.scores);

    resultDiv.innerHTML = `
      <p><b>Teks:</b> ${data.text}</p>
      <p><b>Sentimen:</b> ${sentiment}</p>
      <p><b>Detail skor:</b></p>
      <pre>${JSON.stringify(data.scores, null, 2)}</pre>
    `;
  } catch (err) {
    resultDiv.textContent = 'Error: ' + err.message;
  }
});

explainBtn.addEventListener('click', async () => {
  explainDiv.textContent = '...loading';
  resultDiv.textContent = '';
  try {
    const text = inputText.value.trim();
    const data = await postJson('/.netlify/functions/explain', { text, maxTokens: 8 });

    explainDiv.innerHTML = `
      <p><b>Explanation (leave-one-out):</b></p>
      <pre>${JSON.stringify(data.deltas, null, 2)}</pre>
    `;
  } catch (err) {
    explainDiv.textContent = 'Error: ' + err.message;
  }
});
