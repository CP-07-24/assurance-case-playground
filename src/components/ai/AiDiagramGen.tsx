// src/components/ai/AiDiagramGen.tsx - Final Fixed Version
import React, { useState, useRef, useEffect } from "react"; // Removed useCallback
import {
  Sparkles,
  Send,
  Zap,
  Trash,
  Lightbulb,
  MessagesSquare,
  Settings,
} from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";
import { ShapeOnCanvas } from "../../types/shapes";

// Define types for messages
interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  generatedDiagram?: boolean;
}

// Define a diagram template type
interface DiagramTemplate {
  name: string;
  elements: Partial<ShapeOnCanvas>[];
  connections: { fromIndex: number; toIndex: number }[];
}

// Common patterns for diagram generation
const DIAGRAM_TEMPLATES: Record<string, DiagramTemplate> = {
  safety_case_basic: {
    name: "Basic Safety Case",
    elements: [
      {
        type: "goal",
        idText: "G1",
        value: "System is acceptably safe",
        mainText: "System is acceptably safe",
        x: 400,
        y: 100,
        width: 200,
        height: 80,
      },
      {
        type: "goal",
        idText: "G2",
        value: "Hardware is safe",
        mainText: "Hardware is safe",
        x: 200,
        y: 250,
        width: 180,
        height: 70,
      },
      {
        type: "goal",
        idText: "G3",
        value: "Software is safe",
        mainText: "Software is safe",
        x: 450,
        y: 250,
        width: 180,
        height: 70,
      },
      {
        type: "goal",
        idText: "G4",
        value: "Operation is safe",
        mainText: "Operation is safe",
        x: 700,
        y: 250,
        width: 180,
        height: 70,
      },
      {
        type: "sacm",
        idText: "Sn1",
        value: "Hardware test results",
        mainText: "Hardware test results",
        x: 200,
        y: 380,
        width: 180,
        height: 70,
      },
      {
        type: "sacm",
        idText: "Sn2",
        value: "Software verification report",
        mainText: "Software verification report",
        x: 450,
        y: 380,
        width: 180,
        height: 70,
      },
      {
        type: "sacm",
        idText: "Sn3",
        value: "Operational procedures",
        mainText: "Operational procedures",
        x: 700,
        y: 380,
        width: 180,
        height: 70,
      },
    ],
    connections: [
      { fromIndex: 0, toIndex: 1 },
      { fromIndex: 0, toIndex: 2 },
      { fromIndex: 0, toIndex: 3 },
      { fromIndex: 1, toIndex: 4 },
      { fromIndex: 2, toIndex: 5 },
      { fromIndex: 3, toIndex: 6 },
    ],
  },
  hazard_analysis: {
    name: "Hazard Analysis",
    elements: [
      {
        type: "goal",
        idText: "G1",
        value: "All identified hazards are mitigated",
        mainText: "All identified hazards are mitigated",
        x: 400,
        y: 100,
        width: 200,
        height: 80,
      },
      {
        type: "strategy",
        idText: "S1",
        value: "Argument by hazard analysis",
        mainText: "Argument by hazard analysis",
        x: 400,
        y: 220,
        width: 200,
        height: 70,
        cornerRadius: 5,
      },
      {
        type: "goal",
        idText: "G2",
        value: "Hazard H1 is mitigated",
        mainText: "Hazard H1 is mitigated",
        x: 250,
        y: 340,
        width: 180,
        height: 70,
      },
      {
        type: "goal",
        idText: "G3",
        value: "Hazard H2 is mitigated",
        mainText: "Hazard H2 is mitigated",
        x: 550,
        y: 340,
        width: 180,
        height: 70,
      },
    ],
    connections: [
      { fromIndex: 0, toIndex: 1 },
      { fromIndex: 1, toIndex: 2 },
      { fromIndex: 1, toIndex: 3 },
    ],
  },
  software_safety: {
    name: "Software Safety",
    elements: [
      {
        type: "goal",
        idText: "G1",
        value: "Software is acceptably safe",
        mainText: "Software is acceptably safe",
        x: 400,
        y: 100,
        width: 200,
        height: 80,
      },
      {
        type: "strategy",
        idText: "S1",
        value: "Argument by verification & validation",
        mainText: "Argument by verification & validation",
        x: 400,
        y: 220,
        width: 240,
        height: 70,
        cornerRadius: 5,
      },
      {
        type: "goal",
        idText: "G2",
        value: "Requirements are correct",
        mainText: "Requirements are correct",
        x: 250,
        y: 340,
        width: 180,
        height: 70,
      },
      {
        type: "goal",
        idText: "G3",
        value: "Implementation is correct",
        mainText: "Implementation is correct",
        x: 550,
        y: 340,
        width: 180,
        height: 70,
      },
    ],
    connections: [
      { fromIndex: 0, toIndex: 1 },
      { fromIndex: 1, toIndex: 2 },
      { fromIndex: 1, toIndex: 3 },
    ],
  },
  autonomous_vehicle: {
    name: "Autonomous Vehicle Safety",
    elements: [
      {
        type: "goal",
        idText: "G1",
        value: "Autonomous vehicle is safe for public roads",
        mainText: "Autonomous vehicle is safe for public roads",
        x: 400,
        y: 100,
        width: 250,
        height: 80,
      },
      {
        type: "strategy",
        idText: "S1",
        value: "Argument by system decomposition",
        mainText: "Argument by system decomposition",
        x: 400,
        y: 220,
        width: 220,
        height: 70,
        cornerRadius: 5,
      },
      {
        type: "goal",
        idText: "G2",
        value: "Sensor system is reliable",
        mainText: "Sensor system is reliable",
        x: 150,
        y: 340,
        width: 180,
        height: 70,
      },
      {
        type: "goal",
        idText: "G3",
        value: "Decision algorithm is correct",
        mainText: "Decision algorithm is correct",
        x: 400,
        y: 340,
        width: 180,
        height: 70,
      },
      {
        type: "goal",
        idText: "G4",
        value: "Actuator system is safe",
        mainText: "Actuator system is safe",
        x: 650,
        y: 340,
        width: 180,
        height: 70,
      },
    ],
    connections: [
      { fromIndex: 0, toIndex: 1 },
      { fromIndex: 1, toIndex: 2 },
      { fromIndex: 1, toIndex: 3 },
      { fromIndex: 1, toIndex: 4 },
    ],
  },
  medical_device: {
    name: "Medical Device Safety",
    elements: [
      {
        type: "goal",
        idText: "G1",
        value: "Medical device is safe for patient use",
        mainText: "Medical device is safe for patient use",
        x: 400,
        y: 100,
        width: 220,
        height: 80,
      },
      {
        type: "goal",
        idText: "G2",
        value: "Hardware meets requirements",
        mainText: "Hardware meets requirements",
        x: 200,
        y: 300,
        width: 200,
        height: 70,
      },
      {
        type: "goal",
        idText: "G3",
        value: "Software meets requirements",
        mainText: "Software meets requirements",
        x: 450,
        y: 300,
        width: 200,
        height: 70,
      },
      {
        type: "goal",
        idText: "G4",
        value: "User safe operation",
        mainText: "User safe operation",
        x: 700,
        y: 300,
        width: 180,
        height: 70,
      },
      {
        type: "sacm",
        idText: "Sn1",
        value: "Hardware certification",
        mainText: "Hardware certification",
        x: 200,
        y: 400,
        width: 180,
        height: 70,
      },
      {
        type: "sacm",
        idText: "Sn2",
        value: "Software validation",
        mainText: "Software validation",
        x: 450,
        y: 400,
        width: 180,
        height: 70,
      },
      {
        type: "sacm",
        idText: "Sn3",
        value: "Usability testing",
        mainText: "Usability testing",
        x: 700,
        y: 400,
        width: 180,
        height: 70,
      },
    ],
    connections: [
      { fromIndex: 0, toIndex: 1 },
      { fromIndex: 1, toIndex: 2 },
      { fromIndex: 1, toIndex: 3 },
      { fromIndex: 1, toIndex: 4 },
      { fromIndex: 2, toIndex: 5 },
      { fromIndex: 3, toIndex: 6 },
      { fromIndex: 4, toIndex: 7 },
    ],
  },
};

