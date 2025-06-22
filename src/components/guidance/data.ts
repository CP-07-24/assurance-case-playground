import { FileText, Shapes, HelpCircle, Lightbulb, Play } from 'lucide-react';
import { NavigationItem, GuidanceContent } from './types';

export const guidanceData: Record<string, GuidanceContent> = {
  'introduction': {
    title: 'Introduction of GSN',
    content: `
      <h2>Goal Structuring Notation (GSN)</h2>
      <p>GSN is a graphical argument notation used to document the components and structure of an argument, as well as its connections to supporting evidence.</p>
      
      <p>The aim of GSN is to allow claims (concretely, conclusions, showing goals in GSN) are considered to be supported by underlying sub-claims (premises, also depicted as goals in GSN).</p>
      
      <p>Guidance in the Layout of the GSN/CAE sub-claim structure of the argument progresses downwards, from claims that need to be supported (goals) recorded at the top of each goal to an assertion about some form of lower level claims (premises), described in the structure corresponding to this goal in the structure that is relevant immediately above it. The structure is closed out by a reference to the evidence item, recorded in a GSN solution. A GSN structure should be a directed acyclic graph (loops are not allowed).</p>
    `
  },
  'getting-started': {
    title: 'Getting Started',
    content: `
      <h2>Getting Started with GSN</h2>
      <p>Welcome to the GSN diagram editor! This guide will help you create your first argument structure.</p>
      
      <h3>Basic Steps:</h3>
      <ol>
        <li><strong>Start with a Goal</strong> - Every GSN diagram begins with a top-level goal</li>
        <li><strong>Add Sub-goals</strong> - Break down your main goal into smaller, manageable parts</li>
        <li><strong>Provide Context</strong> - Add context elements to clarify assumptions and scope</li>
        <li><strong>Include Evidence</strong> - Support your goals with concrete evidence (solutions)</li>
        <li><strong>Add Strategies</strong> - Explain your reasoning approach between goals</li>
      </ol>
      
      <p>Use the shapes panel on the left to drag and drop elements onto your canvas.</p>
    `
  },
  'gsn-elements': {
    title: 'GSN Elements',
    content: `
      <h2>GSN Elements Overview</h2>
      <p>GSN provides several types of elements to build your argument structure:</p>
      
      <h3>Core Elements:</h3>
      <ul>
        <li><strong>Goal (Rectangle)</strong> - A claim or objective to be achieved</li>
        <li><strong>Context (Rounded Rectangle)</strong> - Information that clarifies the goal</li>
        <li><strong>Solution (Circle)</strong> - Evidence that supports a goal</li>
        <li><strong>Strategy (Parallelogram)</strong> - The reasoning approach</li>
        <li><strong>Assumption (Oval)</strong> - Assumptions made in the argument</li>
        <li><strong>Justification (Oval)</strong> - Justification for the argument approach</li>
      </ul>
      
      <h3>Extension Elements:</h3>
      <ul>
        <li><strong>Undeveloped Goal</strong> - Goals that need further development</li>
        <li><strong>Away Goal</strong> - Goals defined elsewhere</li>
        <li><strong>Public Definition</strong> - Publicly available definitions</li>
      </ul>
    `
  },
  'best-practices': {
    title: 'Best Practices',
    content: `
      <h2>Best Practices for GSN</h2>
      <p>Follow these guidelines to create effective and clear argument structures:</p>
      
      <h3>Structure Guidelines:</h3>
      <ul>
        <li><strong>Keep it Simple</strong> - Start with the main argument and add detail gradually</li>
        <li><strong>Use Clear Language</strong> - Goals should be specific and measurable</li>
        <li><strong>Maintain Traceability</strong> - Every goal should link to supporting evidence</li>
        <li><strong>Avoid Circular Arguments</strong> - Ensure your structure is acyclic</li>
      </ul>
      
      <h3>Visual Guidelines:</h3>
      <ul>
        <li><strong>Consistent Layout</strong> - Arrange elements in a logical top-down flow</li>
        <li><strong>Proper Spacing</strong> - Leave adequate space between elements</li>
        <li><strong>Color Coding</strong> - Use consistent colors for element types</li>
        <li><strong>Clear Labels</strong> - Use descriptive, concise text for all elements</li>
      </ul>
    `
  },
  'tips-tricks': {
    title: 'Tips & Tricks',
    content: `
      <h2>Tips & Tricks</h2>
      <p>Enhance your productivity with these helpful tips:</p>
      
      <h3>Keyboard Shortcuts:</h3>
      <ul>
        <li><strong>Ctrl+Z</strong> - Undo last action</li>
        <li><strong>Ctrl+Y</strong> - Redo action</li>
        <li><strong>Delete</strong> - Remove selected element</li>
        <li><strong>Ctrl+A</strong> - Select all elements</li>
        <li><strong>Ctrl+S</strong> - Save diagram</li>
      </ul>
      
      <h3>Editing Tips:</h3>
      <ul>
        <li><strong>Double-click</strong> any element to edit its text</li>
        <li><strong>Drag</strong> elements to reposition them</li>
        <li><strong>Hold Shift</strong> while dragging to maintain alignment</li>
        <li><strong>Right-click</strong> for context menu options</li>
        <li><strong>Use Templates</strong> to quickly start common argument patterns</li>
      </ul>
      
      <h3>Organization Tips:</h3>
      <ul>
        <li>Group related elements together</li>
        <li>Use consistent naming conventions</li>
        <li>Regularly save your work</li>
        <li>Export diagrams for documentation</li>
      </ul>
    `
  }
};

export const navigationStructure: NavigationItem[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: Play,
    children: [
      { id: 'introduction', label: 'Introduction of GSN', icon: FileText },
      { id: 'gsn-elements', label: 'GSN Elements', icon: Shapes }
    ]
  },
  {
    id: 'best-practices',
    label: 'Best Practices',
    icon: Lightbulb,
    children: []
  },
  {
    id: 'tips-tricks',
    label: 'Tips & Tricks',
    icon: HelpCircle,
    children: []
  }
];