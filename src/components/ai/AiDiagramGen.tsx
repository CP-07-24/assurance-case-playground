// src/components/ai/AiDiagramGen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Zap,
  Trash,
  Lightbulb,
  Target,
  Brain,
} from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";

// Enhanced interfaces
interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type: "text" | "diagram" | "analysis" | "error";
  confidence?: number;
  metadata?: any;
}

interface DiagramIntent {
  type: 'safety_case' | 'hazard_analysis' | 'software_safety' | 'flowchart' | 'sequence' | 'architecture';
  domain: string;
  complexity: 'simple' | 'medium' | 'complex';
  elements: string[];
  structure: 'hierarchical' | 'sequential' | 'network';
}

// Enhanced AI Processor Class
class DiagramAIProcessor {
  private domainKeywords: Map<string, string[]> = new Map();
  private typePatterns: Map<string, RegExp[]> = new Map();

  constructor() {
    this.initializeKeywords();
    this.initializePatterns();
  }

  private initializeKeywords(): void {
    this.domainKeywords = new Map([
      ['automotive', ['vehicle', 'car', 'automotive', 'driving', 'autonomous', 'brake', 'engine']],
      ['medical', ['medical', 'healthcare', 'patient', 'device', 'clinical', 'hospital', 'therapy']],
      ['aviation', ['aircraft', 'aviation', 'flight', 'pilot', 'air', 'runway', 'navigation']],
      ['software', ['software', 'code', 'program', 'system', 'application', 'api', 'database']],
      ['nuclear', ['nuclear', 'reactor', 'radiation', 'power plant', 'isotope', 'containment']],
      ['industrial', ['factory', 'manufacturing', 'production', 'machine', 'assembly', 'quality']]
    ]);
  }

  private initializePatterns(): void {
    this.typePatterns = new Map([
      ['safety_case', [/safety\s+case/i, /gsn/i, /goal\s+structuring/i, /assurance/i]],
      ['hazard_analysis', [/hazard/i, /risk/i, /fmea/i, /fault\s+tree/i, /threat/i]],
      ['software_safety', [/software\s+safety/i, /verification/i, /validation/i, /v&v/i]],
      ['flowchart', [/flowchart/i, /flow/i, /process/i, /workflow/i, /step/i]],
      ['sequence', [/sequence/i, /interaction/i, /timeline/i, /message/i]],
      ['architecture', [/architecture/i, /system\s+design/i, /component/i, /module/i]]
    ]);
  }

  public analyzePrompt(prompt: string): DiagramIntent {
    const lowerPrompt = prompt.toLowerCase();
    
    return {
      type: this.detectType(lowerPrompt),
      domain: this.detectDomain(lowerPrompt),
      complexity: this.detectComplexity(lowerPrompt),
      elements: this.extractElements(prompt),
      structure: this.detectStructure(lowerPrompt)
    };
  }

  private detectType(prompt: string): DiagramIntent['type'] {
    for (const [type, patterns] of this.typePatterns) {
      for (const pattern of patterns) {
        if (pattern.test(prompt)) {
          return type as DiagramIntent['type'];
        }
      }
    }
    return 'safety_case'; // default
  }

  private detectDomain(prompt: string): string {
    for (const [domain, keywords] of this.domainKeywords) {
      if (keywords.some(keyword => prompt.includes(keyword))) {
        return domain;
      }
    }
    return 'general';
  }

  private detectComplexity(prompt: string): 'simple' | 'medium' | 'complex' {
    if (/simple|basic|quick|minimal/i.test(prompt)) return 'simple';
    if (/complex|advanced|detailed|comprehensive/i.test(prompt)) return 'complex';
    return 'medium';
  }

  private extractElements(prompt: string): string[] {
    const elements: string[] = [];
    
    // Extract quoted strings
    const quotes = prompt.match(/"([^"]+)"/g);
    if (quotes) elements.push(...quotes.map(q => q.slice(1, -1)));
    
    // Extract numbered items
    const numbered = prompt.match(/\d+\.\s*([^\n\.]+)/g);
    if (numbered) elements.push(...numbered.map(n => n.replace(/^\d+\.\s*/, '')));
    