// Example prompt suggestions
const PROMPT_SUGGESTIONS = [
  "Create a safety case diagram for autonomous vehicles",
  "Generate a hazard analysis diagram",
  "Create a software safety assurance diagram",
  "Make a medical device safety diagram",
  "Generate a basic GSN safety case structure",
];

const AiPanel: React.FC = () => {
  // Get diagram context to interact with diagram
  // Removed unused destructured variables: setSelectedId, shapes
  const { addShape, addConnection } = useDiagramContext();

  // State for messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your diagram assistant. Tell me what kind of diagram you'd like me to create for you, and I'll generate it automatically.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Process user input and respond accordingly
  const processUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    let templateToUse: DiagramTemplate;
    let responseContent: string;

    if (
      lowerInput.includes("autonomous") ||
      lowerInput.includes("vehicle")
    ) {
      templateToUse = DIAGRAM_TEMPLATES.autonomous_vehicle;
      responseContent =
        "I'll generate an autonomous vehicle safety case diagram for you.";
    } else if (lowerInput.includes("hazard")) {
      templateToUse = DIAGRAM_TEMPLATES.hazard_analysis;
      responseContent =
        "I'll generate a hazard analysis diagram structure for you.";
    } else if (lowerInput.includes("software")) {
      templateToUse = DIAGRAM_TEMPLATES.software_safety;
      responseContent =
        "Creating a software safety assurance diagram as requested.";
    } else if (
      lowerInput.includes("medical") ||
      lowerInput.includes("device")
    ) {
      templateToUse = DIAGRAM_TEMPLATES.medical_device;
      responseContent =
        "Generating a medical device safety case diagram structure.";
    } else {
      // Default to basic safety case
      templateToUse = DIAGRAM_TEMPLATES.safety_case_basic;
      responseContent =
        "I'll create a basic safety case diagram structure for you.";
    }

    // Add AI response
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: responseContent,
      sender: "ai",
      timestamp: new Date(),
      generatedDiagram: true,
    };

    setMessages((prev) => [...prev, aiMessage]);

    // Generate the diagram
    generateDiagram(templateToUse);
  };

  // Custom clear diagram function since clearDiagram doesn't exist in context
  const clearCurrentDiagram = () => {
    console.log("Clearing diagram - Note: clearDiagram method not available in context");
    // Alternative: We can just add new shapes without clearing if clearDiagram doesn't exist
  };

  // Generate diagram based on template
  const generateDiagram = (template: DiagramTemplate) => {
    // Try to clear existing diagram first (if method exists)
    try {
      clearCurrentDiagram();
    } catch (error) {
      console.log("Clear diagram not available, proceeding with generation");
    }

    // Create an array to store the actual IDs of created shapes
    const createdShapeIds: string[] = [];

    // Add shapes - Changed 'index' to '_' since it's not used
    template.elements.forEach((element, _) => {
      const shapeId =
        Date.now().toString() + Math.random().toString(36).substr(2, 5);
      createdShapeIds.push(shapeId);

      addShape({
        ...element,
        id: shapeId,
        // Ensure these properties are set
        type: element.type || "goal",
        title: element.title || element.value || "Element",
        text: element.text || element.value || "Element",
        mainText: element.mainText || element.value || "Element",
        preview: null, // Will be rendered by the component
        x: element.x || 100,
        y: element.y || 100,
        width: element.width || 150,
        height: element.height || 70,
        cornerRadius: element.type === "extension" ? 5 : undefined,
      });
    });

    // Add connections after a short delay to ensure shapes are created
    setTimeout(() => {
      template.connections.forEach((connection) => {
        if (createdShapeIds[connection.fromIndex] && createdShapeIds[connection.toIndex]) {
          addConnection({
            id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            from: createdShapeIds[connection.fromIndex],
            to: createdShapeIds[connection.toIndex],
            points: [],
            style: "line",
          });
        }
      });
    }, 200);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle sending messages
  const handleSendMessage = () => {
    if (!inputValue.trim() || isGenerating) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    // Process the input after a short delay
    setTimeout(() => {
      processUserInput(inputValue);
      setInputValue("");
      setIsGenerating(false);
    }, 1000);
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        content: "Chat cleared! What kind of diagram would you like me to create?",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
  };

  // Use suggestion
  const useSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-full p-2">
            <Sparkles size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">AI Diagram Generator</h3>
            <p className="text-xs text-gray-600">
              Generate professional diagrams with AI assistance
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
                {message.generatedDiagram && (
                  <div className="mt-2 flex items-center text-xs opacity-75">
                    <Zap size={12} className="mr-1" />
                    Diagram generated
                  </div>
                )}
                <div className="text-xs mt-2 opacity-60">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 border border-gray-200 max-w-[85%]">
                <div className="flex items-center space-x-2">
                  <div className="text-sm">Generating diagram...</div>
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "100ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "200ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick prompts */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-600 flex items-center">
            <Lightbulb size={14} className="mr-1" /> Quick prompts
          </div>

          <div className="flex space-x-2">
            <button
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={clearChat}
              title="Clear chat"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {PROMPT_SUGGESTIONS.map((prompt, promptIndex) => (
            <button
              key={promptIndex} // Use promptIndex to avoid confusion
              className="text-xs bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200"
              onClick={() => useSuggestion(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-t border-gray-200 flex">
        <button className="flex-1 py-2 text-blue-600 border-t-2 border-blue-600 text-sm font-medium flex justify-center items-center">
          <MessagesSquare size={16} className="mr-1" /> Chat
        </button>
        <button className="flex-1 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium flex justify-center items-center">
          <Settings size={16} className="mr-1" /> Settings
        </button>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end">
          <div className="flex-grow relative">
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe the diagram you want to create..."
              rows={2}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
            />
          </div>
          <button
            className={`ml-2 p-2 rounded-full ${
              inputValue.trim()
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-400"
            }`}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isGenerating}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiPanel;