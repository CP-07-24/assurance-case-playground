import { FileText, Shapes, Play, GitBranch, Users } from 'lucide-react';
import { NavigationItem, DocumentationContent } from './types';

export const documentationData: Record<string, DocumentationContent> = {
  'introduction-gsn': {
    title: 'Introduction of GSN',
    content: `
      <h2><strong>Introduction of GSN</strong></h2>
      <p>GSN is a graphical argument notation used to document the components and structure of an argument, as well as its connections to supporting evidence.</p>
      
      <p>The aim of GSN is to document how claims (conclusions, shown as goals in GSN) are considered to be supported by underlying sub-claims (premises, also depicted as goals in GSN).</p>
      
      <p>Guidance in the Layout of the Notation, the claim structure of the argument progresses downwards, from the most abstract claim, recorded in the top-level goal, to an assertion about some item of evidence, recorded in the lowest goal in the structure. The evidence supports the detailed claim immediately above it. The structure is closed out by a reference to the evidence item, recorded in a GSN solution. A GSN structure should be a directed acyclic graph (loops are not allowed).</p>
    `
  },
  'gsn-elements': {
    title: 'GSN Elements',
    content: `
      <h2>GSN Elements Overview</h2>
      <p>GSN provides several types of elements to build your argument structure:</p>
      
      <h3>Core Elements:</h3>
      <ul>
        <li><strong>Goal (Rectangle)</strong> - A claim or objective to be achieved. Goals represent statements that need to be supported by evidence or further decomposed into sub-goals.</li>
        <li><strong>Context (Rounded Rectangle)</strong> - Information that clarifies the goal. Context provides background information and clarifies the scope or meaning of goals.</li>
        <li><strong>Solution (Circle)</strong> - Evidence that supports a goal. Solutions represent the actual evidence, such as test results, analysis reports, or documentation.</li>
        <li><strong>Strategy (Parallelogram)</strong> - The reasoning approach used to decompose a goal into sub-goals. Strategies explain the argument structure.</li>
        <li><strong>Assumption (Oval)</strong> - Assumptions made in the argument. These are statements taken to be true without proof.</li>
        <li><strong>Justification (Oval)</strong> - Justification for the argument approach. These explain why a particular strategy or approach is valid.</li>
      </ul>
      
      <h3>Extension Elements:</h3>
      <ul>
        <li><strong>Undeveloped Goal</strong> - Goals that need further development but are not yet fully detailed</li>
        <li><strong>Away Goal</strong> - Goals that are defined and supported elsewhere in the documentation</li>
        <li><strong>Public Definition</strong> - Publicly available definitions that can be referenced</li>
      </ul>
      
      <h3>Relationships:</h3>
      <ul>
        <li><strong>Supported By</strong> - Shows that a goal is supported by sub-goals, strategies, or solutions</li>
        <li><strong>In Context Of</strong> - Links goals to their context or assumptions</li>
      </ul>
    `
  },
  'gsn-example': {
    title: 'GSN Example Diagram',
    content: `
      <h2>GSN Example Diagram</h2>
      <p>Here's a practical example of how GSN elements work together to form a complete argument structure:</p>
      
      <h3>Example: Software Safety Argument</h3>
      <p>Consider a safety argument for a software system:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4>Top-Level Goal:</h4>
        <p><strong>G1:</strong> "Software X is acceptably safe for operation"</p>
        
        <h4>Context:</h4>
        <p><strong>C1:</strong> "Operating in automotive environment"<br>
        <strong>C2:</strong> "Safety requirements defined in standard ISO 26262"</p>
        
        <h4>Strategy:</h4>
        <p><strong>S1:</strong> "Argument by demonstrating compliance with safety lifecycle"</p>
        
        <h4>Sub-Goals:</h4>
        <p><strong>G2:</strong> "Hazard analysis is complete and correct"<br>
        <strong>G3:</strong> "Safety requirements are correctly implemented"<br>
        <strong>G4:</strong> "Software testing demonstrates safety"</p>
        
        <h4>Solutions (Evidence):</h4>
        <p><strong>Sn1:</strong> "HAZOP analysis report"<br>
        <strong>Sn2:</strong> "Code review results"<br>
        <strong>Sn3:</strong> "Test execution report"</p>
      </div>
      
      <h3>Structure Flow:</h3>
      <ol>
        <li>Start with the top-level goal (G1)</li>
        <li>Add context to clarify the goal (C1, C2)</li>
        <li>Define the strategy for achieving the goal (S1)</li>
        <li>Break down into manageable sub-goals (G2, G3, G4)</li>
        <li>Support each sub-goal with concrete evidence (Sn1, Sn2, Sn3)</li>
      </ol>
    `
  },
  'introduction-sacmn': {
    title: 'Introduction of SACMN',
    content: `
      <h2>Structured Assurance Case Metamodel Notation (SACMN)</h2>
      <p>SACMN is an extension and standardization of GSN that provides a more structured approach to creating assurance cases. It builds upon GSN principles while adding more formal semantics and relationships.</p>
      
      <h3>Key Features of SACMN:</h3>
      <ul>
        <li><strong>Formal Metamodel</strong> - Provides a precise definition of elements and their relationships</li>
        <li><strong>Extended Semantics</strong> - More detailed meaning for each element type</li>
        <li><strong>Tool Interoperability</strong> - Standardized format for tool exchange</li>
        <li><strong>Traceability</strong> - Enhanced support for tracing between elements</li>
      </ul>
      
      <h3>Relationship to GSN:</h3>
      <p>SACMN incorporates all GSN elements but provides:</p>
      <ul>
        <li>More precise definitions of element types</li>
        <li>Formal rules for element composition</li>
        <li>Extended relationship types</li>
        <li>Support for modularity and reuse</li>
      </ul>
      
      <h3>Benefits:</h3>
      <ul>
        <li><strong>Consistency</strong> - Ensures consistent interpretation across tools and users</li>
        <li><strong>Automation</strong> - Enables automated analysis and validation</li>
        <li><strong>Scalability</strong> - Better support for large, complex assurance cases</li>
        <li><strong>Reusability</strong> - Supports modular argument patterns</li>
      </ul>
    `
  },
  'sacmn-elements': {
    title: 'SACMN Elements',
    content: `
      <h2>SACMN Elements</h2>
      <p>SACMN builds upon GSN elements with enhanced definitions and additional element types:</p>
      
      <h3>Core SACMN Elements:</h3>
      <ul>
        <li><strong>Claim</strong> - A statement that requires support (similar to GSN Goal)</li>
        <li><strong>Evidence</strong> - Information that supports claims (similar to GSN Solution)</li>
        <li><strong>Argument Reasoning</strong> - Explanation of how evidence supports claims (similar to GSN Strategy)</li>
        <li><strong>Context</strong> - Contextual information with enhanced semantics</li>
      </ul>
      
      <h3>Extended Elements:</h3>
      <ul>
        <li><strong>Artifact Reference</strong> - Links to external artifacts and documents</li>
        <li><strong>Claim Reference</strong> - References to claims defined elsewhere</li>
        <li><strong>Modular Argument</strong> - Self-contained argument modules</li>
        <li><strong>Argument Package</strong> - Collections of related argument elements</li>
      </ul>
      
      <h3>Relationship Types:</h3>
      <ul>
        <li><strong>Supports</strong> - Evidence or sub-claims support higher-level claims</li>
        <li><strong>Context Of</strong> - Context provides background for claims</li>
        <li><strong>Assumes</strong> - Claims that depend on assumptions</li>
        <li><strong>Refutes</strong> - Evidence that contradicts claims</li>
        <li><strong>Cites</strong> - References to external sources</li>
      </ul>
      
      <h3>Properties:</h3>
      <ul>
        <li><strong>Confidence</strong> - Level of confidence in claims or evidence</li>
        <li><strong>Status</strong> - Development status (draft, reviewed, approved)</li>
        <li><strong>Provenance</strong> - Origin and authorship information</li>
        <li><strong>Timestamps</strong> - Creation and modification dates</li>
      </ul>
    `
  },
  'sacmn-example': {
    title: 'SACMN Example Diagram',
    content: `
      <h2>SACMN Example Diagram</h2>
      <p>Here's an example showing how SACMN extends GSN concepts with more formal structure:</p>
      
      <h3>Example: Medical Device Safety Assurance</h3>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4>Top-Level Claim:</h4>
        <p><strong>C1:</strong> "Medical Device X is safe for patient use"<br>
        <em>Status: Under Review | Confidence: High | Owner: Safety Team</em></p>
        
        <h4>Context Module:</h4>
        <p><strong>CT1:</strong> "Regulatory Context"<br>
        - FDA Class II device requirements<br>
        - IEC 62304 software lifecycle standard<br>
        - ISO 14971 risk management standard</p>
        
        <h4>Argument Reasoning:</h4>
        <p><strong>AR1:</strong> "Safety demonstration through multi-domain analysis"<br>
        <em>Justification: Comprehensive approach covering hardware, software, and user interaction</em></p>
        
        <h4>Sub-Claims:</h4>
        <p><strong>C2:</strong> "Hardware hazards are adequately controlled"<br>
        <strong>C3:</strong> "Software safety requirements are satisfied"<br>
        <strong>C4:</strong> "User interface prevents use errors"</p>
        
        <h4>Evidence Artifacts:</h4>
        <p><strong>E1:</strong> Artifact Reference → "FMEA_Analysis_v2.1.pdf"<br>
        <strong>E2:</strong> Artifact Reference → "SW_Safety_Test_Report.pdf"<br>
        <strong>E3:</strong> Artifact Reference → "Usability_Study_Results.pdf"</p>
      </div>
      
      <h3>SACMN Enhancements:</h3>
      <ul>
        <li><strong>Modular Structure</strong> - Each domain (HW, SW, UI) can be developed separately</li>
        <li><strong>Artifact Integration</strong> - Direct links to evidence documents with version control</li>
        <li><strong>Metadata Tracking</strong> - Status, confidence, and ownership information</li>
        <li><strong>Formal Relationships</strong> - Precise definition of how evidence supports claims</li>
        <li><strong>Traceability</strong> - Clear links between requirements, claims, and evidence</li>
      </ul>
      
      <h3>Tool Benefits:</h3>
      <ul>
        <li>Automated consistency checking</li>
        <li>Impact analysis for changes</li>
        <li>Progress tracking and reporting</li>
        <li>Multi-user collaboration support</li>
      </ul>
    `
  }
};

export const navigationStructure: NavigationItem[] = [
  {
    id: 'gsn-section',
    label: 'Goal Structuring Notation (GSN)',
    icon: FileText,
    children: [
      { id: 'introduction-gsn', label: 'Introduction of GSN', icon: Play },
      { id: 'gsn-elements', label: 'GSN Elements', icon: Shapes },
      { id: 'gsn-example', label: 'Example Diagram', icon: GitBranch }
    ]
  },
  {
    id: 'sacmn-section',
    label: 'Structured Assurance Case Metamodel Notation (SACMN)',
    icon: Users,
    children: [
      { id: 'introduction-sacmn', label: 'Introduction of SACMN', icon: Play },
      { id: 'sacmn-elements', label: 'SACMN Elements', icon: Shapes },
      { id: 'sacmn-example', label: 'Example Diagram', icon: GitBranch }
    ]
  }
];