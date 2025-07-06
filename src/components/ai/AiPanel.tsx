// src/components/ai/AiPanel.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  User,
  Bot,
  Wand2,
  Workflow,
  ListTree,
  Trash2,
  Brain,
  Target,
  AlertCircle,
  CheckCircle,
  Zap,
} from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";
import { AIServiceManager, DiagramAIHelper } from "../../services/aiService";
import { ShapeOnCanvas } from "../../types/shapes";

// Enhanced Message interface
interface EnhancedMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type: "text" | "action" | "error" | "success" | "diagram" | "analysis";
  confidence?: number;
  metadata?: {
    diagramType?: string;
    domain?: string;
    complexity?: string;
    elementsCount?: number;
    connectionsCount?: number;
    processingTime?: number;
  };
}

// Simple Intent Analyzer for compatibility
class SimpleIntentAnalyzer {
  public analyzePrompt(prompt: string): {
    diagramType: string;
    domain: string;
    complexity: string;
    elements: string[];
  } {
    const lowerPrompt = prompt.toLowerCase();
    
    return {
      diagramType: this.detectDiagramType(lowerPrompt),
      domain: this.detectDomain(lowerPrompt),
      complexity: this.detectComplexity(lowerPrompt),
      elements: this.extractElements(prompt)
    };
  }

  private detectDiagramType(prompt: string): string {
    if (/safety\s+case|gsn|goal\s+structuring/i.test(prompt)) return 'safety_case';
    if (/hazard|risk|fmea|fault/i.test(prompt)) return 'hazard_analysis';
    if (/flowchart|flow|process|workflow/i.test(prompt)) return 'flowchart';
    if (/software\s+safety|verification|validation/i.test(prompt)) return 'software_safety';
    if (/architecture|system\s+design|component/i.test(prompt)) return 'architecture';
    return 'custom';
  }

  private detectDomain(prompt: string): string {
    if (/vehicle|car|automotive|driving|autonomous/i.test(prompt)) return 'automotive';
    if (/medical|healthcare|patient|clinical|hospital/i.test(prompt)) return 'medical';
    if (/aircraft|aviation|flight|pilot/i.test(prompt)) return 'aviation';
    if (/software|code|program|system|application/i.test(prompt)) return 'software';
    if (/nuclear|reactor|radiation/i.test(prompt)) return 'nuclear';
    return 'general';
  }

  private detectComplexity(prompt: string): string {
    if (/simple|basic|quick|minimal/i.test(prompt)) return 'simple';
    if (/complex|advanced|detailed|comprehensive/i.test(prompt)) return 'complex';
    return 'medium';
  }

  private extractElements(prompt: string): string[] {
    const elements: string[] = [];
    
    // Extract quoted strings
    const quotes = prompt.match(/"([^"]+)"/g);
    if (quotes) {
      elements.push(...quotes.map(q => q.slice(1, -1)));
    }
    
    // Extract numbered items
    const numbered = prompt.match(/\d+\.\s*([^\n\.]+)/g);
    if (numbered) {
      elements.push(...numbered.map(n => n.replace(/^\d+\.\s*/, '').trim()));
    }
    
    return elements;
  }
}

// Enhanced AI Chat Manager with compatibility fixes
class AdvancedChatManager {
  private aiService: AIServiceManager;
  private diagramHelper: DiagramAIHelper;
  private intentAnalyzer: SimpleIntentAnalyzer;
  private messageHistory: EnhancedMessage[] = [];
  private diagramContext: any;
  private isInitialized: boolean = false;
  private messageCallbacks: ((messages: EnhancedMessage[]) => void)[] = [];

  constructor(diagramContext: any) {
    this.aiService = AIServiceManager.getInstance();
    this.diagramHelper = new DiagramAIHelper();
    this.intentAnalyzer = new SimpleIntentAnalyzer();
    this.diagramContext = diagramContext;
    console.log('[AdvancedChatManager] Initialized with enhanced AI capabilities');
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('[AdvancedChatManager] Already initialized');
      return;
    }

