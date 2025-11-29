import type { VercelRequest, VercelResponse } from '@vercel/node';

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          {
            role: "user",
            content: "Generate a short, inspiring daily quote or micro-blog post about Montessori parenting, nature, or child development. Focus on the beauty of the ordinary."
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const quote = data.choices?.[0]?.message?.content || "Observe the child.";

    return res.status(200).json({ quote });
  } catch (error) {
    console.error("Quote generation error:", error);
    return res.status(200).json({ quote: "Peace is what every child is seeking." });
  }
}