    // Extract bullet points
    const bullets = prompt.match(/[-*•]\s*([^\n\-\*•]+)/g);
    if (bullets) elements.push(...bullets.map(b => b.replace(/^[-*•]\s*/, '')));
    
    return elements;
  }

  private detectStructure(prompt: string): 'hierarchical' | 'sequential' | 'network' {
    if (/sequence|step|flow|order/i.test(prompt)) return 'sequential';
    if (/network|mesh|interconnect/i.test(prompt)) return 'network';
    return 'hierarchical'; // default
  }
}

// Enhanced Diagram Generator Class
class IntelligentDiagramBuilder {
  private diagramContext: any;
  private aiProcessor: DiagramAIProcessor;

  constructor(diagramContext: any) {
    this.diagramContext = diagramContext;
    this.aiProcessor = new DiagramAIProcessor();
  }

  public async generateFromPrompt(prompt: string): Promise<{ 
    elements: number, 
    connections: number, 
    intent: DiagramIntent 
  }> {
    const intent = this.aiProcessor.analyzePrompt(prompt);
    const template = this.getTemplate(intent);
    
    // Generate elements
    const elements = this.createElements(template, intent);
    const layout = this.calculateLayout(elements, intent);
    
    // Add to diagram
    const elementIds = await this.addElementsToDiagram(layout.elements);
    const connections = await this.addConnectionsToDiagram(elementIds, intent);
    
    return {
      elements: elementIds.length,
      connections: connections.length,
      intent
    };
  }

  private getTemplate(intent: DiagramIntent): any {
    const templates = {
      safety_case: {
        elements: [
          { type: 'goal', text: 'System is acceptably safe', idText: 'G1' },
          { type: 'strategy', text: 'Argument by decomposition', idText: 'S1' },
          { type: 'goal', text: 'Hardware is safe', idText: 'G2' },
          { type: 'goal', text: 'Software is safe', idText: 'G3' },
          { type: 'sacm', text: 'Test results', idText: 'Sn1' }
        ]
      },
      hazard_analysis: {
        elements: [
          { type: 'goal', text: 'All hazards mitigated', idText: 'G1' },
          { type: 'strategy', text: 'Argument by hazard analysis', idText: 'S1' },
          { type: 'goal', text: 'Hazard 1 is mitigated', idText: 'G2' },
          { type: 'goal', text: 'Hazard 2 is mitigated', idText: 'G3' }
        ]
      },
      software_safety: {
        elements: [
          { type: 'goal', text: 'Software is acceptably safe', idText: 'G1' },
          { type: 'strategy', text: 'Argument by V&V processes', idText: 'S1' },
          { type: 'goal', text: 'Requirements are correct', idText: 'G2' },
          { type: 'goal', text: 'Implementation is verified', idText: 'G3' }
        ]
      },
      flowchart: {
        elements: [
          { type: 'ellipse', text: 'Start' },
          { type: 'rectangle', text: 'Process' },
          { type: 'diamond', text: 'Decision?' },
          { type: 'ellipse', text: 'End' }
        ]
      },
      sequence: {
        elements: [
          { type: 'rectangle', text: 'Actor A' },
          { type: 'rectangle', text: 'System B' },
          { type: 'rectangle', text: 'Service C' }
        ]
      },
      architecture: {
        elements: [
          { type: 'rectangle', text: 'Frontend' },
          { type: 'rectangle', text: 'Backend' },
          { type: 'rectangle', text: 'Database' }
        ]
      }
    };

    return templates[intent.type] || templates.safety_case;
  }

  private createElements(template: any, intent: DiagramIntent): any[] {
    // Use custom elements if provided, otherwise use template
    const baseElements = intent.elements.length > 0 
      ? intent.elements.map((text, i) => ({
          type: this.determineElementType(text, intent.type),
          text,
          idText: this.generateIdText(intent.type, i)
        }))
      : template.elements;

    return baseElements.map((el: any, i: number) => ({
      ...el,
      id: `elem_${Date.now()}_${i}`,
      width: this.calculateWidth(el.text, intent.complexity),
      height: this.calculateHeight(intent.complexity)
    }));
  }

