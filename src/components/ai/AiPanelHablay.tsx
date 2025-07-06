// src/components/ai/AiPanelHablay.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  Workflow,
  User,
  Brain,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";
import { gsnElements } from "../../data/shapeData";

// Enhanced message interface for Hablay version
interface HablayMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type: "text" | "action" | "error" | "success" | "diagram";
  confidence?: number;
  metadata?: {
    diagramType?: string;
    elementsCreated?: number;
    connectionsCreated?: number;
    processingTime?: number;
  };
}

// Enhanced AI Processor specifically for Hablay version
class HablayAIProcessor {
  private intentPatterns: Map<string, RegExp[]> = new Map();
  private domainDetectors: Map<string, string[]> = new Map();

  constructor() {
    this.initializePatterns();
    this.initializeDomains();
  }

  private initializePatterns(): void {
    this.intentPatterns = new Map([
      ['safety_case', [
        /safety\s+case/i, /gsn/i, /goal\s+structuring/i, /assurance/i,
        /safety\s+argument/i, /claim.*evidence/i
      ]],
      ['hazard_analysis', [
        /hazard/i, /risk\s+analysis/i, /fmea/i, /fault/i, /threat/i,
        /danger/i, /mishap/i, /accident/i
      ]],
      ['software_safety', [
        /software\s+safety/i, /verification/i, /validation/i, /v&v/i,
        /code\s+review/i, /testing/i, /quality\s+assurance/i
      ]],
      ['flowchart', [
        /flowchart/i, /flow/i, /process/i, /workflow/i, /procedure/i,
        /step.*step/i, /algorithm/i
      ]],
      ['architecture', [
        /architecture/i, /system\s+design/i, /component/i, /module/i,
        /structure/i, /topology/i
      ]],
      ['sequence', [
        /sequence/i, /interaction/i, /timeline/i, /communication/i,
        /message\s+flow/i, /protocol/i
      ]]
    ]);
  }

  private initializeDomains(): void {
    this.domainDetectors = new Map([
      ['automotive', [
        'vehicle', 'car', 'automotive', 'driving', 'autonomous', 'brake',
        'engine', 'transmission', 'steering', 'airbag', 'cruise control'
      ]],
      ['aviation', [
        'aircraft', 'aviation', 'flight', 'pilot', 'runway', 'navigation',
        'radar', 'altitude', 'landing', 'takeoff', 'air traffic'
      ]],
      ['medical', [
        'medical', 'healthcare', 'patient', 'clinical', 'hospital',
        'device', 'therapy', 'diagnosis', 'treatment', 'surgical'
      ]],
      ['software', [
        'software', 'application', 'system', 'code', 'program',
        'database', 'server', 'api', 'interface', 'algorithm'
      ]],
      ['nuclear', [
        'nuclear', 'reactor', 'radiation', 'power plant', 'isotope',
        'containment', 'radioactive', 'uranium', 'plutonium'
      ]],
      ['railway', [
        'train', 'railway', 'railroad', 'locomotive', 'track',
        'signaling', 'station', 'crossing', 'switch'
      ]]
    ]);
  }

  public analyzePrompt(prompt: string): {
    diagramType: string;
    domain: string;
    complexity: 'simple' | 'medium' | 'complex';
    elements: string[];
    confidence: number;
  } {
    const lowerPrompt = prompt.toLowerCase();
    
    const diagramType = this.detectDiagramType(lowerPrompt);
    const domain = this.detectDomain(lowerPrompt);
    const complexity = this.detectComplexity(prompt);
    const elements = this.extractElements(prompt);
    const confidence = this.calculateConfidence(diagramType, domain, elements);
    
    return { diagramType, domain, complexity, elements, confidence };
  }

  private detectDiagramType(prompt: string): string {
    for (const [type, patterns] of this.intentPatterns) {
      for (const pattern of patterns) {
        if (pattern.test(prompt)) {
          return type;
        }
      }
    }
    
    // Fallback logic
    if (/goal|claim|evidence/i.test(prompt)) return 'safety_case';
    if (/step|process|flow/i.test(prompt)) return 'flowchart';
    return 'safety_case';
  }

