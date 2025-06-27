// src/components/scot.tsx
import { getAIResponse } from '../services/aiService';

interface SCOTResult {
  goals: string[];
  strategies: string[];
  subgoals: string[];
  evidence: string[];
}

export const generateSCOTStructure = async (systemDescription: string): Promise<SCOTResult> => {
  const prompt = `
  Analyze this system description and generate a structured assurance case using GSN/SACMN notation.
  Break down into these components:
  1. Top-Level Goals (3-5 items)
  2. Supporting Strategies for each goal
  3. Sub-Goals for each strategy
  4. Evidence/Support for each sub-goal
  
  System Description: ${systemDescription}
  
  Format your response as a JSON object with keys: goals, strategies, subgoals, evidence.
  `;

  try {
    const response = await getAIResponse(prompt, "SCOT generation");
    const parsed = JSON.parse(response) as SCOTResult;
    
    // Basic validation
    if (!parsed.goals || !parsed.strategies) {
      throw new Error("Invalid SCOT structure generated");
    }
    
    return parsed;
  } catch (error) {
    console.error("SCOT Generation Error:", error);
    throw new Error("Failed to generate SCOT structure");
  }
};

export const SCOTComponent = ({ onGenerate }: { onGenerate: (result: SCOTResult) => void }) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generateSCOTStructure(input);
      onGenerate(result);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="scot-generator">
      <h3>SCOT Generator</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter system description..."
      />
      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Structure"}
      </button>
    </div>
  );
};