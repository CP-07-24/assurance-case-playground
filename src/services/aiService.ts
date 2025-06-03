// src/services/aiService.ts
export const getAIResponse = async (prompt: string, diagramContext: string) => {
  const API_KEY = "sk-JLb9ot7WIQV2uGZed4Dhb0duvsxkOAxteoAPvrL5ooKfQTbS";
  const API_URL = "https://api.chatanywhere.org/v1/chat/completions";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-v3",
        messages: [
          {
            role: "system",
            content: `You are a professional diagram assistant. Help users with diagram creation, analysis and optimization. Current diagram has ${diagramContext}. Respond concisely.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || "I couldn't process that request.";
  } catch (error) {
    console.error("AI API Error:", error);
    return "Sorry, there was an error processing your request.";
  }
};