  private detectDomain(prompt: string): string {
    let bestDomain = 'general';
    let maxMatches = 0;
    
    for (const [domain, keywords] of this.domainDetectors) {
      const matches = keywords.filter(keyword => prompt.toLowerCase().includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestDomain = domain;
      }
    }
    
    return bestDomain;
  }

  private detectComplexity(prompt: string): 'simple' | 'medium' | 'complex' {
    const lowerPrompt = prompt.toLowerCase();
    
    if (/simple|basic|quick|minimal|brief/i.test(lowerPrompt)) return 'simple';
    if (/complex|advanced|detailed|comprehensive|extensive/i.test(lowerPrompt)) return 'complex';
    if (prompt.length > 200) return 'complex';
    if (prompt.length > 100) return 'medium';
    return 'simple';
  }

  private extractElements(prompt: string): string[] {
    const elements: string[] = [];
    
    // Extract quoted elements
    const quotes = prompt.match(/"([^"]+)"/g);
    if (quotes) {
      elements.push(...quotes.map(q => q.slice(1, -1)));
    }
    
    // Extract numbered lists
    const numbered = prompt.match(/\d+\.\s*([^\n\r\.]+)/g);
    if (numbered) {
      elements.push(...numbered.map(n => n.replace(/^\d+\.\s*/, '').trim()));
    }
    
    // Extract bullet points
    const bullets = prompt.match(/[-*•]\s*([^\n\r\-\*•]+)/g);
    if (bullets) {
      elements.push(...bullets.map(b => b.replace(/^[-*•]\s*/, '').trim()));
    }
    
    return elements.filter(el => el.length > 0);
  }

  private calculateConfidence(diagramType: string, domain: string, elements: string[]): number {
    let confidence = 0.5;
    
    if (diagramType !== 'safety_case') confidence += 0.1; // Non-default type detected
    if (domain !== 'general') confidence += 0.2; // Specific domain detected
    if (elements.length > 0) confidence += 0.2; // Elements extracted
    if (elements.length > 3) confidence += 0.1; // Many elements
    
    return Math.min(1.0, confidence);
  }
}

// Enhanced Diagram Builder for Hablay
class HablayDiagramBuilder {
  private diagramContext: any;
  private aiProcessor: HablayAIProcessor;

  constructor(diagramContext: any) {
    this.diagramContext = diagramContext;
    this.aiProcessor = new HablayAIProcessor();
  }

