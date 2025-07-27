// src/services/aiService.ts

let currentApiKey = '';

export const setApiKey = (key: string) => {
  currentApiKey = key;
  // Optionally store in localStorage/sessionStorage
  localStorage.setItem('aiToken', key);
};

export const validateApiKey = async (key: string): Promise<boolean> => {
  const API_URL = "https://api.chatanywhere.org/v1/chat/completions";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "deepseek-v3",
        messages: [{ role: "system", content: "Token validation check" }],
        max_tokens: 5
      })
    });

    // If unauthorized, response.ok will be false
    return response.ok;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

export const getAIResponse = async (prompt: string, diagramContext: string) => {
  if (!currentApiKey) {
    const storedToken = localStorage.getItem('aiToken');
    if (storedToken) {
      currentApiKey = storedToken;
    } else {
      throw new Error('API key not set. Please authenticate first.');
    }
  }

  const API_URL = "https://api.chatanywhere.org/v1/chat/completions";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${currentApiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-v3",
        messages: [
          {
            role: "system",
            content: `You are a professional assurance case diagram assistant that focus on GSN and SACM Templates. 
        Always respond with TWO SEPARATE JSON OBJECTS named 'shapes' and 'connections' in valid JavaScript object notation.
        Example format:
        shapes = [{ id: "G1", type: "goal", mainText: "Example goal" }];
        connections = [{ id: "conn1", from: "G1", to: "S1", style: "line", fromPoint: "bottom", toPoint: "top"}];
        Current diagram: ${diagramContext}`
          },
          {
            role: "user",
            content: `${prompt}\n\nPlease provide the response in two separate objects: shapes[] and connections[] as shown in the example.`
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      // Clear invalid token
      if (response.status === 401) {
        currentApiKey = '';
        localStorage.removeItem('aiToken');
      }
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No response from AI";
  } catch (error) {
    console.error("AI API Error:", error);
    throw error;
  }
};