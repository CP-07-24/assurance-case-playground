import React, { Component, RefObject } from "react";
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
import { Shape } from "../../types/shapes";
import { useAuth } from '../../context/AuthContext.tsx';
import { useDiagram } from "../../hooks/useDiagram";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type: "text" | "action";
};

interface AiPanelState {
  messages: Message[];
  inputValue: string;
  isProcessing: boolean;
}

interface AiPanelProps {
  // Props from HOC will be injected here
  shapes: any[];
  connections: any[];
  addShape: (shape: Shape) => void;
  addConnection: (connection: any) => void;
  addShapeToCanvas: (shape: Shape) => void;
  logout: () => void;
}

class AiPanel extends Component<AiPanelProps, AiPanelState> {
  private messagesEndRef: RefObject<HTMLDivElement>;
  private readonly MAX_PROMPT_LENGTH = 800;

  constructor(props: AiPanelProps) {
    super(props);
    
    this.state = {
      messages: [
        {
          id: "1",
          text: "Hello! I can help you create, analyze, and optimize diagrams. What would you like to do?",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        },
      ],
      inputValue: "",
      isProcessing: false,
    };

    this.messagesEndRef = React.createRef<HTMLDivElement>();
    
    // Bind methods
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSpecialCommand = this.handleSpecialCommand.bind(this);
    this.generateassurancecase = this.generateassurancecase.bind(this);
    this.getDiagramContext = this.getDiagramContext.bind(this);
    this.setAnalyzeInput = this.setAnalyzeInput.bind(this);
    this.setOptimizeInput = this.setOptimizeInput.bind(this);
    this.setGenerateInput = this.setGenerateInput.bind(this);
  }

  componentDidMount(): void {
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps: AiPanelProps, prevState: AiPanelState): void {
    if (prevState.messages.length !== this.state.messages.length) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    this.messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  private getDiagramContext(): string {
    const { shapes, connections } = this.props;
    const mainElements = shapes
      .slice(0, 3)
      .map((s) => s.text)
      .join(", ");
    return `Diagram with ${shapes.length} elements (${mainElements}${
      shapes.length > 3 ? "..." : ""
    }) and ${connections.length} connections.`;
  }

  private async handleSpecialCommand(input: string): Promise<string> {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("generate") || lowerInput.includes("create")) {
      return "I can generate these diagram types:\n1. assurancecase\n2. System Architecture\n3. Sequence Diagram\n\nWhich would you like?";
    }

    if (lowerInput.includes("analyze") || lowerInput.includes("review")) {
      const { shapes, connections } = this.props;
      return `Diagram Analysis:\n\n• Elements: ${shapes.length}\n• Connections: ${connections.length}\n• Complexity: ${
        connections.length > 5 ? "High" : "Medium"
      }\n\nNeed optimization suggestions?`;
    }

    if (lowerInput.includes("assurancecase")) {
      this.generateassurancecase();
      return "A simple assurancecase has been generated for you.";
    }

    return await getAIResponse(input, this.getDiagramContext());
  }

  private async handleSendMessage(): Promise<void> {
    const { inputValue, isProcessing } = this.state;
    
    if (inputValue.trim() === "" || isProcessing) return;

    if (inputValue.length > this.MAX_PROMPT_LENGTH) {
      this.setState(prevState => ({
        messages: [
          ...prevState.messages,
          {
            id: Date.now().toString(),
            text: `Your message is too long. Please keep it under ${this.MAX_PROMPT_LENGTH} characters.`,
            sender: "bot",
            timestamp: new Date(),
            type: "text",
          },
        ],
      }));
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    this.setState(prevState => ({
      messages: [...prevState.messages, userMessage],
      inputValue: "",
      isProcessing: true,
    }));

    try {
      const response = await this.handleSpecialCommand(inputValue);

      const botMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      };

      this.setState(prevState => ({
        messages: [...prevState.messages, botMessage],
      }));

      if (inputValue.toLowerCase().includes("simple assurancecase")) {
        this.generateassurancecase();
      }
    } catch (error) {
      console.error("Error processing message:", error);
      this.setState(prevState => ({
        messages: [
          ...prevState.messages,
          {
            id: Date.now().toString(),
            text: "Sorry, I encountered an error. Please try again.",
            sender: "bot",
            timestamp: new Date(),
            type: "text",
          },
        ],
      }));
    } finally {
      this.setState({ isProcessing: false });
    }
  }

