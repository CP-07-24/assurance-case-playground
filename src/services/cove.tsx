// src/components/cove.tsx
import { getAIResponse } from '../services/aiService';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  correctedOutput?: string;
}

export const validateOutput = async (
  originalInput: string,
  generatedOutput: string,
  context: string
): Promise<ValidationResult> => {
  const prompt = `
  Validate this generated output against the original input:
  
  Original Input: ${originalInput}
  Generated Output: ${generatedOutput}
  Context: ${context}
  
  Perform these checks:
  1. Structural: Verify GSN/SACMN hierarchy is correct
  2. Logical: Ensure arguments flow logically
  3. Completeness: All key elements from input are addressed
  4. Consistency: No contradictions in the reasoning
  
  Return a JSON object with:
  - isValid: boolean
  - errors: string[] (if any)
  - correctedOutput: string (if errors found)
  `;

  try {
    const response = await getAIResponse(prompt, "CoVe validation");
    const result: ValidationResult = JSON.parse(response);
    
    if (!result.isValid && !result.correctedOutput) {
      // If invalid but no correction provided, attempt to generate one
      const correctionPrompt = `
      The following output failed validation:
      ${generatedOutput}
      
      Errors detected:
      ${result.errors.join("\n")}
      
      Please provide a corrected version that:
      1. Fixes all identified errors
      2. Maintains the original intent
      3. Preserves the GSN/SACMN structure
      `;
      
      result.correctedOutput = await getAIResponse(correctionPrompt, "CoVe correction");
    }
    
    return result;
  } catch (error) {
    console.error("CoVe Validation Error:", error);
    return {
      isValid: false,
      errors: ["Validation failed due to system error"]
    };
  }
};

export const CoVeComponent = ({
  input,
  output,
  context,
  onValidate
}: {
  input: string;
  output: string;
  context: string;
  onValidate: (result: ValidationResult) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async () => {
    if (!input || !output) return;
    
    setIsLoading(true);
    try {
      const result = await validateOutput(input, output, context);
      onValidate(result);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cove-validator">
      <h3>Chain-of-Verification</h3>
      <button 
        onClick={handleValidate} 
        disabled={isLoading || !input || !output}
      >
        {isLoading ? "Validating..." : "Validate Output"}
      </button>
    </div>
  );
};