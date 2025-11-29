export const generateMariaResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.reply || "I apologize, but I am in deep observation at the moment.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "My dear, there seems to be a disturbance in our connection. Let us pause and try again later.";
  }
};

export const generateBlogSummary = async (): Promise<string> => {
  try {
    const response = await fetch('/api/quote');

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.quote || "Observe the child.";
  } catch (error) {
    return "Peace is what every child is seeking.";
  }
};