  public async buildDiagramFromPrompt(prompt: string): Promise<{
    elementsCreated: number;
    connectionsCreated: number;
    diagramType: string;
    confidence: number;
    processingTime: number;
  }> {
    const startTime = Date.now();
    
    try {
      const analysis = this.aiProcessor.analyzePrompt(prompt);
      const template = this.selectTemplate(analysis);
      const elements = this.prepareElements(template, analysis);
      const layout = this.calculateLayout(elements, analysis);
      
      const createdElements = await this.createElements(layout);
      const connections = await this.createConnections(createdElements, analysis);
      
      return {
        elementsCreated: createdElements.length,
        connectionsCreated: connections.length,
        diagramType: analysis.diagramType,
        confidence: analysis.confidence,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('Error building diagram:', error);
      throw error;
    }
  }

  private selectTemplate(analysis: any): any {
    const templates = {
      safety_case: {
        elements: [
          { type: 'goal', text: 'System is acceptably safe for operation', idText: 'G1' },
          { type: 'strategy', text: 'Argument by systematic decomposition', idText: 'S1' },
          { type: 'goal', text: 'Hardware components are safe', idText: 'G2' },
          { type: 'goal', text: 'Software components are safe', idText: 'G3' },
          { type: 'goal', text: 'Human factors are controlled', idText: 'G4' },
          { type: 'sacm', text: 'Hardware certification evidence', idText: 'Sn1' },
          { type: 'sacm', text: 'Software verification results', idText: 'Sn2' }
        ]
      },
      hazard_analysis: {
        elements: [
          { type: 'goal', text: 'All identified hazards are adequately controlled', idText: 'G1' },
          { type: 'strategy', text: 'Argument by comprehensive hazard analysis', idText: 'S1' },
          { type: 'goal', text: 'Critical hazard H1 is mitigated', idText: 'G2' },
          { type: 'goal', text: 'Major hazard H2 is controlled', idText: 'G3' },
          { type: 'goal', text: 'Minor hazards are managed', idText: 'G4' },
          { type: 'sacm', text: 'Hazard analysis report', idText: 'Sn1' }
        ]
      },
      flowchart: {
        elements: [
          { type: 'ellipse', text: 'Start Process' },
          { type: 'rectangle', text: 'Initialize System' },
          { type: 'rectangle', text: 'Validate Input' },
          { type: 'diamond', text: 'Input Valid?' },
          { type: 'rectangle', text: 'Process Data' },
          { type: 'rectangle', text: 'Generate Output' },
          { type: 'ellipse', text: 'End Process' }
        ]
      },
      software_safety: {
        elements: [
          { type: 'goal', text: 'Software is acceptably safe', idText: 'G1' },
          { type: 'strategy', text: 'Argument by V&V processes', idText: 'S1' },
          { type: 'goal', text: 'Requirements are complete', idText: 'G2' },
          { type: 'goal', text: 'Design is correct', idText: 'G3' },
          { type: 'goal', text: 'Implementation is verified', idText: 'G4' },
          { type: 'sacm', text: 'Requirements review', idText: 'Sn1' }
        ]
      }
    };

    // Use custom elements if provided
    if (analysis.elements.length > 0) {
      return {
        elements: analysis.elements.map((text: string, index: number) => ({
          type: this.determineElementType(text, analysis.diagramType),
          text: text,
          idText: this.generateIdText(analysis.diagramType, index)
        }))
      };
    }

    return templates[analysis.diagramType as keyof typeof templates] || templates.safety_case;
  }

  private determineElementType(text: string, diagramType: string): string {
    const lowerText = text.toLowerCase();
    
    switch (diagramType) {
      case 'safety_case':
        if (/goal|claim|objective|shall/i.test(lowerText)) return 'goal';
        if (/strategy|approach|argument|by/i.test(lowerText)) return 'strategy';
        if (/evidence|result|report|test|proof/i.test(lowerText)) return 'sacm';
        return 'goal';
        
      case 'flowchart':
        if (/start|begin|init/i.test(lowerText)) return 'ellipse';
        if (/end|finish|complete|stop/i.test(lowerText)) return 'ellipse';
        if (/decision|check|if|valid|correct/i.test(lowerText)) return 'diamond';
        return 'rectangle';
        
      default:
        return 'goal';
    }
  }

  private generateIdText(diagramType: string, index: number): string {
    const prefixes = {
      safety_case: ['G', 'S', 'Sn', 'A', 'J'],
      hazard_analysis: ['G', 'S', 'H', 'R'],
      flowchart: ['S', 'P', 'D', 'E']
    };
    
    const typePrefix = prefixes[diagramType as keyof typeof prefixes] || ['E'];
    const prefix = typePrefix[Math.min(index, typePrefix.length - 1)];
    
    return `${prefix}${index + 1}`;
  }

  private prepareElements(template: any, analysis: any): any[] {
    return template.elements.map((element: any, index: number) => ({
      ...element,
      id: `elem_${Date.now()}_${index}`,
      width: this.calculateWidth(element.text, analysis.complexity),
      height: this.calculateHeight(element.type, analysis.complexity)
    }));
  }

  private calculateWidth(text: string, complexity: string): number {
    const baseWidth = 140;
    const textFactor = Math.min(2.0, text.length * 0.08);
    const complexityMultiplier = complexity === 'complex' ? 1.3 : complexity === 'simple' ? 0.9 : 1.1;
    
    return Math.max(baseWidth, (baseWidth + textFactor * 25)) * complexityMultiplier;
  }

  private calculateHeight(type: string, complexity: string): number {
    const baseHeights = {
      'goal': 70,
      'strategy': 65,
      'sacm': 60,
      'rectangle': 60,
      'ellipse': 55,
      'diamond': 75
    };
    
    const baseHeight = baseHeights[type as keyof typeof baseHeights] || 65;
    const complexityMultiplier = complexity === 'complex' ? 1.2 : complexity === 'simple' ? 0.9 : 1.0;
    
    return baseHeight * complexityMultiplier;
  }

  private calculateLayout(elements: any[], analysis: any): any[] {
    const padding = analysis.complexity === 'complex' ? 100 : analysis.complexity === 'simple' ? 70 : 85;
    
    if (analysis.diagramType === 'flowchart') {
      return this.verticalFlowLayout(elements, padding);
    } else {
      return this.hierarchicalLayout(elements, padding);
    }
  }

  private verticalFlowLayout(elements: any[], padding: number): any[] {
    let currentY = 120;
    const centerX = 400;
    
    return elements.map((element, index) => ({
      ...element,
      x: centerX - (element.width / 2),
      y: currentY + (index * (element.height + padding))
    }));
  }

  private hierarchicalLayout(elements: any[], padding: number): any[] {
    if (elements.length === 0) return elements;
    
    // Position root element
    elements[0].x = 400 - (elements[0].width / 2);
    elements[0].y = 100;
    
    // Position children
    const children = elements.slice(1);
    const childrenPerRow = Math.max(2, Math.ceil(Math.sqrt(children.length)));
    
    children.forEach((element, index) => {
      const row = Math.floor(index / childrenPerRow);
      const col = index % childrenPerRow;
      const totalRowWidth = childrenPerRow * element.width + (childrenPerRow - 1) * padding;
      const startX = 400 - (totalRowWidth / 2);
      
      element.x = startX + col * (element.width + padding);
      element.y = 220 + row * (element.height + padding);
    });
    
    return elements;
  }

  private async createElements(elements: any[]): Promise<string[]> {
    const createdIds: string[] = [];
    
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const shapeId = `shape_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`;
      createdIds.push(shapeId);
      
      // Find appropriate GSN element or use default
      const gsnElement = gsnElements.find(el => el.type === element.type) || gsnElements[0];
      
      this.diagramContext.addShape({
        ...gsnElement,
        id: shapeId,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        value: element.text,
        text: element.text,
        mainText: element.text,
        title: element.text,
        idText: element.idText,
        cornerRadius: element.type === 'strategy' ? 8 : undefined
      });
    }
    
    return createdIds;
  }

