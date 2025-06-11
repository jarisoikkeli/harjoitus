import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// OpenRouter API
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo', // TÄRKEÄÄ: käytä OpenRouterin mallin nimeä
      messages: [{ role: 'user', content: message }],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error('🔥 Virhe OpenRouter-yhteydessä:', err.response?.data || err.message || err);
    res.status(500).send('OpenAI error');
  }
});

app.listen(3001, () => console.log('✅ API-palvelin käynnissä portissa 3001'));