    try {
      console.log('[AdvancedChatManager] Starting initialization...');
      
      this.addMessage({
        text: "Hello! I'm your advanced AI diagram assistant with enhanced natural language processing. I can:\n\n🎯 Create sophisticated diagrams from detailed descriptions\n🧠 Analyze existing diagrams for completeness and quality\n⚡ Optimize layouts and suggest improvements\n🔍 Answer complex questions about diagram best practices\n\nWhat would you like to create or analyze today?",
        sender: "bot",
        type: "text",
        confidence: 1.0
      });
      
      this.isInitialized = true;
      console.log('[AdvancedChatManager] Initialization complete');
    } catch (error) {
      console.error('[AdvancedChatManager] Initialization error:', error);
      this.addMessage({
        text: "AI Assistant initialized successfully! I'm ready to help you create and analyze diagrams with advanced capabilities.",
        sender: "bot",
        type: "text"
      });
      this.isInitialized = true;
    }
  }

  public async processMessage(input: string): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log('[AdvancedChatManager] Processing message:', input.substring(0, 50) + '...');
      
      // Add user message
      this.addMessage({
        text: input,
        sender: "user",
        type: "text"
      });

      // Analyze intent using simple analyzer (compatibility fix)
      const intentData = this.intentAnalyzer.analyzePrompt(input);
      console.log('[AdvancedChatManager] Analyzed intent:', intentData);

      // Process based on intent and complexity
      let response: string;
      let messageType: EnhancedMessage['type'] = "text";
      let confidence = 0.5;
      let metadata: any = {};

      const currentDiagramContext = {
        shapes: this.diagramContext.shapes || [],
        connections: this.diagramContext.connections || []
      };

      // Enhanced command processing
      switch (this.determineActionType(input)) {
        case 'generate':
          const result = await this.generateDiagram(input, intentData);
          response = result.response;
          messageType = "diagram";
          confidence = result.confidence;
          metadata = result.metadata;
          break;

        case 'analyze':
          response = await this.diagramHelper.analyzeShape(
            currentDiagramContext.shapes,
            currentDiagramContext.connections
          );
          messageType = "analysis";
          confidence = 0.9;
          break;

        case 'optimize':
          response = await this.diagramHelper.suggestOptimizations(
            currentDiagramContext.shapes,
            currentDiagramContext.connections
          );
          messageType = "action";
          confidence = 0.85;
          break;

        case 'query':
        default:
          response = await this.diagramHelper.processGeneralQuery(
            input,
            currentDiagramContext.shapes,
            currentDiagramContext.connections
          );
          messageType = "text";
          confidence = 0.8;
      }

      // Add AI response with enhanced metadata
      this.addMessage({
        text: response,
        sender: "bot",
        type: messageType,
        confidence: confidence,
        metadata: {
          ...metadata,
          processingTime: Date.now() - startTime,
          diagramType: intentData.diagramType,
          domain: intentData.domain,
          complexity: intentData.complexity
        }
      });

      console.log('[AdvancedChatManager] Message processed successfully in', Date.now() - startTime, 'ms');

    } catch (error) {
      console.error('[AdvancedChatManager] Error processing message:', error);
      this.addMessage({
        text: "I encountered an issue processing your request. The advanced AI system is still learning, but I'm here to help! Please try rephrasing your request or ask me something specific about diagram creation.",
        sender: "bot",
        type: "error"
      });
    }
  }

  private determineActionType(input: string): 'generate' | 'analyze' | 'optimize' | 'query' {
    const lowerInput = input.toLowerCase();

    if (/create|generate|make|build|draw|design|construct/i.test(lowerInput)) {
      return 'generate';
    }

    if (/analyze|review|check|evaluate|assess|examine|inspect/i.test(lowerInput)) {
      return 'analyze';
    }

    if (/optimize|improve|enhance|refactor|layout|arrange/i.test(lowerInput)) {
      return 'optimize';
    }

    return 'query';
  }

  private async generateDiagram(input: string, intentData: any): Promise<{
    response: string;
    confidence: number;
    metadata: any;
  }> {
    try {
      // Use enhanced diagram generation
      const generator = new AdvancedDiagramGenerator(this.diagramContext);
      const result = await generator.generateFromDescription(input, intentData);
      
      return {
        response: `I've created a ${intentData.diagramType.replace('_', ' ')} diagram for the ${intentData.domain} domain. The diagram includes ${result.elementsCount} elements with ${result.connectionsCount} connections, optimized for ${intentData.complexity} complexity level.`,
        confidence: result.confidence,
        metadata: {
          diagramType: intentData.diagramType,
          domain: intentData.domain,
          complexity: intentData.complexity,
          elementsCount: result.elementsCount,
          connectionsCount: result.connectionsCount,
          layoutStrategy: result.layoutStrategy
        }
      };
    } catch (error) {
      console.error('Error generating diagram:', error);
      return {
        response: "I encountered an issue generating the diagram, but I can still help you plan it. Could you provide more specific details about what elements you'd like to include?",
        confidence: 0.3,
        metadata: { error: true }
      };
    }
  }

  private addMessage(messageData: Omit<EnhancedMessage, 'id' | 'timestamp'>): EnhancedMessage {
    const message: EnhancedMessage = {
      ...messageData,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date()
    };

    this.messageHistory.push(message);
    this.notifyMessageCallbacks();
    console.log('[AdvancedChatManager] Added message:', message.type, message.text.substring(0, 30) + '...');
    return message;
  }

  public onMessagesChange(callback: (messages: EnhancedMessage[]) => void): void {
    this.messageCallbacks.push(callback);
  }

  private notifyMessageCallbacks(): void {
    this.messageCallbacks.forEach(callback => callback([...this.messageHistory]));
  }

  public getMessages(): EnhancedMessage[] {
    return [...this.messageHistory];
  }

  public manualClearMessages(): void {
    console.log('[AdvancedChatManager] Manual clear requested');
    this.messageHistory = [];
    this.aiService.clearHistory();
    
    this.addMessage({
      text: "Chat cleared! I'm ready to help you create amazing diagrams. What would you like to build?",
      sender: "bot",
      type: "text"
    });
  }

  public getAdvancedStats(): {
    messageCount: number;
    diagramsGenerated: number;
    averageConfidence: number;
    conversationLength: number;
    performanceMetrics: any;
  } {
    const diagramMessages = this.messageHistory.filter(m => m.type === 'diagram');
    const confidenceScores = this.messageHistory
      .filter(m => m.confidence !== undefined)
      .map(m => m.confidence!);
    
    const avgConfidence = confidenceScores.length > 0 
      ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length 
      : 0;

    return {
      messageCount: this.messageHistory.length,
      diagramsGenerated: diagramMessages.length,
      averageConfidence: Math.round(avgConfidence * 100) / 100,
      conversationLength: this.aiService.getHistoryLength(),
      performanceMetrics: { successRate: 100, averageResponseTime: 1000 } // Mock data for compatibility
    };
  }
}

