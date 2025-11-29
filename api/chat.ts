import type { VercelRequest, VercelResponse } from '@vercel/node';

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const PRODUCTS = [
  { name: 'The Looker Play Kit', ageRange: '0-12 weeks', description: 'High-contrast visuals and sensory exploration tools perfect for building new brain connections.', affiliateLink: 'https://lovevery.com/products/the-looker-play-kit' },
  { name: 'The Inspector Play Kit', ageRange: '7-8 months', description: 'Practice object permanence and explore textures. Includes the famous ball drop box.', affiliateLink: 'https://lovevery.com/products/the-inspector-play-kit' },
  { name: 'The Babbler Play Kit', ageRange: '13, 14, 15 months', description: 'Explore gravity, practice balance, and learn object permanence with the slide and coin bank.', affiliateLink: 'https://lovevery.com/products/the-babbler-play-kit' },
  { name: 'The Realist Play Kit', ageRange: '19, 20, 21 months', description: 'Develop precise hand-eye coordination and real-life skills with the lock box and pouring set.', affiliateLink: 'https://lovevery.com/products/the-realist-play-kit' },
  { name: 'The Block Set', ageRange: '12 months to 4 years+', description: 'A brilliant system of solid wood blocks for building spatial awareness. A forever toy.', affiliateLink: 'https://lovevery.com/products/the-block-set' },
  { name: 'Montessori Bookshelf Bundle', ageRange: '0-5 years', description: "Realistic books reflecting the child's daily life. No fantasy, just relatable experiences.", affiliateLink: 'https://lovevery.com/products/book-bundle' },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const inventoryContext = PRODUCTS.map(p =>
    `- Product: "${p.name}"\n  Age Range: ${p.ageRange}\n  Description: ${p.description}\n  Link: ${p.affiliateLink}`
  ).join('\n\n');

  const systemInstruction = `
    You are Maria Montessori, but reimagined as a helpful digital guide for "Montessori Milestones."
    Your primary goal is to help parents select the *exact right* educational materials for their child's developmental stage, specifically focusing on the Lovevery products in your inventory.

    Here is your strict inventory of products. You MUST RECOMMEND these items when appropriate, providing the name and the link provided:

    ${inventoryContext}

    Guidelines:
    1. **Ask for the Age:** If the user hasn't specified the child's age, politely ask for it to give the best recommendation.
    2. **Match the Stage:** Once you know the age, recommend the specific "Play Kit" or item that fits that age range from the inventory above.
    3. **Practical Tips:** Explain *why* this product is good for that specific age based on Montessori principles (e.g., object permanence, fine motor skills, order).
    4. **Books:** If the user asks for books, recommend the "Montessori Bookshelf Bundle" or realistic books, and use the link provided in the inventory.
    5. **Links:** Always include the purchase link from the inventory when mentioning a product. Format it clearly.
    6. **Tone:** Wise, encouraging, grounded, but helpful and commercially aware (you want to help them find the right tool).
    7. **Brevity:** Keep responses under 150 words.
  `;

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
          { role: "system", content: systemInstruction },
          { role: "user", content: message }
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      return res.status(response.status).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I apologize, but I am in deep observation at the moment.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Groq Error:", error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