  private determineElementType(text: string, diagramType: string): string {
    const lowerText = text.toLowerCase();
    
    switch (diagramType) {
      case 'safety_case':
        if (/goal|claim|objective/i.test(lowerText)) return 'goal';
        if (/strategy|approach/i.test(lowerText)) return 'strategy';
        if (/evidence|solution/i.test(lowerText)) return 'sacm';
        return 'goal';
      case 'flowchart':
        if (/start|begin/i.test(lowerText)) return 'ellipse';
        if (/end|finish/i.test(lowerText)) return 'ellipse';
        if (/decision|check|if/i.test(lowerText)) return 'diamond';
        return 'rectangle';
      default:
        return 'goal';
    }
  }

  private generateIdText(type: string, index: number): string {
    const prefixes = {
      safety_case: ['G', 'S', 'Sn'],
      hazard_analysis: ['H', 'R', 'M'],
      flowchart: ['P', 'D', 'T']
    };
    const prefix = prefixes[type as keyof typeof prefixes]?.[index % 3] || 'E';
    return `${prefix}${index + 1}`;
  }

  private calculateWidth(text: string, complexity: string): number {
    const base = 120;
    const textMultiplier = Math.min(2.5, text.length * 0.1);
    const complexityMultiplier = complexity === 'complex' ? 1.3 : complexity === 'simple' ? 0.8 : 1;
    return Math.max(base, base + textMultiplier * 20) * complexityMultiplier;
  }

  private calculateHeight(complexity: string): number {
    const base = 60;
    return complexity === 'complex' ? base * 1.2 : complexity === 'simple' ? base * 0.9 : base;
  }

  private calculateLayout(elements: any[], intent: DiagramIntent): { elements: any[] } {
    switch (intent.structure) {
      case 'sequential':
        return this.sequentialLayout(elements);
      case 'network':
        return this.networkLayout(elements);
      default:
        return this.hierarchicalLayout(elements);
    }
  }

  private hierarchicalLayout(elements: any[]): { elements: any[] } {
    if (elements.length === 0) return { elements };
    
    elements[0].x = 400;
    elements[0].y = 100;
    
    const children = elements.slice(1);
    const cols = Math.ceil(Math.sqrt(children.length));
    
    children.forEach((el, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      el.x = 200 + col * (el.width + 80);
      el.y = 250 + row * (el.height + 80);
    });
    
    return { elements };
  }

  private sequentialLayout(elements: any[]): { elements: any[] } {
    let currentY = 100;
    elements.forEach(el => {
      el.x = 400;
      el.y = currentY;
      currentY += el.height + 80;
    });
    return { elements };
  }

  private networkLayout(elements: any[]): { elements: any[] } {
    const centerX = 400, centerY = 300, radius = 150;
    elements.forEach((el, i) => {
      const angle = (2 * Math.PI * i) / elements.length;
      el.x = centerX + radius * Math.cos(angle);
      el.y = centerY + radius * Math.sin(angle);
    });
    return { elements };
  }

