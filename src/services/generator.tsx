// src/components/assuranceCaseGenerator.tsx
import { useState } from 'react';
import { SCOTComponent } from './scot';
import { CoCComponent } from './coc';
import { CoVeComponent } from './cove';

export const AssuranceCaseGenerator = () => {
  const [scotResult, setScotResult] = useState<any>(null);
  const [mermaidCode, setMermaidCode] = useState<string>("");
  const [validationResult, setValidationResult] = useState<any>(null);
  const [context, setContext] = useState<string>("");

  return (
    <div className="generator-container">
      <h2>Assurance Case Generator</h2>
      
      <SCOTComponent 
        onGenerate={(result) => {
          setScotResult(result);
          setContext(JSON.stringify(result));
        }} 
      />
      
      {scotResult && (
        <CoCComponent 
          scotData={scotResult}
          onGenerate={setMermaidCode}
        />
      )}
      
      {mermaidCode && (
        <CoVeComponent
          input={JSON.stringify(scotResult)}
          output={mermaidCode}
          context={context}
          onValidate={setValidationResult}
        />
      )}
      
      {validationResult && (
        <div className="validation-results">
          <h4>Validation Results</h4>
          {validationResult.isValid ? (
            <p>✅ Output is valid!</p>
          ) : (
            <>
              <p>❌ Found {validationResult.errors.length} issues:</p>
              <ul>
                {validationResult.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
              {validationResult.correctedOutput && (
                <button onClick={() => setMermaidCode(validationResult.correctedOutput)}>
                  Apply Corrections
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};