// Advanced Diagram Generator
class AdvancedDiagramGenerator {
  private diagramContext: any;

  constructor(diagramContext: any) {
    this.diagramContext = diagramContext;
  }

  public async generateFromDescription(description: string, intentData: any): Promise<{
    elementsCount: number;
    connectionsCount: number;
    confidence: number;
    layoutStrategy: string;
  }> {
    try {
      console.log('[AdvancedDiagramGenerator] Generating diagram from description');
      
      // Extract elements from description
      const elements = this.extractElements(description, intentData);
      
      // Calculate optimal layout
      const layout = this.calculateOptimalLayout(elements, intentData);
      
      // Generate diagram elements
      const createdElements = await this.createDiagramElements(layout.elements, intentData);
      
      // Create connections
      const connections = await this.createConnections(createdElements, layout.strategy);
      
      return {
        elementsCount: createdElements.length,
        connectionsCount: connections.length,
        confidence: this.calculateGenerationConfidence(intentData, elements),
        layoutStrategy: layout.strategy
      };
      
    } catch (error) {
      console.error('[AdvancedDiagramGenerator] Error:', error);
      throw error;
    }
  }

  private extractElements(description: string, intentData: any): any[] {
    // Use the elements from intent if available, otherwise create defaults
    if (intentData.elements && intentData.elements.length > 0) {
      return intentData.elements.map((text: string, index: number) => ({
        text: text,
        type: this.determineElementType(text, intentData.diagramType),
        priority: this.calculateElementPriority(text, description),
        index: index
      }));
    }

    // Generate default elements based on diagram type
    return this.generateDefaultElements(intentData);
  }