  private async addElementsToDiagram(elements: any[]): Promise<string[]> {
    const ids: string[] = [];
    
    for (const element of elements) {
      const shapeId = `shape_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      ids.push(shapeId);
      
      this.diagramContext.addShape({
        id: shapeId,
        type: element.type,
        title: element.text,
        text: element.text,
        mainText: element.text,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        idText: element.idText,
        preview: null,
        cornerRadius: element.type === 'strategy' ? 5 : undefined
      });
    }
    
    return ids;
  }

  private async addConnectionsToDiagram(elementIds: string[], intent: DiagramIntent): Promise<string[]> {
    const connectionIds: string[] = [];
    
    setTimeout(() => {
      switch (intent.structure) {
        case 'sequential':
          for (let i = 0; i < elementIds.length - 1; i++) {
            const connId = `conn_${Date.now()}_${i}`;
            connectionIds.push(connId);
            this.diagramContext.addConnection({
              id: connId,
              from: elementIds[i],
              to: elementIds[i + 1],
              points: [],
              style: 'line'
            });
          }
          break;
        case 'hierarchical':
        default:
          if (elementIds.length > 1) {
            const root = elementIds[0];
            elementIds.slice(1).forEach((id, i) => {
              const connId = `conn_${Date.now()}_${i}`;
              connectionIds.push(connId);
              this.diagramContext.addConnection({
                id: connId,
                from: root,
                to: id,
                points: [],
                style: 'line'
              });
            });
          }
          break;
      }
    }, 200);
    
    return connectionIds;
  }
}

// Enhanced Chat Manager
class DiagramChatManager {
  private messages: Message[] = [];
  private diagramBuilder: IntelligentDiagramBuilder;
  private messageCallbacks: ((messages: Message[]) => void)[] = [];

  constructor(diagramContext: any) {
    this.diagramBuilder = new IntelligentDiagramBuilder(diagramContext);
    this.initializeChat();
  }

  private initializeChat(): void {
    this.addMessage({
      content: "Hello! I'm your intelligent diagram assistant. I can create sophisticated diagrams from natural language descriptions.\n\nTry asking me to:\n• Create a safety case for autonomous vehicles\n• Generate a hazard analysis for medical devices\n• Build a flowchart for user authentication\n\nWhat would you like to create?",
      sender: "ai",
      type: "text"
    });
  }

  public async processMessage(userInput: string): Promise<void> {
    try {
      this.addMessage({
        content: userInput,
        sender: "user",
        type: "text"
      });

      // Determine if this is a generation request
      if (this.isGenerationRequest(userInput)) {
        this.addMessage({
          content: "Analyzing your request and generating the diagram...",
          sender: "ai",
          type: "text"
        });

        const result = await this.diagramBuilder.generateFromPrompt(userInput);
        
        this.addMessage({
          content: `I've created a ${result.intent.type.replace('_', ' ')} diagram for the ${result.intent.domain} domain. Generated ${result.elements} elements with ${result.connections} connections using ${result.intent.structure} layout.`,
          sender: "ai",
          type: "diagram",
          confidence: this.calculateConfidence(result.intent),
          metadata: {
            diagramType: result.intent.type,
            domain: result.intent.domain,
            complexity: result.intent.complexity,
            structure: result.intent.structure,
            elementsCount: result.elements,
            connectionsCount: result.connections
          }
        });
        
      } else {
        // Provide guidance or analysis
        this.addMessage({
          content: this.generateGuidanceResponse(userInput),
          sender: "ai",
          type: "analysis"
        });
      }

    } catch (error) {
      console.error('Error processing message:', error);
      this.addMessage({
        content: "I encountered an error processing your request. Please try rephrasing or check the console for details.",
        sender: "ai",
        type: "error"
      });
    }
  }

  private isGenerationRequest(input: string): boolean {
    return /create|generate|make|build|draw|design/i.test(input);
  }

  private calculateConfidence(intent: DiagramIntent): number {
    let confidence = 0.5;
    if (intent.domain !== 'general') confidence += 0.2;
    if (intent.elements.length > 0) confidence += 0.2;
    if (intent.type !== 'safety_case') confidence += 0.1;
    return Math.min(1.0, confidence);
  }

  private generateGuidanceResponse(input: string): string {
    if (/help|how/i.test(input)) {
      return "I can help you create various types of diagrams:\n\n• Safety Cases (GSN diagrams)\n• Hazard Analysis diagrams\n• Flowcharts and process flows\n• Software safety diagrams\n• Architecture diagrams\n\nJust describe what you want to create, and I'll build it for you!";
    }
    
    if (/analyze|review/i.test(input)) {
      return "I can analyze your diagrams for completeness, structure, and best practices. To get started, please describe what specific aspects you'd like me to review.";
    }
    
    return "I understand you're interested in diagram creation. Could you be more specific about what type of diagram you'd like me to create? For example: 'Create a safety case for automotive braking system' or 'Generate a flowchart for user registration process'.";
  }

  private addMessage(messageData: Omit<Message, 'id' | 'timestamp'>): void {
    const message: Message = {
      ...messageData,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date()
    };

    this.messages.push(message);
    this.notifyCallbacks();
  }

  public onMessagesChange(callback: (messages: Message[]) => void): void {
    this.messageCallbacks.push(callback);
  }

  private notifyCallbacks(): void {
    this.messageCallbacks.forEach(callback => callback([...this.messages]));
  }

  public getMessages(): Message[] {
    return [...this.messages];
  }

  public clearMessages(): void {
    this.messages = [];
    this.initializeChat();
    this.notifyCallbacks();
  }
}