  private generateassurancecase(): void {
    const { addConnection, addShapeToCanvas } = this.props;
    
    const newShapes: Shape[] = [
      {
        id: "G1",
        type: "goal1",
        mainText: "Goals",
      },
      {
        id: "C1",
        type: "goal2",
        mainText: "Context",
      },
    ];

    addConnection({
      id: "conn1",
      from: "G1",
      to: "C1",
      fromPoint: "bottom",
      toPoint: "top",
      style: "line",
      points: [],
    });

    newShapes.forEach((shape) => addShapeToCanvas(shape));
  }

  private handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.handleSendMessage();
    }
  }

  private setAnalyzeInput(): void {
    this.setState({ inputValue: "Analyze my diagram" });
  }

  private setOptimizeInput(): void {
    this.setState({ inputValue: "Optimize the layout" });
  }

  private setGenerateInput(): void {
    this.setState({ inputValue: "assurancecase" });
  }

  render(): React.ReactNode {
    const { messages, inputValue, isProcessing } = this.state;
    const { shapes, connections, logout } = this.props;

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
            onClick={logout}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3 ${
                  message.sender === "user"
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
          <div ref={this.messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-1">
            {/* <button
              onClick={this.setAnalyzeInput}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ListTree size={14} className="text-gray-600" />
              Analyze
            </button> */}
            {/* <button
              onClick={this.setOptimizeInput}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Wand2 size={14} className="text-gray-600" />
              Optimize
            </button> */}
            <button
              onClick={this.setGenerateInput}
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
                  el.style.overflowY = el.scrollHeight > 44 ? "auto" : "hidden";
                }
              }}
              value={inputValue}
              onChange={(e) => {
                this.setState({ inputValue: e.target.value });
                e.target.style.height = "auto";
                const newHeight = Math.min(e.target.scrollHeight, 150);
                e.target.style.height = `${newHeight}px`;
                e.target.style.overflowY = newHeight > 44 ? "auto" : "hidden";
              }}
              onKeyDown={this.handleKeyDown}
              placeholder="Ask about your diagram..."
              className="w-full pr-8 pl-4 pt-3 pb-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none transition-all"
              disabled={isProcessing}
              rows={2}
              style={{
                minHeight: "50px",
                maxHeight: "150px",
                overflowY: "hidden",
              }}
            />

            {inputValue.length > 0 && (
              <div
                className={`absolute right-12 bottom-3 text-xs px-2 py-0.5 bg-white rounded-full ${
                  inputValue.length > this.MAX_PROMPT_LENGTH * 0.9
                    ? "text-red-500 font-medium"
                    : "text-gray-500"
                }`}
              >
                {inputValue.length}/{this.MAX_PROMPT_LENGTH}
              </div>
            )}

            <button
              onClick={this.handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
              className={`absolute right-4 bottom-3 p-2 rounded-xl transition-colors ${
                inputValue.trim() && !isProcessing
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
  }
}

// Higher-Order Component to inject hooks into class component
const withHooks = (WrappedComponent: React.ComponentType<AiPanelProps>) => {
  return (props: any) => {
    const { logout } = useAuth();
    const {
      shapes,
      connections,
      addShape,
      addConnection,
    } = useDiagramContext();
    const { addShapeToCanvas } = useDiagram();

    return (
      <WrappedComponent
        {...props}
        shapes={shapes}
        connections={connections}
        addShape={addShape}
        addConnection={addConnection}
        addShapeToCanvas={addShapeToCanvas}
        logout={logout}
      />
    );
  };
};

export default withHooks(AiPanel);