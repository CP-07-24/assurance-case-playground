// src/components/coc.tsx
import { getAIResponse } from '../services/aiService';

export const generateMermaidCode = async (scotStructure: any): Promise<string> => {
  const prompt = `
  Convert this GSN/SACMN structure into Mermaid.js code:
  ${JSON.stringify(scotStructure, null, 2)}
  
  Rules:
  1. Use proper Mermaid GSN syntax
  2. Maintain all hierarchical relationships
  3. Include proper styling for different element types
  4. Add brief descriptions as tooltips
  
  Return ONLY the Mermaid code block without any additional explanation.
  `;

  try {
    const response = await getAIResponse(prompt, "CoC generation");
    // Extract mermaid code from response
    const mermaidCode = response.match(/```mermaid([\s\S]*?)```/)?.[1] || response;
    return mermaidCode.trim();
  } catch (error) {
    console.error("CoC Generation Error:", error);
    throw new Error("Failed to generate Mermaid code");
  }
};

export const CoCComponent = ({ scotData, onGenerate }: { 
  scotData: any, 
  onGenerate: (code: string) => void 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!scotData) return;
    
    setIsLoading(true);
    try {
      const code = await generateMermaidCode(scotData);
      onGenerate(code);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="coc-generator">
      <h3>Chain-of-Code Generator</h3>
      <button 
        onClick={handleGenerate} 
        disabled={isLoading || !scotData}
      >
        {isLoading ? "Generating..." : "Generate Mermaid Code"}
      </button>
    </div>
  );
};