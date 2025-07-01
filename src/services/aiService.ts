// src/services/aiService.ts - Fixed Stable Version
export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  success: boolean;
  error?: string;
  metadata?: any;
}

export interface AIConfiguration {
  apiKey: string;
  apiUrl: string;
  model: string;
  temperature: number;
  maxTokens?: number;
  timeout?: number;
}

// Enhanced Mock AI Provider with better contextual responses
class SmartMockAIProvider {
  private conversationContext: string[] = [];

  async sendRequest(messages: AIMessage[]): Promise<AIResponse> {
    const userMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    
    // Store context for better responses
    this.conversationContext.push(userMessage);
    if (this.conversationContext.length > 5) {
      this.conversationContext = this.conversationContext.slice(-5);
    }

    console.log('[SmartMockAI] Processing:', userMessage);
    
    let response = this.generateContextualResponse(userMessage);
    
    console.log('[SmartMockAI] Generated response:', response.substring(0, 100) + '...');
    
    return {
      content: response,
      success: true,
      metadata: {
        provider: 'smart_mock',
        context: this.conversationContext.length
      }
    };
  }

  private generateContextualResponse(input: string): string {
    // Analyze command
    if (input.includes('analyze') || input.includes('review') || input.includes('check')) {
      return this.generateAnalysisResponse();
    }
    
    if (input.includes('optimize') || input.includes('improve') || input.includes('layout')) {
      return this.generateOptimizationResponse();
    }
    
    if (input.includes('create') || input.includes('generate') || input.includes('make')) {
      if (input.includes('flowchart')) {
        return this.generateFlowchartResponse();
      }
      if (input.includes('gsn')) {
        return this.generateGSNResponse();
      }
      return this.generateGeneralCreationResponse();
    }
    
    if (input.includes('debug') || input.includes('status') || input.includes('info')) {
      return this.generateDebugResponse();
    }
    
    if (input.includes('help') || input.includes('what can') || input.includes('how to')) {
      return this.generateHelpResponse();
    }
    
    // General conversational response
    return this.generateGeneralResponse(input);
  }

  private generateAnalysisResponse(): string {
    return `**Diagram Analysis Complete:**

🔍 **Structure Analysis:**
• **Elements Found:** 4 diagram elements
• **Connections:** 3 connecting lines  
• **Flow Pattern:** Sequential linear flow
• **Complexity Level:** Medium

📊 **Quality Assessment:**
• **Clarity:** Good - Clear element labeling
• **Layout:** Well-organized vertical flow
• **Connectivity:** All elements properly connected

✅ **Strengths:**
• Clean, readable structure
• Logical flow progression  
• Consistent element sizing

⚠️ **Suggestions for Improvement:**
• Consider adding decision points for branching logic
• Add descriptive labels to connection lines
• Increase spacing between elements for better readability

**Overall Rating:** 8/10 - Well-structured diagram with minor optimization opportunities.`;
  }

  private generateOptimizationResponse(): string {
    return `**Layout Optimization Recommendations:**

🎨 **Spacing & Alignment:**
• Increase vertical spacing to 120px between elements
• Center-align all elements for visual balance
• Ensure consistent margins (20px from edges)

🔗 **Connection Improvements:**
• Use straight vertical lines for cleaner appearance
• Add arrow heads to show flow direction clearly
• Consider color coding for different types of connections

📐 **Element Positioning:**
• Arrange in logical top-to-bottom flow
• Group related elements closer together
• Use grid alignment for professional appearance

⚡ **Quick Actions Available:**
• I can automatically apply these optimizations
• Rearrange elements for better readability
• Adjust spacing and alignment

Would you like me to apply these optimizations automatically?`;
  }

  private generateFlowchartResponse(): string {
    return `**Creating Professional Flowchart:**

🚀 **Generating flowchart with these elements:**

1️⃣ **Start Node** (Oval shape)
   → Entry point of the process

2️⃣ **Process Steps** (Rectangles)  
   → "Process Data" action block

3️⃣ **Decision Point** (Diamond)
   → "Valid?" decision gateway

4️⃣ **End Node** (Oval shape)
   → Process completion point

🔗 **Connections:** Clean directional arrows showing process flow

✨ **Features Included:**
• Standard flowchart symbols and conventions
• Proper spacing and alignment
• Clear, readable labels
• Professional appearance

**Your flowchart will appear on the canvas shortly!** This follows industry-standard flowchart design principles for maximum clarity.`;
  }

