import { PRODUCTS } from "../constants";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const getApiKey = (): string => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY is missing from environment variables.");
  }
  return apiKey || '';
};

export const generateMariaResponse = async (userMessage: string): Promise<string> => {
  try {
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

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userMessage }
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I apologize, but I am in deep observation at the moment.";
  } catch (error) {
    console.error("Groq Error:", error);
    return "My dear, there seems to be a disturbance in our connection. Let us pause and try again later.";
  }
};

export const generateBlogSummary = async (): Promise<string> => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getApiKey()}`,
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
    return data.choices?.[0]?.message?.content || "Observe the child.";
  } catch (error) {
    return "Peace is what every child is seeking.";
  }
};