  private async createConnections(elementIds: string[], analysis: any): Promise<string[]> {
    const connectionIds: string[] = [];
    
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          if (analysis.diagramType === 'flowchart') {
            // Sequential connections for flowchart
            for (let i = 0; i < elementIds.length - 1; i++) {
              const connId = `conn_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 3)}`;
              connectionIds.push(connId);
              
              this.diagramContext.addConnection({
                id: connId,
                from: elementIds[i],
                to: elementIds[i + 1],
                points: []
              });
            }
          } else {
            // Hierarchical connections for safety cases
            if (elementIds.length > 1) {
              const rootId = elementIds[0];
              const childIds = elementIds.slice(1);
              
              childIds.forEach((childId, index) => {
                const connId = `conn_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 3)}`;
                connectionIds.push(connId);
                
                this.diagramContext.addConnection({
                  id: connId,
                  from: rootId,
                  to: childId,
                  points: []
                });
              });
            }
          }
          
          resolve(connectionIds);
        } catch (error) {
          console.error('Error creating connections:', error);
          resolve(connectionIds);
        }
      }, 250);
    });
  }
}

// Enhanced Chat Manager for Hablay
class HablayChatManager {
  private messages: HablayMessage[] = [];
  private diagramBuilder: HablayDiagramBuilder;
  private messageCallbacks: ((messages: HablayMessage[]) => void)[] = [];

