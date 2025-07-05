// src/components/ai/AiPanel.tsx - Stable Version Without Auto-Reset
import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  User,
  Bot,
  Wand2,
  Workflow,
  ListTree,
  Trash2,
} from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";
import { AIServiceManager, DiagramAIHelper } from "../../services/aiService";
import { ShapeOnCanvas } from "../../types/shapes";

// Message interface
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type: "text" | "action" | "error";
}

// Stable Chat Manager - No automatic resets
class StableChatManager {
  private aiService: AIServiceManager;
  private diagramHelper: DiagramAIHelper;
  private messageHistory: Message[] = [];
  private isInitialized: boolean = false;

  constructor() {
    this.aiService = AIServiceManager.getInstance();
    this.diagramHelper = new DiagramAIHelper();
    console.log('[StableChatManager] Created - No auto-reset behavior');
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('[StableChatManager] Already initialized, skipping');
      return;
    }

    try {
      console.log('[StableChatManager] Initializing...');
      
      // Add welcome message only once
      this.addMessage({
        text: "Hello! I can help you create, analyze, and optimize diagrams. What would you like to do?",
        sender: "bot",
        type: "text"
      });
      
      this.isInitialized = true;
      console.log('[StableChatManager] Initialization complete');
    } catch (error) {
      console.error('[StableChatManager] Initialization error:', error);
      this.addMessage({
        text: "AI Assistant is ready! Let me know how I can help with your diagrams.",
        sender: "bot",
        type: "text"
      });
      this.isInitialized = true;
    }
  }

  public async processMessage(input: string, diagramContext: { shapes: any[], connections: any[] }): Promise<void> {
    try {
      console.log('[StableChatManager] Processing message:', input.substring(0, 50) + '...');
      
      // Add user message
      this.addMessage({
        text: input,
        sender: "user",
        type: "text"
      });

      // Process based on command type
      const command = this.parseCommand(input);
      let response: string;

      console.log('[StableChatManager] Command type:', command.type);

      switch (command.type) {
        case 'analyze':
          response = await this.diagramHelper.analyzeShape(diagramContext.shapes, diagramContext.connections);
          break;
        case 'optimize':
          response = await this.diagramHelper.suggestOptimizations(diagramContext.shapes, diagramContext.connections);
          break;
        case 'generate':
          response = await this.diagramHelper.generateDiagramIdeas(command.params.diagramType);
          break;
        default:
          response = await this.diagramHelper.processGeneralQuery(input, diagramContext.shapes, diagramContext.connections);
      }

      // Add AI response
      this.addMessage({
        text: response,
        sender: "bot",
        type: command.type === 'generate' ? 'action' : 'text'
      });

      console.log('[StableChatManager] Message processed successfully');

    } catch (error) {
      console.error('[StableChatManager] Error processing message:', error);
      this.addMessage({
        text: "I encountered an issue, but I'm still here to help! Please try rephrasing your request.",
        sender: "bot",
        type: "error"
      });
    }
  }

  private parseCommand(input: string): { type: string, params: any } {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('analyze') || lowerInput.includes('review') || lowerInput.includes('check')) {
      return { type: 'analyze', params: {} };
    }

    if (lowerInput.includes('optimize') || lowerInput.includes('improve') || lowerInput.includes('layout')) {
      return { type: 'optimize', params: {} };
    }

    if (lowerInput.includes('create') || lowerInput.includes('generate') || lowerInput.includes('make')) {
      const diagramType = this.extractDiagramType(lowerInput);
      return { type: 'generate', params: { diagramType } };
    }

    return { type: 'general', params: {} };
  }

  private extractDiagramType(input: string): string {
    if (input.includes('flowchart')) return 'flowchart';
    if (input.includes('gsn')) return 'GSN safety case';
    if (input.includes('sequence')) return 'sequence diagram';
    if (input.includes('architecture')) return 'architecture diagram';
    return 'flowchart';
  }

  private addMessage(messageData: Omit<Message, 'id' | 'timestamp'>): Message {
    const message: Message = {
      ...messageData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      timestamp: new Date()
    };

    this.messageHistory.push(message);
    console.log('[StableChatManager] Added message:', message.type, message.text.substring(0, 30) + '...');
    return message;
  }

  public getMessages(): Message[] {
    return [...this.messageHistory];
  }

  public manualClearMessages(): void {
    console.log('[StableChatManager] Manual clear requested');
    this.messageHistory = [];
    this.aiService.clearHistory();
    
    // Add fresh welcome message
    this.addMessage({
      text: "Chat cleared! How can I help you with your diagrams?",
      sender: "bot",
      type: "text"
    });
  }

  public getStats(): { messageCount: number, conversationLength: number } {
    return {
      messageCount: this.messageHistory.length,
      conversationLength: this.aiService.getHistoryLength()
    };
  }
}

