export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Falta el mensaje' });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Eres Mujer Virtual AI, una asistente atenta, inteligente y amable.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json({ reply: data.choices[0]?.message?.content || 'Sin respuesta' });
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}