  constructor(diagramContext: any) {
    this.diagramBuilder = new HablayDiagramBuilder(diagramContext);
    this.initializeWelcome();
  }

  private initializeWelcome(): void {
    this.addMessage({
      content: "Hello! I'm your enhanced diagram assistant. I can create sophisticated diagrams from natural language descriptions with improved understanding and layout optimization.\n\n🎯 Try: 'Create a safety case for autonomous vehicle'\n🔄 Try: 'Generate a flowchart for user login process'\n📊 Try: 'Build a hazard analysis for medical device'\n\nWhat would you like to create?",
      sender: "ai",
      type: "text",
      confidence: 1.0
    });
  }

  public async processUserMessage(input: string): Promise<void> {
    try {
      // Add user message
      this.addMessage({
        content: input,
        sender: "user",
        type: "text"
      });

      // Determine if this is a generation request
      if (this.isGenerationRequest(input)) {
        // Show processing message
        this.addMessage({
          content: "Analyzing your request and generating the diagram with enhanced AI...",
          sender: "ai",
          type: "text"
        });

        // Generate diagram
        const result = await this.diagramBuilder.buildDiagramFromPrompt(input);
        
        // Add success message
        this.addMessage({
          content: `Successfully created a ${result.diagramType.replace('_', ' ')} diagram! Generated ${result.elementsCreated} elements with ${result.connectionsCreated} connections. Processing took ${result.processingTime}ms with ${Math.round(result.confidence * 100)}% confidence.`,
          sender: "ai",
          type: "diagram",
          confidence: result.confidence,
          metadata: {
            diagramType: result.diagramType,
            elementsCreated: result.elementsCreated,
            connectionsCreated: result.connectionsCreated,
            processingTime: result.processingTime
          }
        });
        
      } else {
        // Provide guidance
        this.addMessage({
          content: this.generateGuidanceResponse(input),
          sender: "ai",
          type: "text",
          confidence: 0.8
        });
      }

    } catch (error) {
      console.error('Error processing message:', error);
      this.addMessage({
        content: "I encountered an issue creating your diagram. Please try rephrasing your request with more specific details about what you'd like to create.",
        sender: "ai",
        type: "error"
      });
    }
  }

  private isGenerationRequest(input: string): boolean {
    return /create|generate|make|build|draw|design|construct|develop/i.test(input);
  }

  private generateGuidanceResponse(input: string): string {
    const lowerInput = input.toLowerCase();
    
    if (/help|how|what.*can/i.test(lowerInput)) {
      return "I can help you create various professional diagrams:\n\n🛡️ Safety Cases (GSN format)\n⚠️ Hazard Analysis diagrams\n🔄 Process Flowcharts\n💻 Software Safety diagrams\n🏗️ Architecture diagrams\n\nJust describe what you want to create, include specific elements if you have them, and I'll build it for you with proper layout and connections!";
    }
    
    if (/analyze|review|check/i.test(lowerInput)) {
      return "I can analyze your diagrams for structure and completeness. To get started, please describe what specific aspects you'd like me to review, or ask me to create a new diagram.";
    }
    
    if (/example|sample/i.test(lowerInput)) {
      return "Here are some example requests you can try:\n\n• 'Create a safety case for automotive braking system'\n• 'Generate a flowchart for customer order processing'\n• 'Build a hazard analysis for surgical robot'\n• 'Make a software safety diagram for flight control system'\n\nFeel free to modify these or create your own request!";
    }
    
    return "I understand you're interested in diagram creation. To help you better, could you specify what type of diagram you'd like me to create? For example: 'Create a safety case for [your domain]' or 'Generate a flowchart for [your process]'.";
  }