// Enhanced Diagram Generator
class StableDiagramGenerator {
  private diagramContext: any;

  constructor(diagramContext: any) {
    this.diagramContext = diagramContext;
  }

  public generateFlowchart(): void {
    try {
      console.log('[StableDiagramGenerator] Generating flowchart');
      
      const timestamp = Date.now();
      const shapes: ShapeOnCanvas[] = [
        {
          id: `start_${timestamp}`,
          type: "ellipse",
          title: "Start Node",
          preview: <div>Start</div>,
          x: 300,
          y: 100,
          text: "Start",
          mainText: "Start",
          width: 100,
          height: 60,
        },
        {
          id: `process_${timestamp}`,
          type: "rectangle", 
          title: "Process",
          preview: <div>Process</div>,
          x: 300,
          y: 220,
          text: "Process Data",
          mainText: "Process Data",
          width: 120,
          height: 60,
        },
        {
          id: `decision_${timestamp}`,
          type: "diamond",
          title: "Decision",
          preview: <div>Decision</div>,
          x: 300,
          y: 340,
          text: "Valid?",
          mainText: "Valid?",
          width: 100,
          height: 80,
        },
        {
          id: `end_${timestamp}`,
          type: "ellipse",
          title: "End Node", 
          preview: <div>End</div>,
          x: 300,
          y: 480,
          text: "End",
          mainText: "End",
          width: 100,
          height: 60,
        }
      ];

      // Add shapes
      shapes.forEach(shape => {
        this.diagramContext.addShape(shape);
      });

      // Add connections after delay
      setTimeout(() => {
        const connections = [
          {
            id: `conn1_${timestamp}`,
            from: shapes[0].id,
            to: shapes[1].id,
            points: [],
            style: "line"
          },
          {
            id: `conn2_${timestamp}`,
            from: shapes[1].id,
            to: shapes[2].id,
            points: [],
            style: "line"
          },
          {
            id: `conn3_${timestamp}`,
            from: shapes[2].id,
            to: shapes[3].id,
            points: [],
            style: "line"
          }
        ];

        connections.forEach(connection => {
          this.diagramContext.addConnection(connection);
        });
      }, 100);

      console.log('[StableDiagramGenerator] Flowchart generated successfully');
    } catch (error) {
      console.error('[StableDiagramGenerator] Error generating flowchart:', error);
    }
  }

  public generateGSNDiagram(): void {
    try {
      console.log('[StableDiagramGenerator] Generating GSN diagram');
      
      const timestamp = Date.now();
      const shapes: ShapeOnCanvas[] = [
        {
          id: `goal_${timestamp}`,
          type: "goal",
          title: "Main Goal",
          preview: <div>Goal</div>,
          x: 350,
          y: 100,
          text: "System is acceptably safe",
          mainText: "System is acceptably safe",
          width: 200,
          height: 80,
        },
        {
          id: `strategy_${timestamp}`,
          type: "strategy",
          title: "Strategy",
          preview: <div>Strategy</div>,
          x: 350,
          y: 220,
          text: "Argument by decomposition",
          mainText: "Argument by decomposition",
          width: 200,
          height: 60,
        },
        {
          id: `solution_${timestamp}`,
          type: "sacm",
          title: "Solution",
          preview: <div>Solution</div>,
          x: 350,
          y: 340,
          text: "Test results",
          mainText: "Test results",
          width: 180,
          height: 60,
        }
      ];

      shapes.forEach(shape => {
        this.diagramContext.addShape(shape);
      });

      setTimeout(() => {
        const connections = [
          {
            id: `gsn_conn1_${timestamp}`,
            from: shapes[0].id,
            to: shapes[1].id,
            points: [],
            style: "line"
          },
          {
            id: `gsn_conn2_${timestamp}`,
            from: shapes[1].id,
            to: shapes[2].id,
            points: [],
            style: "line"
          }
        ];

        connections.forEach(connection => {
          this.diagramContext.addConnection(connection);
        });
      }, 100);

      console.log('[StableDiagramGenerator] GSN diagram generated successfully');
    } catch (error) {
      console.error('[StableDiagramGenerator] Error generating GSN diagram:', error);
    }
  }
}

