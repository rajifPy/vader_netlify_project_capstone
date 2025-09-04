const analyzeBtn = document.getElementById('analyzeBtn');
const explainBtn = document.getElementById('explainBtn');
const inputText = document.getElementById('inputText');
const resultDiv = document.getElementById('result');
const explainDiv = document.getElementById('explain');

async function postJson(url, body) {
  const r = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  return await r.json();
}

analyzeBtn.addEventListener('click', async () => {
  resultDiv.textContent = '...loading';
  explainDiv.textContent = '';
  try {
    const text = inputText.value.trim();
    const data = await postJson('/.netlify/functions/sentiment', { text });
    resultDiv.textContent = JSON.stringify(data, null, 2);
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
    explainDiv.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    explainDiv.textContent = 'Error: ' + err.message;
  }
});