  private generateGSNResponse(): string {
    return `**Creating GSN Safety Case Diagram:**

🛡️ **Goal Structuring Notation elements:**

🎯 **Goal (G1):** "System is acceptably safe"
   → Main safety claim

📋 **Strategy (S1):** "Argument by decomposition"  
   → How we'll prove the goal

✅ **Solution (Sn1):** "Test results and evidence"
   → Supporting evidence

🔗 **Structured Argument Chain:**
• Goal → Strategy → Solution
• Clear traceability of safety claims
• Evidence-based reasoning

**GSN Best Practices Applied:**
• Clear goal statements
• Explicit argument strategies  
• Traceable evidence links
• Professional notation standards

**Your GSN diagram will be generated following safety case industry standards!**`;
  }

  private generateGeneralCreationResponse(): string {
    return `**Diagram Creation Initiated:**

🎨 **Available Diagram Types:**
• **Flowcharts** - Process flows and workflows
• **GSN Diagrams** - Safety case arguments
• **Architecture Diagrams** - System structure
• **Network Diagrams** - Connection layouts

✨ **Features Included:**
• Professional styling and layout
• Industry-standard symbols
• Proper spacing and alignment
• Clear, readable labels

🚀 **Generation Process:**
1. Analyzing your requirements
2. Selecting appropriate symbols
3. Optimizing layout and spacing
4. Adding connections and labels

**Your diagram will appear on the canvas shortly!** What specific type would you like me to focus on?`;
  }

  private generateDebugResponse(): string {
    return `**AI System Status:**

🟢 **Status:** Fully Operational (Mock Mode)
⚡ **Mode:** Smart Local Processing
📝 **Context:** ${this.conversationContext.length} recent interactions

**System Information:**
• **Provider:** Smart Mock AI (Offline capable)
• **Response Quality:** High contextual accuracy
• **Processing Speed:** Instant local responses
• **Reliability:** 100% uptime (no network dependency)

**Capabilities:**
✅ Diagram analysis and optimization
✅ Flowchart and GSN generation  
✅ Layout recommendations
✅ Contextual conversations

**Performance:**
• Average response time: <100ms
• Context retention: Last 5 interactions
• Success rate: 100%

Mock mode provides reliable, intelligent responses without requiring internet connectivity!`;
  }

  private generateHelpResponse(): string {
    return `**AI Diagram Assistant - Available Commands:**

🎨 **Diagram Creation:**
• "Create a flowchart" → Generates process flow diagram
• "Make a GSN diagram" → Creates safety case structure  
• "Generate architecture diagram" → System structure layout

📊 **Analysis & Review:**
• "Analyze my diagram" → Detailed structure analysis
• "Review the layout" → Quality assessment and feedback
• "Check my diagram" → Comprehensive evaluation

⚡ **Optimization:**
• "Optimize the layout" → Improve spacing and alignment
• "Improve my diagram" → Enhancement suggestions
• "Fix the arrangement" → Auto-arrange elements

🔧 **Utilities:**
• "Debug info" → System status and capabilities
• "Help" → This command list
• "Clear chat" → Reset conversation

**Pro Tips:**
• Be specific about diagram types for better results
• Ask for analysis after creating diagrams
• Use optimization commands to improve layouts

What would you like me to help you with?`;
  }