// Main AI Panel Component
const AiPanel: React.FC = () => {
  const diagramContext = useDiagramContext();
  const { shapes, connections } = diagramContext;

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatManagerRef = useRef<StableChatManager | null>(null);
  const diagramGeneratorRef = useRef<StableDiagramGenerator | null>(null);

  // Initialize only once
  useEffect(() => {
    if (!chatManagerRef.current) {
      console.log('[AiPanel] Initializing stable managers');
      
      chatManagerRef.current = new StableChatManager();
      diagramGeneratorRef.current = new StableDiagramGenerator(diagramContext);
      
      chatManagerRef.current.initialize().then(() => {
        setMessages(chatManagerRef.current!.getMessages());
        setIsInitialized(true);
        console.log('[AiPanel] Initialization complete');
      });
    }
  }, []); // Empty dependency array - initialize only once

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing || !chatManagerRef.current) return;

    const userInput = inputValue;
    setInputValue("");
    setIsProcessing(true);

    try {
      console.log('[AiPanel] Sending message:', userInput);
      
      await chatManagerRef.current.processMessage(userInput, { shapes, connections });
      
      // Handle diagram generation commands
      if (userInput.toLowerCase().includes('flowchart') && 
          (userInput.toLowerCase().includes('create') || userInput.toLowerCase().includes('generate'))) {
        console.log('[AiPanel] Triggering flowchart generation');
        diagramGeneratorRef.current?.generateFlowchart();
      } else if (userInput.toLowerCase().includes('gsn') && 
                 (userInput.toLowerCase().includes('create') || userInput.toLowerCase().includes('generate'))) {
        console.log('[AiPanel] Triggering GSN generation');
        diagramGeneratorRef.current?.generateGSNDiagram();
      }

      // Update messages
      setMessages(chatManagerRef.current.getMessages());
      
    } catch (error) {
      console.error('[AiPanel] Error sending message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickCommand = (command: string) => {
    setInputValue(command);
    setTimeout(handleSendMessage, 100);
  };

  const handleManualClear = () => {
    if (chatManagerRef.current) {
      console.log('[AiPanel] Manual clear requested');
      chatManagerRef.current.manualClearMessages();
      setMessages(chatManagerRef.current.getMessages());
    }
  };

  // Render loading state
  if (!isInitialized) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Sparkles size={48} className="text-blue-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Initializing AI Assistant</h3>
            <p className="text-sm text-gray-500">Setting up your diagram helper...</p>
          </div>
        </div>
      </div>
    );
  }

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
              {shapes.length} elements • {connections.length} connections • {messages.length} messages
            </p>
          </div>
        </div>
        
        <button
          onClick={handleManualClear}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Clear chat history"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : message.type === "error"
                  ? "bg-red-100 text-red-800 border border-red-200"
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
                {message.type === "action" && (
                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                    Generated
                  </span>
                )}
              </div>
              <div className="text-sm whitespace-pre-wrap">{message.text}</div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
              <div className="flex items-center gap-2 mb-1">
                <Bot size={14} className="opacity-70" />
                <span className="text-xs opacity-70">Thinking...</span>
              </div>
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
        {/* Quick Action Buttons */}
        <div className="flex gap-2 mb-2 overflow-x-auto">
          <button
            onClick={() => handleQuickCommand("Create a flowchart")}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Workflow size={14} /> Flowchart
          </button>
          <button
            onClick={() => handleQuickCommand("Analyze my diagram")}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <ListTree size={14} /> Analyze
          </button>
          <button
            onClick={() => handleQuickCommand("Optimize the layout")}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Wand2 size={14} /> Optimize
          </button>
          <button
            onClick={() => handleQuickCommand("Create a GSN diagram")}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Sparkles size={14} /> GSN
          </button>
        </div>

        {/* Input Field */}
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your diagram..."
            className="w-full pr-10 pl-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50"
            disabled={isProcessing}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
              inputValue.trim() && !isProcessing
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