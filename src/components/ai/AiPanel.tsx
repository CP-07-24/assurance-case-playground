import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  User,
  Bot,
  Wand2,
  ListTree,
  X,
} from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";
import { getAIResponse } from "../../services/aiService";
import { ShapeOnCanvas } from "../../types/shapes";
import { useAuth } from '../../context/AuthContext';

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type: "text" | "action";
};

const AiPanel: React.FC = () => {
  const { logout } = useAuth();
  const {
    shapes,
    connections,
    addShape,
    // updateShapePosition,
    addConnection,
  } = useDiagramContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I can help you create, analyze, and optimize diagrams. What would you like to do?",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getDiagramContext = () => {
    const mainElements = shapes
      .slice(0, 3)
      .map((s) => s.text)
      .join(", ");
    return `Diagram with ${shapes.length} elements (${mainElements}${shapes.length > 3 ? "..." : ""
      }) and ${connections.length} connections.`;
  };

  const handleSpecialCommand = async (input: string): Promise<string> => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("generate") || lowerInput.includes("create")) {
      return "I can generate these diagram types:\n1. Flowchart\n2. System Architecture\n3. Sequence Diagram\n\nWhich would you like?";
    }

    if (lowerInput.includes("analyze") || lowerInput.includes("review")) {
      return `Diagram Analysis:\n\n• Elements: ${shapes.length
        }\n• Connections: ${connections.length}\n• Complexity: ${connections.length > 5 ? "High" : "Medium"
        }\n\nNeed optimization suggestions?`;
    }

    return await getAIResponse(input, getDiagramContext());
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isProcessing) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    try {
      // Process special commands or get AI response
      const response = await handleSpecialCommand(inputValue);

      // Add bot message
      const botMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, botMessage]);

      // Auto-execute diagram actions
      if (inputValue.toLowerCase().includes("simple flowchart")) {
        generateFlowchart();
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Sorry, I encountered an error. Please try again.",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // In your AiPanel.tsx
  const generateFlowchart = () => {
    const newShapes: ShapeOnCanvas[] = [
      {
        id: "start",
        type: "ellipse",
        title: "Start Node",
        preview: <div>Start</div>,
        x: 200,
        y: 100,
        text: "Start",
        width: 80,
        height: 80,
      },
      {
        id: "process",
        type: "rectangle",
        title: "Process",
        preview: <div>Process</div>,
        x: 200,
        y: 220,
        text: "Process",
        width: 120,
        height: 60,
      },
    ];

    newShapes.forEach((shape) => addShape(shape));
    addConnection({
      id: "conn1", from: "start", to: "process", points: [],
      style: "line"
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 rounded-full p-2">
            <Sparkles size={20} className="text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium">AI Diagram Assistant</h3>
            <p className="text-xs text-gray-500">
              {shapes.length} elements • {connections.length} connections
            </p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          title="Logout"
        >
          <X size={18} />
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
                }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.sender === "user" ? (
                  <User size={14} className="opacity-70" />
                ) : (
                  <Bot size={14} className="opacity-70" />
                )}
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2 mb-2 overflow-x-auto">
          {/* <button
            onClick={() => setInputValue("Generate a simple flowchart")}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border rounded-full"
          >
            <Workflow size={14} /> Generate
          </button> */}
          <button
            onClick={() => setInputValue("Analyze my diagram")}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border rounded-full"
          >
            <ListTree size={14} /> Analyze
          </button>
          <button
            onClick={() => setInputValue("Optimize the layout")}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border rounded-full"
          >
            <Wand2 size={14} /> Optimize
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your diagram..."
            className="w-full pr-10 pl-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            disabled={isProcessing}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${inputValue.trim() && !isProcessing
                ? "text-blue-500 hover:bg-blue-50"
                : "text-gray-400"
              }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiPanel;