// Main Component
const AiDiagramGen: React.FC = () => {
  const diagramContext = useDiagramContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatManager, setChatManager] = useState<DiagramChatManager | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat manager
  useEffect(() => {
    const manager = new DiagramChatManager(diagramContext);
    manager.onMessagesChange(setMessages);
    setMessages(manager.getMessages());
    setChatManager(manager);
  }, [diagramContext]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating || !chatManager) return;

    const userInput = inputValue;
    setInputValue("");
    setIsGenerating(true);

    try {
      await chatManager.processMessage(userInput);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const useSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const clearChat = () => {
    if (chatManager) {
      chatManager.clearMessages();
    }
  };

  const ENHANCED_SUGGESTIONS = [
    "Create a safety case for autonomous vehicle with sensor fusion and decision algorithms",
    "Generate a hazard analysis for medical device with risk mitigation strategies",
    "Build a software safety diagram with verification and validation processes",
    "Create a flowchart for secure authentication with multi-factor verification",
    "Design an architecture diagram for microservices with API gateways"
  ];

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-full p-2">
            <Brain size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Intelligent Diagram Generator</h3>
            <p className="text-xs text-gray-600">
              Advanced AI-powered diagram creation with natural language processing
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
                    : message.type === "error"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : message.type === "diagram"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : message.type === "analysis"
                    ? "bg-purple-50 text-purple-800 border border-purple-200"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {message.sender === "user" ? (
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <Brain size={14} className="opacity-70" />
                  )}
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.type === "diagram" && (
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                      <Target size={10} className="inline mr-1" />
                      Generated
                    </span>
                  )}
                  {message.confidence && (
                    <span className="text-xs bg-black/10 px-2 py-0.5 rounded-full">
                      {Math.round(message.confidence * 100)}% confident
                    </span>
                  )}
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
                
                {message.metadata && (
                  <div className="mt-2 p-2 bg-black/5 rounded text-xs">
                    <div className="grid grid-cols-2 gap-1">
                      <div><strong>Type:</strong> {message.metadata.diagramType}</div>
                      <div><strong>Domain:</strong> {message.metadata.domain}</div>
                      <div><strong>Elements:</strong> {message.metadata.elementsCount}</div>
                      <div><strong>Connections:</strong> {message.metadata.connectionsCount}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 border border-gray-200 max-w-[85%]">
                <div className="flex items-center space-x-2">
                  <Brain size={16} className="animate-pulse" />
                  <div className="text-sm">AI is analyzing and generating...</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "100ms" }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Quick prompts */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-600 flex items-center">
            <Lightbulb size={14} className="mr-1" /> Intelligent prompts
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 p-1"
            onClick={clearChat}
            title="Clear chat"
          >
            <Trash size={16} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {ENHANCED_SUGGESTIONS.map((prompt, index) => (
            <button
              key={index}
              className="text-xs bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
              onClick={() => useSuggestion(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Input area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end">
          <div className="flex-grow relative">
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe your diagram in detail... (e.g., 'Create a safety case for autonomous vehicle with perception, decision making, and actuation systems')"
              rows={2}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
          <button
            className={`ml-2 p-2 rounded-full transition-colors ${
              inputValue.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400"
            }`}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isGenerating}
          >
            {isGenerating ? (
              <div className="animate-spin">
                <Zap size={18} />
              </div>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>Press Enter to send • Shift+Enter for new line</span>
          <span>{messages.length} messages</span>
        </div>
      </div>
    </div>
  );
};

export default AiDiagramGen;