  private addMessage(messageData: Omit<HablayMessage, 'id' | 'timestamp'>): void {
    const message: HablayMessage = {
      ...messageData,
      id: `hablay_msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date()
    };

    this.messages.push(message);
    this.notifyCallbacks();
  }

  public onMessagesChange(callback: (messages: HablayMessage[]) => void): void {
    this.messageCallbacks.push(callback);
  }

  private notifyCallbacks(): void {
    this.messageCallbacks.forEach(callback => callback([...this.messages]));
  }

  public getMessages(): HablayMessage[] {
    return [...this.messages];
  }

  public clearMessages(): void {
    this.messages = [];
    this.initializeWelcome();
    this.notifyCallbacks();
  }

  public getStats(): { totalMessages: number; diagramsGenerated: number; avgConfidence: number } {
    const diagramMessages = this.messages.filter(m => m.type === 'diagram');
    const confidenceScores = this.messages.filter(m => m.confidence !== undefined).map(m => m.confidence!);
    const avgConfidence = confidenceScores.length > 0 ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length : 0;

    return {
      totalMessages: this.messages.length,
      diagramsGenerated: diagramMessages.length,
      avgConfidence: Math.round(avgConfidence * 100) / 100
    };
  }
}

// Enhanced Message Component for Hablay
const HablayMessageBubble: React.FC<{
  message: HablayMessage;
}> = ({ message }) => {
  const getIcon = () => {
    switch (message.type) {
      case "error":
        return <AlertCircle size={14} className="text-red-500" />;
      case "success":
        return <CheckCircle size={14} className="text-green-500" />;
      case "diagram":
        return <Target size={14} className="text-blue-500" />;
      case "action":
        return <Zap size={14} className="text-orange-500" />;
      default:
        return message.sender === "user" ? (
          <User size={14} className="opacity-70" />
        ) : (
          <Brain size={14} className="opacity-70" />
        );
    }
  };

  const getMessageStyle = () => {
    const baseStyle = "max-w-[85%] rounded-lg p-3 shadow-sm";
    
    switch (message.type) {
      case "error":
        return `${baseStyle} bg-red-50 text-red-800 border border-red-200`;
      case "success":
        return `${baseStyle} bg-green-50 text-green-800 border border-green-200`;
      case "diagram":
        return `${baseStyle} bg-blue-50 text-blue-800 border border-blue-200`;
      case "action":
        return `${baseStyle} bg-orange-50 text-orange-800 border border-orange-200`;
      default:
        return message.sender === "user"
          ? `${baseStyle} bg-blue-600 text-white`
          : `${baseStyle} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

  return (
    <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
      <div className={getMessageStyle()}>
        <div className="flex items-center gap-2 mb-1">
          {getIcon()}
          <span className="text-xs opacity-70">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {message.type === "diagram" && (
            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
              Generated
            </span>
          )}
          {message.confidence && (
            <span className="text-xs bg-black/10 px-2 py-0.5 rounded-full">
              {Math.round(message.confidence * 100)}% confident
            </span>
          )}
        </div>
        
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        
        {message.metadata && (
          <div className="mt-2 p-2 bg-black/5 rounded text-xs">
            <div className="grid grid-cols-2 gap-1">
              {message.metadata.diagramType && (
                <div><strong>Type:</strong> {message.metadata.diagramType}</div>
              )}
              {message.metadata.elementsCreated && (
                <div><strong>Elements:</strong> {message.metadata.elementsCreated}</div>
              )}
              {message.metadata.connectionsCreated && (
                <div><strong>Connections:</strong> {message.metadata.connectionsCreated}</div>
              )}
              {message.metadata.processingTime && (
                <div><strong>Time:</strong> {message.metadata.processingTime}ms</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Hablay AI Panel Component
const AiPanelHablay: React.FC = () => {
  const diagramContext = useDiagramContext();
  const { shapes, connections } = diagramContext;

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<HablayMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatManager, setChatManager] = useState<HablayChatManager | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat manager
  useEffect(() => {
    if (showChat && !chatManager) {
      const manager = new HablayChatManager(diagramContext);
      manager.onMessagesChange(setMessages);
      setMessages(manager.getMessages());
      setChatManager(manager);
    }
  }, [showChat, diagramContext]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartChat = () => {
    setShowChat(true);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating || !chatManager) return;

    const userInput = inputValue;
    setInputValue("");
    setIsGenerating(true);

    try {
      await chatManager.processUserMessage(userInput);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setChatManager(null);
    setMessages([]);
  };

  const handleClearChat = () => {
    if (chatManager) {
      chatManager.clearMessages();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const stats = chatManager?.getStats() || { totalMessages: 0, diagramsGenerated: 0, avgConfidence: 0 };

  // Initial panel
  if (!showChat) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-4 mb-6">
          <Brain size={32} className="text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Enhanced AI Diagram Assistant
        </h3>
        <p className="text-sm text-gray-600 text-center mb-6 max-w-sm leading-relaxed">
          Advanced natural language processing for creating professional diagrams. 
          Supports safety cases, hazard analysis, flowcharts, and more with intelligent layout optimization.
        </p>
        <div className="space-y-2 mb-6 text-xs text-gray-500 text-center">
          <div>✨ Enhanced understanding of complex requirements</div>
          <div>🎯 Intelligent element type detection</div>
          <div>📐 Optimized layout algorithms</div>
          <div>🔗 Smart connection generation</div>
        </div>
        <button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg"
          onClick={handleStartChat}
        >
          Start Enhanced AI Assistant
        </button>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Enhanced Header */}
      <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-2 mr-3">
              <Brain size={18} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Enhanced AI Assistant</h3>
              <p className="text-xs text-gray-600">
                {shapes.length} elements • {connections.length} connections • {stats.diagramsGenerated} diagrams • Avg AI: {Math.round(stats.avgConfidence * 100)}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={handleClearChat}
              title="Clear chat"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L7.586 12l-1.293 1.293a1 1 0 101.414 1.414L9 13.414l2.293 2.293a1 1 0 001.414-1.414L11.414 12l1.293-1.293z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={handleCloseChat}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
        <div className="space-y-4">
          {messages.map((message) => (
            <HablayMessageBubble
              key={message.id}
              message={message}
            />
          ))}

          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex space-x-2 items-center">
                  <Brain size={16} className="animate-pulse text-blue-500" />
                  <div className="text-sm">Enhanced AI processing...</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2 mb-3 overflow-x-auto">
          <button
            onClick={() => handleQuickPrompt("Create a comprehensive safety case for autonomous vehicle with advanced sensor fusion, AI decision making, and fail-safe mechanisms")}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-full hover:from-blue-100 hover:to-blue-150 transition-all whitespace-nowrap"
          >
            <Target size={14} /> Advanced Safety Case
          </button>
          <button
            onClick={() => handleQuickPrompt("Generate an intelligent flowchart for secure multi-factor authentication with biometric verification and adaptive security")}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-full hover:from-green-100 hover:to-green-150 transition-all whitespace-nowrap"
          >
            <Workflow size={14} /> Smart Flowchart
          </button>
          <button
            onClick={() => handleQuickPrompt("Build a detailed hazard analysis for surgical robot with risk mitigation and patient safety protocols")}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-full hover:from-purple-100 hover:to-purple-150 transition-all whitespace-nowrap"
          >
            <AlertCircle size={14} /> Hazard Analysis
          </button>
        </div>

        {/* Enhanced Input */}
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your diagram requirements in detail for best results..."
            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            disabled={isGenerating}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isGenerating}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-all ${
              inputValue.trim() && !isGenerating
                ? "text-blue-500 hover:bg-blue-50 hover:scale-110"
                : "text-gray-400"
            }`}
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
          <span>Enhanced AI • {stats.totalMessages} messages • {stats.diagramsGenerated} diagrams created</span>
          <span>Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};

export default AiPanelHablay;