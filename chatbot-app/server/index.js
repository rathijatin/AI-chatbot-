const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const GEMINI_API_KEY = process.env.AIzaSyAiSj11yTdG7wC7rp6CMMknPTyFn8Wv4w4 || 'AIzaSyAiSj11yTdG7wC7rp6CMMknPTyFn8Wv4w4';


app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided.' });

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.AIzaSyAiSj11yTdG7wC7rp6CMMknPTyFn8Wv4w4}`,
      {
        contents: [{ parts: [{ text: message }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const aiMessage = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
    res.json({ reply: aiMessage });
  } catch (err) {
    console.error('Gemini API error:', err.response?.data || err.message || err);
    res.status(500).json({ error: 'AI service error', details: err.response?.data || err.message || err });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