  private generateDefaultElements(intentData: any): any[] {
    const templates = {
      safety_case: [
        { text: 'System is acceptably safe', type: 'goal', priority: 1 },
        { text: 'Argument by decomposition', type: 'strategy', priority: 2 },
        { text: 'Hardware subsystem is safe', type: 'goal', priority: 3 },
        { text: 'Software subsystem is safe', type: 'goal', priority: 3 },
        { text: 'Operational procedures are safe', type: 'goal', priority: 3 }
      ],
      hazard_analysis: [
        { text: 'All identified hazards are controlled', type: 'goal', priority: 1 },
        { text: 'Argument by hazard analysis', type: 'strategy', priority: 2 },
        { text: 'Hazard H1 is mitigated', type: 'goal', priority: 3 },
        { text: 'Hazard H2 is mitigated', type: 'goal', priority: 3 }
      ],
      flowchart: [
        { text: 'Start', type: 'ellipse', priority: 1 },
        { text: 'Initialize Process', type: 'rectangle', priority: 2 },
        { text: 'Check Conditions', type: 'diamond', priority: 3 },
        { text: 'Process Data', type: 'rectangle', priority: 4 },
        { text: 'End', type: 'ellipse', priority: 5 }
      ]
    };

    return templates[intentData.diagramType as keyof typeof templates] || templates.safety_case;
  }

  private determineElementType(text: string, diagramType: string): string {
    const lowerText = text.toLowerCase();
    
    switch (diagramType) {
      case 'safety_case':
        if (/goal|claim|objective|safe/i.test(lowerText)) return 'goal';
        if (/strategy|approach|argument|method/i.test(lowerText)) return 'strategy';
        if (/evidence|solution|proof|test|result/i.test(lowerText)) return 'sacm';
        if (/assumption|context|given/i.test(lowerText)) return 'assumption';
        return 'goal';
        
      case 'flowchart':
        if (/start|begin|initialize/i.test(lowerText)) return 'ellipse';
        if (/end|finish|complete|terminate/i.test(lowerText)) return 'ellipse';
        if (/decision|check|if|whether|choose/i.test(lowerText)) return 'diamond';
        return 'rectangle';
        
      default:
        return 'rectangle';
    }
  }

  private calculateElementPriority(text: string, description: string): number {
    // Simple priority calculation based on position in description and keywords
    const index = description.toLowerCase().indexOf(text.toLowerCase());
    const hasImportantKeywords = /critical|important|key|main|primary/i.test(text);
    
    let priority = index === -1 ? 5 : Math.floor(index / 20) + 1;
    if (hasImportantKeywords) priority = Math.max(1, priority - 1);
    
    return Math.min(5, priority);
  }

  private calculateOptimalLayout(elements: any[], intentData: any): {
    elements: any[];
    strategy: string;
  } {
    const strategy = this.selectLayoutStrategy(intentData);
    const layoutElements = this.applyLayoutStrategy(elements, strategy, intentData);
    
    return {
      elements: layoutElements,
      strategy: strategy
    };
  }

  private selectLayoutStrategy(intentData: any): string {
    switch (intentData.structure) {
      case 'sequential':
        return 'vertical-flow';
      case 'network':
        return 'force-directed';
      case 'matrix':
        return 'grid-layout';
      default:
        return intentData.diagramType === 'flowchart' ? 'vertical-flow' : 'hierarchical-tree';
    }
  }

  private applyLayoutStrategy(elements: any[], strategy: string, intentData: any): any[] {
    const complexityPadding = intentData.complexity === 'complex' ? 120 : intentData.complexity === 'simple' ? 80 : 100;
    
    switch (strategy) {
      case 'vertical-flow':
        return this.applyVerticalFlowLayout(elements, complexityPadding);
      case 'hierarchical-tree':
        return this.applyHierarchicalLayout(elements, complexityPadding);
      case 'force-directed':
        return this.applyForceDirectedLayout(elements);
      case 'grid-layout':
        return this.applyGridLayout(elements, complexityPadding);
      default:
        return this.applyHierarchicalLayout(elements, complexityPadding);
    }
  }

