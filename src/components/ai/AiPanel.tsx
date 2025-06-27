import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  User,
  Bot,
  Wand2,
  ListTree,
  X,
  Workflow,
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
  const MAX_PROMPT_LENGTH = 800;

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

    if (inputValue.length > MAX_PROMPT_LENGTH) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: `Your message is too long. Please keep it under ${MAX_PROMPT_LENGTH} characters.`,
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        },
      ]);
      return;
    }

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
      const response = await handleSpecialCommand(inputValue);

      const botMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, botMessage]);

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
    <div className="flex flex-col h-full bg-white border-l">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-lg p-2">
            <Sparkles size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">AI Assistant</h3>
            <p className="text-xs text-gray-500">
              {shapes.length} elements • {connections.length} connections
            </p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          title="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Chat Container - Improved scrolling */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-3 ${message.sender === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
                }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.sender === "user" ? (
                  <User size={14} className="opacity-80" />
                ) : (
                  <Bot size={14} className="opacity-80" />
                )}
                <span className="text-xs opacity-80">
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
            <div className="bg-gray-100 text-gray-800 rounded-xl p-3 max-w-[85%]">
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

      {/* Input Area - DeepSeek style */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-1">
          <button
            onClick={() => setInputValue("Analyze my diagram")}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ListTree size={14} className="text-gray-600" />
            Analyze
          </button>
          <button
            onClick={() => setInputValue("Optimize the layout")}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Wand2 size={14} className="text-gray-600" />
            Optimize
          </button>
          <button
            onClick={() => setInputValue("Generate flowchart")}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Workflow size={14} className="text-gray-600" />
            Generate
          </button>
        </div>

        <div className="relative">
          <textarea
            ref={(el) => {
              if (el) {
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
                // Toggle scrollbar visibility based on height
                el.style.overflowY = el.scrollHeight > 44 ? "auto" : "hidden";
              }
            }}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              e.target.style.height = "auto";
              const newHeight = Math.min(e.target.scrollHeight, 150);
              e.target.style.height = `${newHeight}px`;
              // Hide scrollbar for single line
              e.target.style.overflowY = newHeight > 44 ? "auto" : "hidden";
            }}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about your diagram...`}
            className="w-full pr-8 pl-4 pt-3 pb-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none transition-all"
            disabled={isProcessing}
            rows={2}
            style={{
              minHeight: "50px",
              maxHeight: "150px",
              overflowY: "hidden" // Default to hidden
            }}
          />

          {inputValue.length > 0 && (
            <div className={`absolute right-12 bottom-3 text-xs px-2 py-0.5 bg-white rounded-full ${inputValue.length > MAX_PROMPT_LENGTH * 0.9
              ? "text-red-500 font-medium"
              : "text-gray-500"
              }`}>
              {inputValue.length}/{MAX_PROMPT_LENGTH}
            </div>
          )}

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className={`absolute right-4 bottom-3 p-2 rounded-xl transition-colors ${inputValue.trim() && !isProcessing
              ? "text-white bg-blue-600 hover:bg-blue-700"
              : "text-gray-400 bg-gray-100"
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