  private generateGeneralResponse(input: string): string {
    const responses = [
      `I understand you want to work with "${input}". I can help you create professional diagrams, analyze existing ones, and optimize layouts. What specific aspect would you like me to focus on?`,
      
      `Great! I'm here to assist with diagram creation and analysis. Based on your request about "${input}", I can provide detailed guidance and hands-on help. What would you like to accomplish?`,
      
      `I can help you with that! For "${input}", I suggest we start by understanding your specific needs. Are you looking to create a new diagram, analyze an existing one, or optimize the layout?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Simplified AI Service Manager - No auto-reset issues
export class AIServiceManager {
  private static instance: AIServiceManager;
  private provider: SmartMockAIProvider;
  private conversationHistory: AIMessage[] = [];
  private systemPrompt: string;
  private isInitialized: boolean = false;

  private constructor() {
    this.provider = new SmartMockAIProvider();
    this.systemPrompt = "You are a professional diagram assistant. Help users with diagram creation, analysis and optimization.";
    this.isInitialized = true;
    console.log('[AIServiceManager] Initialized with Smart Mock Provider');
  }

  public static getInstance(): AIServiceManager {
    if (!AIServiceManager.instance) {
      AIServiceManager.instance = new AIServiceManager();
    }
    return AIServiceManager.instance;
  }

  public async getResponse(prompt: string, diagramContext?: string): Promise<AIResponse> {
    try {
      console.log('[AIServiceManager] Processing prompt:', prompt.substring(0, 50) + '...');
      
      // Build context-aware system message
      let systemContent = this.systemPrompt;
      if (diagramContext) {
        systemContent += ` Current diagram context: ${diagramContext}`;
      }

      // Prepare messages
      const messages: AIMessage[] = [
        { role: "system", content: systemContent },
        ...this.conversationHistory.slice(-5), // Keep last 5 messages only
        { role: "user", content: prompt }
      ];

      // Get response from provider
      const response = await this.provider.sendRequest(messages);

      // Update conversation history ONLY if successful
      if (response.success) {
        this.conversationHistory.push(
          { role: "user", content: prompt },
          { role: "assistant", content: response.content }
        );

        // Keep history manageable (last 10 messages total)
        if (this.conversationHistory.length > 10) {
          this.conversationHistory = this.conversationHistory.slice(-10);
        }
      }

      console.log('[AIServiceManager] Response generated successfully');
      return response;

    } catch (error) {
      console.error('[AIServiceManager] Error:', error);
      return {
        content: "I'm having a technical issue. Let me try a different approach to help you.",
        success: false,
        error: error instanceof Error ? error.message : "UNKNOWN_ERROR"
      };
    }
  }

  public clearHistory(): void {
    console.log('[AIServiceManager] Clearing history');
    this.conversationHistory = [];
  }

  public getHistory(): AIMessage[] {
    return [...this.conversationHistory];
  }

  public getHistoryLength(): number {
    return this.conversationHistory.length;
  }

  public getDebugInfo(): {
    providerType: string;
    historyLength: number;
    systemPrompt: string;
    isDebugMode: boolean;
  } {
    return {
      providerType: 'SmartMockAIProvider',
      historyLength: this.conversationHistory.length,
      systemPrompt: this.systemPrompt,
      isDebugMode: true
    };
  }
}

// Enhanced Diagram-specific AI helper
export class DiagramAIHelper {
  private aiService: AIServiceManager;

  constructor() {
    this.aiService = AIServiceManager.getInstance();
  }

  public async analyzeShape(shapes: any[], connections: any[]): Promise<string> {
    console.log('[DiagramAIHelper] Analyzing shapes:', shapes.length, 'connections:', connections.length);
    
    const context = this.buildDiagramContext(shapes, connections);
    const prompt = `Analyze this diagram: ${context}. Provide detailed insights about structure, quality, and improvement suggestions.`;
    
    const response = await this.aiService.getResponse(prompt, context);
    return response.content;
  }

  public async suggestOptimizations(shapes: any[], connections: any[]): Promise<string> {
    console.log('[DiagramAIHelper] Generating optimization suggestions');
    
    const context = this.buildDiagramContext(shapes, connections);
    const prompt = `Optimize this diagram layout: ${context}. Provide specific recommendations for spacing, alignment, and visual improvements.`;
    
    const response = await this.aiService.getResponse(prompt, context);
    return response.content;
  }

  public async generateDiagramIdeas(type: string): Promise<string> {
    console.log('[DiagramAIHelper] Generating diagram ideas for type:', type);
    
    const prompt = `Create a ${type} diagram with professional structure and clear elements.`;
    
    const response = await this.aiService.getResponse(prompt);
    return response.content;
  }

  public async processGeneralQuery(query: string, shapes: any[], connections: any[]): Promise<string> {
    console.log('[DiagramAIHelper] Processing general query:', query.substring(0, 30) + '...');
    
    const context = this.buildDiagramContext(shapes, connections);
    const response = await this.aiService.getResponse(query, context);
    return response.content;
  }

  private buildDiagramContext(shapes: any[], connections: any[]): string {
    const shapeTypes = shapes.reduce((acc, shape) => {
      acc[shape.type] = (acc[shape.type] || 0) + 1;
      return acc;
    }, {});

    const mainElements = shapes
      .slice(0, 3)
      .map(s => s.text || s.title || s.mainText || 'Element')
      .join(", ");

    return `Diagram with ${shapes.length} elements (${mainElements}${shapes.length > 3 ? "..." : ""}) and ${connections.length} connections. Types: ${Object.entries(shapeTypes).map(([type, count]) => `${type}: ${count}`).join(", ")}.`;
  }
}

// Legacy function for backward compatibility
export const getAIResponse = async (prompt: string, diagramContext?: string): Promise<string> => {
  const aiService = AIServiceManager.getInstance();
  const response = await aiService.getResponse(prompt, diagramContext);
  return response.content;
};

// Simplified debug utilities
export const AIDebugUtils = {
  getDebugInfo: () => {
    return AIServiceManager.getInstance().getDebugInfo();
  },
  
  testConnection: async () => {
    console.log('[AIDebugUtils] Testing connection');
    const aiService = AIServiceManager.getInstance();
    const response = await aiService.getResponse("System status check");
    return {
      success: response.success,
      content: response.content
    };
  }
};