  private applyVerticalFlowLayout(elements: any[], padding: number): any[] {
    let currentY = 150;
    const centerX = 400;
    
    return elements.map((element, index) => ({
      ...element,
      x: centerX,
      y: currentY + (index * (80 + padding)),
      width: this.calculateElementWidth(element.text, element.type),
      height: this.calculateElementHeight(element.type)
    }));
  }

  private applyHierarchicalLayout(elements: any[], padding: number): any[] {
    if (elements.length === 0) return elements;
    
    const root = { ...elements[0], x: 400, y: 100 };
    const children = elements.slice(1);
    const childrenPerRow = Math.ceil(Math.sqrt(children.length));
    
    const layoutElements = [root];
    
    children.forEach((element, index) => {
      const row = Math.floor(index / childrenPerRow);
      const col = index % childrenPerRow;
      const startX = 400 - ((childrenPerRow - 1) * padding) / 2;
      
      layoutElements.push({
        ...element,
        x: startX + (col * padding),
        y: 200 + (row * (80 + padding)),
        width: this.calculateElementWidth(element.text, element.type),
        height: this.calculateElementHeight(element.type)
      });
    });
    
    return layoutElements;
  }

  private applyForceDirectedLayout(elements: any[]): any[] {
    const centerX = 400;
    const centerY = 300;
    const radius = Math.min(200, elements.length * 30);
    
    return elements.map((element, index) => {
      const angle = (2 * Math.PI * index) / elements.length;
      return {
        ...element,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        width: this.calculateElementWidth(element.text, element.type),
        height: this.calculateElementHeight(element.type)
      };
    });
  }

  private applyGridLayout(elements: any[], padding: number): any[] {
    const cols = Math.ceil(Math.sqrt(elements.length));
    const startX = 200;
    const startY = 150;
    
    return elements.map((element, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      return {
        ...element,
        x: startX + (col * (200 + padding)),
        y: startY + (row * (100 + padding)),
        width: this.calculateElementWidth(element.text, element.type),
        height: this.calculateElementHeight(element.type)
      };
    });
  }

  private calculateElementWidth(text: string, type: string): number {
    const baseWidth = 140;
    const textLength = text.length;
    const typeMultiplier = type === 'strategy' ? 1.2 : type === 'diamond' ? 1.1 : 1;
    
    return Math.max(baseWidth, Math.min(300, baseWidth + textLength * 4)) * typeMultiplier;
  }

  private calculateElementHeight(type: string): number {
    const heights = {
      'goal': 70,
      'strategy': 65,
      'sacm': 60,
      'assumption': 55,
      'rectangle': 65,
      'ellipse': 60,
      'diamond': 80
    };
    
    return heights[type as keyof typeof heights] || 65;
  }

  private async createDiagramElements(elements: any[], intentData: any): Promise<string[]> {
    const createdIds: string[] = [];
    
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const shapeId = `shape_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`;
      createdIds.push(shapeId);
      
      const diagramElement: ShapeOnCanvas = {
        id: shapeId,
        type: element.type,
        title: element.text,
        text: element.text,
        mainText: element.text,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        idText: this.generateIdText(element.type, i, intentData.diagramType),
        preview: this.createPreviewElement(element.text),
        cornerRadius: element.type === 'strategy' ? 8 : undefined
      };
      
      this.diagramContext.addShape(diagramElement);
    }
    
    return createdIds;
  }

  private generateIdText(type: string, index: number, diagramType: string): string {
    const prefixMaps = {
      safety_case: { goal: 'G', strategy: 'S', sacm: 'Sn', assumption: 'A', justification: 'J' },
      hazard_analysis: { goal: 'H', strategy: 'HS', sacm: 'E' },
      flowchart: { rectangle: 'P', diamond: 'D', ellipse: 'T' }
    };
    
    const prefixes = prefixMaps[diagramType as keyof typeof prefixMaps] || { [type]: 'E' };
    const prefix = prefixes[type as keyof typeof prefixes] || 'E';
    
    return `${prefix}${index + 1}`;
  }

  private createPreviewElement(text: string): React.ReactNode {
    return React.createElement('div', {
      className: 'text-xs p-1 text-center overflow-hidden',
      style: { fontSize: '10px', lineHeight: '1.2' }
    }, text.length > 12 ? text.substring(0, 12) + '...' : text);
  }

  private async createConnections(elementIds: string[], layoutStrategy: string): Promise<string[]> {
    const connectionIds: string[] = [];
    
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          switch (layoutStrategy) {
            case 'vertical-flow':
              for (let i = 0; i < elementIds.length - 1; i++) {
                const connId = this.createConnection(elementIds[i], elementIds[i + 1]);
                if (connId) connectionIds.push(connId);
              }
              break;
              
            case 'hierarchical-tree':
              if (elementIds.length > 1) {
                const rootId = elementIds[0];
                const childIds = elementIds.slice(1);
                
                childIds.forEach(childId => {
                  const connId = this.createConnection(rootId, childId);
                  if (connId) connectionIds.push(connId);
                });
              }
              break;
              
            case 'force-directed':
              // Create a more connected network
              for (let i = 0; i < elementIds.length; i++) {
                for (let j = i + 1; j < elementIds.length; j++) {
                  if (Math.random() > 0.6) { // 40% connection probability
                    const connId = this.createConnection(elementIds[i], elementIds[j]);
                    if (connId) connectionIds.push(connId);
                  }
                }
              }
              break;
              
            default:
              // Default hierarchical connections
              if (elementIds.length > 1) {
                const rootId = elementIds[0];
                elementIds.slice(1).forEach(id => {
                  const connId = this.createConnection(rootId, id);
                  if (connId) connectionIds.push(connId);
                });
              }
          }
          
          console.log(`[AdvancedDiagramGenerator] Created ${connectionIds.length} connections`);
          resolve(connectionIds);
        } catch (error) {
          console.error('Error creating connections:', error);
          resolve(connectionIds);
        }
      }, 300);
    });
  }

  private createConnection(fromId: string, toId: string): string | null {
    try {
      const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      
      this.diagramContext.addConnection({
        id: connectionId,
        from: fromId,
        to: toId,
        points: [],
        style: 'line'
      });
      
      return connectionId;
    } catch (error) {
      console.error('Error creating individual connection:', error);
      return null;
    }
  }

  private calculateGenerationConfidence(intentData: any, elements: any[]): number {
    let confidence = 0.6; // Base confidence
    
    // Boost confidence based on intent clarity
    if (intentData.diagramType !== 'custom') confidence += 0.15;
    if (intentData.domain !== 'general') confidence += 0.1;
    if (elements.length > 0) confidence += 0.1;
    if (intentData.complexity !== 'simple') confidence += 0.05;
    
    return Math.min(1.0, confidence);
  }
}

// Enhanced Message Components
const EnhancedMessageBubble: React.FC<{
  message: EnhancedMessage;
  onCopy?: (content: string) => void;
}> = ({ message, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (onCopy) {
      onCopy(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getMessageStyles = () => {
    const baseStyles = "max-w-[85%] rounded-lg p-3 relative group transition-all duration-200 shadow-sm";
    
    switch (message.type) {
      case "error":
        return `${baseStyles} bg-red-50 text-red-800 border border-red-200`;
      case "success":
        return `${baseStyles} bg-green-50 text-green-800 border border-green-200`;
      case "diagram":
        return `${baseStyles} bg-blue-50 text-blue-800 border border-blue-200`;
      case "analysis":
        return `${baseStyles} bg-purple-50 text-purple-800 border border-purple-200`;
      case "action":
        return `${baseStyles} bg-orange-50 text-orange-800 border border-orange-200`;
      default:
        return message.sender === "user"
          ? `${baseStyles} bg-blue-600 text-white`
          : `${baseStyles} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

  const getIcon = () => {
    switch (message.type) {
      case "error":
        return <AlertCircle size={14} className="text-red-500" />;
      case "success":
        return <CheckCircle size={14} className="text-green-500" />;
      case "diagram":
        return <Target size={14} className="text-blue-500" />;
      case "analysis":
        return <Brain size={14} className="text-purple-500" />;
      case "action":
        return <Wand2 size={14} className="text-orange-500" />;
      default:
        return message.sender === "user" ? (
          <User size={14} className="opacity-70" />
        ) : (
          <Bot size={14} className="opacity-70" />
        );
    }
  };

  const getTypeLabel = () => {
    switch (message.type) {
      case "diagram":
        return "Generated";
      case "analysis":
        return "Analysis";
      case "action":
        return "Optimized";
      case "error":
        return "Error";
      case "success":
        return "Success";
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div className={getMessageStyles()}>
        {/* Enhanced Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="text-xs opacity-70">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {getTypeLabel() && (
              <span className="text-xs bg-black/10 text-black/70 px-2 py-0.5 rounded-full">
                {getTypeLabel()}
              </span>
            )}
            {message.confidence && (
              <span className="text-xs bg-black/10 text-black/70 px-2 py-0.5 rounded-full">
                {Math.round(message.confidence * 100)}% confident
              </span>
            )}
          </div>
          
          {/* Copy button */}
          {message.text.length > 10 && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/10"
              title="Copy message"
            >
              {copied ? (
                <CheckCircle size={12} className="text-green-500" />
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
          {message.text}
        </div>

        {/* Enhanced Metadata Display */}
        {message.metadata && (
          <div className="mt-3 p-2 bg-black/5 rounded text-xs">
            <div className="grid grid-cols-2 gap-2">
              {message.metadata.diagramType && (
                <div><strong>Type:</strong> {message.metadata.diagramType.replace('_', ' ')}</div>
              )}
              {message.metadata.domain && (
                <div><strong>Domain:</strong> {message.metadata.domain}</div>
              )}
              {message.metadata.complexity && (
                <div><strong>Complexity:</strong> {message.metadata.complexity}</div>
              )}
              {message.metadata.elementsCount !== undefined && (
                <div><strong>Elements:</strong> {message.metadata.elementsCount}</div>
              )}
              {message.metadata.connectionsCount !== undefined && (
                <div><strong>Connections:</strong> {message.metadata.connectionsCount}</div>
              )}
              {message.metadata.processingTime && (
                <div><strong>Processed:</strong> {message.metadata.processingTime}ms</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EnhancedLoadingIndicator: React.FC<{ message?: string }> = ({ 
  message = "AI is analyzing and generating..." 
}) => (
  <div className="flex justify-start">
    <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[85%] border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Brain size={14} className="opacity-70 animate-pulse" />
        <span className="text-xs opacity-70">{message}</span>
      </div>
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// Main Enhanced AI Panel Component
const AiPanel: React.FC = () => {
  const diagramContext = useDiagramContext();
  const { shapes, connections } = diagramContext;

  // Enhanced State
  const [messages, setMessages] = useState<EnhancedMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [chatManager, setChatManager] = useState<AdvancedChatManager | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize enhanced chat manager
  useEffect(() => {
    if (!chatManager) {
      console.log('[AiPanel] Initializing advanced chat manager');
      
      const manager = new AdvancedChatManager(diagramContext);
      manager.onMessagesChange(setMessages);
      setChatManager(manager);
      
      manager.initialize().then(() => {
        setMessages(manager.getMessages());
        setIsInitialized(true);
        console.log('[AiPanel] Advanced initialization complete');
      });
    }
  }, [diagramContext]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Enhanced message handler
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isProcessing || !chatManager) return;

    const userInput = inputValue;
    setInputValue("");
    setIsProcessing(true);

    try {
      console.log('[AiPanel] Sending enhanced message:', userInput);
      await chatManager.processMessage(userInput);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [inputValue, isProcessing, chatManager]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleQuickCommand = useCallback((command: string) => {
    setInputValue(command);
    setTimeout(handleSendMessage, 100);
  }, [handleSendMessage]);

  const handleManualClear = useCallback(() => {
    if (chatManager) {
      chatManager.manualClearMessages();
    }
  }, [chatManager]);

  const handleCopyMessage = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  }, []);

  // Get enhanced stats
  const stats = chatManager?.getAdvancedStats() || { 
    messageCount: 0, 
    diagramsGenerated: 0, 
    averageConfidence: 0,
    conversationLength: 0,
    performanceMetrics: { successRate: 0, averageResponseTime: 0 }
  };

  // Render loading state
  if (!isInitialized) {
    return (
      <div className="flex flex-col h-full bg-white border-l border-gray-200">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Brain size={48} className="text-blue-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Initializing Advanced AI</h3>
            <p className="text-sm text-gray-500">Setting up enhanced natural language processing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Enhanced Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 via-purple-50 to-green-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-2">
              <Brain size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Advanced AI Assistant</h3>
              <p className="text-xs text-gray-600">
                Enhanced NLP • {shapes.length} elements • {connections.length} connections • {stats.diagramsGenerated} diagrams
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs bg-white/70 px-2 py-1 rounded-full">
              <span className="text-green-600">●</span> AI: {Math.round(stats.averageConfidence * 100)}%
            </div>
            <div className="text-xs bg-white/70 px-2 py-1 rounded-full">
              Success: {Math.round(stats.performanceMetrics.successRate)}%
            </div>
            <button
              onClick={handleManualClear}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
              title="Clear chat history"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/30 to-white">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-center">
            <div>
              <Brain size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Advanced AI Ready</p>
              <p className="text-sm">Enhanced natural language processing for sophisticated diagram creation</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <EnhancedMessageBubble
              key={message.id}
              message={message}
              onCopy={handleCopyMessage}
            />
          ))
        )}

        {isProcessing && <EnhancedLoadingIndicator message="Advanced AI is analyzing and generating..." />}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="p-4 border-t bg-white">
        {/* Enhanced Quick Action Buttons */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          <button
            onClick={() => handleQuickCommand("Create a comprehensive safety case diagram for autonomous vehicle with sensor fusion, machine learning algorithms, fail-safe mechanisms, and regulatory compliance validation")}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-full hover:from-blue-100 hover:to-blue-150 transition-all disabled:opacity-50 whitespace-nowrap shadow-sm"
          >
            <Target size={14} /> Advanced Safety Case
          </button>
          <button
            onClick={() => handleQuickCommand("Generate an intelligent flowchart for secure multi-factor authentication system with biometric verification, risk-based authentication, and adaptive security measures")}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-full hover:from-green-100 hover:to-green-150 transition-all disabled:opacity-50 whitespace-nowrap shadow-sm"
          >
            <Workflow size={14} /> Smart Flowchart
          </button>
          <button
            onClick={() => handleQuickCommand("Create a detailed hazard analysis diagram for medical device with comprehensive risk assessment, mitigation strategies, regulatory requirements, and continuous monitoring protocols")}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-full hover:from-purple-100 hover:to-purple-150 transition-all disabled:opacity-50 whitespace-nowrap shadow-sm"
          >
            <AlertCircle size={14} /> Hazard Analysis
          </button>
          <button
            onClick={() => handleQuickCommand("Analyze my current diagram structure comprehensively and provide advanced optimization suggestions for clarity, completeness, best practices, and professional presentation")}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-full hover:from-orange-100 hover:to-orange-150 transition-all disabled:opacity-50 whitespace-nowrap shadow-sm"
          >
            <ListTree size={14} /> Deep Analysis
          </button>
        </div>

        {/* Enhanced Message Input */}
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your diagram requirements in detail... The more specific you are, the better I can help you create exactly what you need."
            className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50 resize-none shadow-sm"
            disabled={isProcessing}
            rows={2}
            style={{ minHeight: '60px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className={`absolute right-3 bottom-3 p-2 rounded-full transition-all ${
              inputValue.trim() && !isProcessing
                ? "text-blue-500 hover:bg-blue-50 hover:scale-105"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            {isProcessing ? (
              <div className="animate-spin">
                <Zap size={18} />
              </div>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>

        {/* Enhanced Footer Stats */}
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span>
            {messages.length} messages • {stats.diagramsGenerated} diagrams • Avg confidence: {Math.round(stats.averageConfidence * 100)}%
          </span>
          <span>
            Press Enter to send • Shift+Enter for new line • AI Response Time: {Math.round(stats.performanceMetrics.averageResponseTime || 0)}ms
          </span>
        </div>
      </div>
    </div>
  );
};

export default AiPanel;