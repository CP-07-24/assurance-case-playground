// src/services/aiService.ts
export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  success: boolean;
  error?: string;
  metadata?: any;
  confidence?: number;
  intent?: ParsedIntent;
}

export interface ParsedIntent {
  diagramType: string;
  domain: string;
  elements: string[];
  structure: string;
  complexity: string;
  specialRequirements: string[];
}

export interface AIConfiguration {
  apiKey: string;
  apiUrl: string;
  model: string;
  temperature: number;
  maxTokens?: number;
  timeout?: number;
}

// Enhanced AI Intelligence Processor
class AIIntelligenceProcessor {
  private domainKeywords: Map<string, string[]> = new Map();
  private diagramPatterns: Map<string, RegExp[]> = new Map();

  constructor() {
    this.initializeDomainKeywords();
    this.initializeDiagramPatterns();
  }

  private initializeDomainKeywords(): void {
    this.domainKeywords = new Map([
      ['automotive', ['vehicle', 'car', 'automotive', 'driving', 'autonomous', 'adas', 'brake', 'engine', 'transmission']],
      ['aviation', ['aircraft', 'aviation', 'flight', 'pilot', 'air traffic', 'runway', 'navigation', 'radar']],
      ['medical', ['medical', 'healthcare', 'patient', 'clinical', 'hospital', 'device', 'therapy', 'diagnosis']],
      ['software', ['software', 'code', 'program', 'system', 'application', 'api', 'database', 'server']],
      ['industrial', ['factory', 'manufacturing', 'production', 'industrial', 'machine', 'assembly', 'quality']],
      ['nuclear', ['nuclear', 'reactor', 'radiation', 'isotope', 'power plant', 'containment', 'safety']],
      ['railway', ['train', 'railway', 'railroad', 'locomotive', 'track', 'signaling', 'station']],
      ['marine', ['ship', 'vessel', 'maritime', 'navigation', 'port', 'cargo', 'offshore']],
      ['aerospace', ['satellite', 'spacecraft', 'rocket', 'space', 'orbital', 'mission', 'payload']]
    ]);
  }

  private initializeDiagramPatterns(): void {
    this.diagramPatterns = new Map([
      ['safety_case', [
        /safety\s+case/i,
        /gsn/i,
        /goal\s+structuring/i,
        /assurance\s+case/i,
        /argument\s+structure/i
      ]],
      ['hazard_analysis', [
        /hazard/i,
        /risk\s+analysis/i,
        /fmea/i,
        /fault\s+tree/i,
        /threat\s+model/i,
        /risk\s+assessment/i
      ]],
      ['flowchart', [
        /flowchart/i,
        /flow\s+diagram/i,
        /process\s+flow/i,
        /workflow/i,
        /process\s+map/i
      ]],
      ['sequence_diagram', [
        /sequence/i,
        /interaction/i,
        /message\s+flow/i,
        /timeline/i,
        /communication/i
      ]],
      ['architecture_diagram', [
        /architecture/i,
        /system\s+design/i,
        /component/i,
        /module/i,
        /deployment/i
      ]],
      ['network_diagram', [
        /network/i,
        /topology/i,
        /infrastructure/i,
        /connectivity/i
      ]]
    ]);
  }

  public analyzePrompt(prompt: string): ParsedIntent {
    const lowerPrompt = prompt.toLowerCase();
    
    return {
      diagramType: this.detectDiagramType(lowerPrompt),
      domain: this.detectDomain(lowerPrompt),
      elements: this.extractElements(prompt),
      structure: this.detectStructure(lowerPrompt),
      complexity: this.detectComplexity(lowerPrompt),
      specialRequirements: this.extractSpecialRequirements(lowerPrompt)
    };
  }

  private detectDiagramType(prompt: string): string {
    for (const [type, patterns] of this.diagramPatterns) {
      for (const pattern of patterns) {
        if (pattern.test(prompt)) {
          return type;
        }
      }
    }
    
    // Secondary detection based on keywords
    if (/goal|claim|evidence|strategy/i.test(prompt)) return 'safety_case';
    if (/step|process|decision|start|end/i.test(prompt)) return 'flowchart';
    if (/component|module|service/i.test(prompt)) return 'architecture_diagram';
    
    return 'custom';
  }

  private detectDomain(prompt: string): string {
    let bestMatch = 'general';
    let maxMatches = 0;
    
    for (const [domain, keywords] of this.domainKeywords) {
      const matches = keywords.filter(keyword => prompt.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = domain;
      }
    }
    
    return bestMatch;
  }

  private extractElements(prompt: string): string[] {
    const elements: string[] = [];
    
    // Extract quoted strings
    const quotedMatches = prompt.match(/"([^"]+)"/g);
    if (quotedMatches) {
      elements.push(...quotedMatches.map(match => match.slice(1, -1)));
    }
    
    // Extract numbered items
    const numberedMatches = prompt.match(/\d+\.\s*([^\n\.]+)/g);
    if (numberedMatches) {
      elements.push(...numberedMatches.map(match => match.replace(/^\d+\.\s*/, '').trim()));
    }
    
    // Extract bulleted items
    const bulletMatches = prompt.match(/[-*•]\s*([^\n\-\*•]+)/g);
    if (bulletMatches) {
      elements.push(...bulletMatches.map(match => match.replace(/^[-*•]\s*/, '').trim()));
    }
    
    // Extract with keywords
    const withMatches = prompt.match(/with\s+([^,\.\n]+)/gi);
    if (withMatches) {
      elements.push(...withMatches.map(match => match.replace(/^with\s+/i, '').trim()));
    }
    
    return [...new Set(elements)]; // Remove duplicates
  }

  private detectStructure(prompt: string): string {
    if (/tree|hierarchy|parent|child|level|top.down/i.test(prompt)) return 'hierarchical';
    if (/sequence|step|flow|process|order|timeline/i.test(prompt)) return 'sequential';
    if (/network|mesh|interconnect|web|distributed/i.test(prompt)) return 'network';
    if (/matrix|grid|table|compare|cross.reference/i.test(prompt)) return 'matrix';
    if (/circular|cycle|loop|round/i.test(prompt)) return 'circular';
    
    return 'hierarchical'; // default
  }

  private detectComplexity(prompt: string): string {
    // Simple indicators
    if (/simple|basic|quick|minimal|overview|brief/i.test(prompt)) return 'simple';
    
    // Complex indicators
    if (/complex|advanced|detailed|comprehensive|extensive|elaborate|thorough/i.test(prompt)) return 'complex';
    
    // Medium indicators
    if (/complete|full|standard|normal|typical/i.test(prompt)) return 'medium';
    
    // Analyze by content length and element count
    const elements = this.extractElements(prompt);
    if (elements.length > 8) return 'complex';
    if (elements.length > 4) return 'medium';
    if (prompt.length > 200) return 'medium';
    
    return 'simple';
  }

  private extractSpecialRequirements(prompt: string): string[] {
    const requirements: string[] = [];
    
    if (/color|highlight|emphasis|visual/i.test(prompt)) requirements.push('styling');
    if (/layout|position|arrange|organize/i.test(prompt)) requirements.push('layout');
    if (/connect|link|relation|associate/i.test(prompt)) requirements.push('connections');
    if (/label|text|description|annotation/i.test(prompt)) requirements.push('labeling');
    if (/animate|dynamic|interactive/i.test(prompt)) requirements.push('animation');
    if (/export|save|format/i.test(prompt)) requirements.push('export');
    
    return requirements;
  }

  public classifyIntent(prompt: string): 'generate' | 'analyze' | 'modify' | 'query' {
    const lowerPrompt = prompt.toLowerCase();
    
    if (/create|generate|make|build|draw|design|construct/i.test(lowerPrompt)) {
      return 'generate';
    }
    
    if (/analyze|review|check|evaluate|assess|examine|inspect/i.test(lowerPrompt)) {
      return 'analyze';
    }
    
    if (/modify|change|update|edit|improve|optimize|refactor/i.test(lowerPrompt)) {
      return 'modify';
    }
    
    return 'query';
  }
}

// Abstract base class for AI providers
abstract class BaseAIProvider {
  protected config: AIConfiguration;

  constructor(config: AIConfiguration) {
    this.config = config;
  }

  abstract sendRequest(messages: AIMessage[]): Promise<AIResponse>;
  abstract validateConfig(): boolean;
}

// Enhanced OpenAI-compatible provider
class EnhancedOpenAIProvider extends BaseAIProvider {
  private intelligenceProcessor: AIIntelligenceProcessor;
  private responseCache: Map<string, AIResponse>;

  constructor(config: AIConfiguration) {
    super(config);
    if (!this.validateConfig()) {
      throw new Error("Invalid AI configuration");
    }
    this.intelligenceProcessor = new AIIntelligenceProcessor();
    this.responseCache = new Map();
  }

  validateConfig(): boolean {
    return !!(this.config.apiKey && this.config.apiUrl && this.config.model);
  }

  async sendRequest(messages: AIMessage[]): Promise<AIResponse> {
    try {
      const lastMessage = messages[messages.length - 1];
      const cacheKey = this.generateCacheKey(lastMessage.content);
      
      // Check cache first
      if (this.responseCache.has(cacheKey)) {
        const cached = this.responseCache.get(cacheKey)!;
        return { ...cached, metadata: { ...cached.metadata, fromCache: true } };
      }

      // Analyze the prompt for intent
      const intentData = this.intelligenceProcessor.analyzePrompt(lastMessage.content);
      
      // Enhanced system prompt based on intent
      const enhancedMessages = this.enhanceMessages(messages, intentData);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout || 30000);

      const response = await fetch(this.config.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: enhancedMessages,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const result: AIResponse = {
        content: data.choices[0]?.message?.content || "I couldn't process that request.",
        success: true,
        confidence: this.calculateConfidence(intentData, data),
        intent: intentData,
        metadata: {
          model: data.model,
          usage: data.usage,
          processingTime: Date.now(),
          intentAnalysis: intentData
        }
      };

      // Cache the response
      this.responseCache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error("Enhanced AI API Error:", error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            content: "Request timed out. Please try again with a simpler request.",
            success: false,
            confidence: 0,
            error: "TIMEOUT"
          };
        }
        
        return {
          content: "I encountered an error processing your request. Please try rephrasing it.",
          success: false,
          confidence: 0,
          error: error.message
        };
      }
      
      return {
        content: "An unknown error occurred. Please try again.",
        success: false,
        confidence: 0,
        error: "UNKNOWN_ERROR"
      };
    }
  }

  private generateCacheKey(content: string): string {
    return btoa(content.toLowerCase().trim()).substring(0, 32);
  }

  private enhanceMessages(messages: AIMessage[], intentData: ParsedIntent): AIMessage[] {
    const systemPrompt = this.generateSystemPrompt(intentData);
    
    return [
      { role: "system", content: systemPrompt },
      ...messages.slice(-8) // Keep last 8 messages for context
    ];
  }

  private generateSystemPrompt(intentData: ParsedIntent): string {
    let prompt = "You are an advanced diagram assistant with expertise in ";
    
    switch (intentData.diagramType) {
      case 'safety_case':
        prompt += "Goal Structuring Notation (GSN) and safety assurance cases. ";
        break;
      case 'hazard_analysis':
        prompt += "hazard analysis, risk assessment, and FMEA methodologies. ";
        break;
      case 'flowchart':
        prompt += "process modeling and workflow design. ";
        break;
      case 'architecture_diagram':
        prompt += "system architecture and component design. ";
        break;
      default:
        prompt += "various diagram types and modeling techniques. ";
    }
    
    prompt += `You specialize in the ${intentData.domain} domain. `;
    prompt += `Provide ${intentData.complexity} level responses. `;
    prompt += "Always be specific, actionable, and professional in your guidance.";
    
    return prompt;
  }

  private calculateConfidence(intentData: ParsedIntent, apiResponse: any): number {
    let confidence = 0.5; // Base confidence
    
    // Boost confidence based on intent clarity
    if (intentData.diagramType !== 'custom') confidence += 0.2;
    if (intentData.domain !== 'general') confidence += 0.1;
    if (intentData.elements.length > 0) confidence += 0.2;
    
    // Adjust based on API response quality
    if (apiResponse.choices?.[0]?.finish_reason === 'stop') confidence += 0.1;
    
    return Math.min(1.0, confidence);
  }
}

// Enhanced AI Service Manager with advanced capabilities
export class AIServiceManager {
  private static instance: AIServiceManager;
  private provider: BaseAIProvider;
  private conversationHistory: AIMessage[] = [];
  private intelligenceProcessor: AIIntelligenceProcessor;
  private performanceMetrics: PerformanceMetrics;

  private constructor() {
    // Enhanced default configuration
    const defaultConfig: AIConfiguration = {
      apiKey: "sk-iMvFMAyg1AJSCKpScqsMvbp6svIs0s1f5sn9wu7h6gze946k",
      apiUrl: "https://api.chatanywhere.org/v1/chat/completions",
      model: "deepseek-v3",
      temperature: 0.7,
      maxTokens: 1500,
      timeout: 45000
    };

    this.provider = new EnhancedOpenAIProvider(defaultConfig);
    this.intelligenceProcessor = new AIIntelligenceProcessor();
    this.performanceMetrics = new PerformanceMetrics();
  }

  public static getInstance(): AIServiceManager {
    if (!AIServiceManager.instance) {
      AIServiceManager.instance = new AIServiceManager();
    }
    return AIServiceManager.instance;
  }

  public setProvider(provider: BaseAIProvider): void {
    this.provider = provider;
  }

  public updateConfiguration(config: Partial<AIConfiguration>): void {
    if (this.provider instanceof EnhancedOpenAIProvider) {
      const currentConfig = (this.provider as any).config;
      const newConfig = { ...currentConfig, ...config };
      this.provider = new EnhancedOpenAIProvider(newConfig);
    }
  }

  public async getResponse(prompt: string, diagramContext?: string): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      // Build context-aware system message
      let contextualPrompt = prompt;
      if (diagramContext) {
        contextualPrompt += `\n\nCurrent diagram context: ${diagramContext}`;
      }

      // Prepare messages with enhanced context
      const messages: AIMessage[] = [
        ...this.conversationHistory.slice(-10), // Keep last 10 messages
        { role: "user", content: contextualPrompt }
      ];

      // Get response from provider
      const response = await this.provider.sendRequest(messages);

      // Update conversation history if successful
      if (response.success) {
        this.conversationHistory.push(
          { role: "user", content: prompt },
          { role: "assistant", content: response.content }
        );

        // Maintain reasonable history size
        if (this.conversationHistory.length > 20) {
          this.conversationHistory = this.conversationHistory.slice(-20);
        }
      }

      // Record performance metrics
      this.performanceMetrics.recordRequest(Date.now() - startTime, response.success);

      return response;
    } catch (error) {
      console.error("AIServiceManager error:", error);
      this.performanceMetrics.recordRequest(Date.now() - startTime, false);
      
      return {
        content: "I encountered an unexpected error. Please try again with a different approach.",
        success: false,
        confidence: 0,
        error: error instanceof Error ? error.message : "UNKNOWN_ERROR"
      };
    }
  }

  public clearHistory(): void {
    this.conversationHistory = [];
  }

  public getHistory(): AIMessage[] {
    return [...this.conversationHistory];
  }

  public getHistoryLength(): number {
    return this.conversationHistory.length;
  }

  public getPerformanceMetrics(): any {
    return this.performanceMetrics.getMetrics();
  }

  public analyzePromptIntent(prompt: string): ParsedIntent {
    return this.intelligenceProcessor.analyzePrompt(prompt);
  }
}

// Performance Metrics Tracker
class PerformanceMetrics {
  private requests: { time: number, success: boolean, timestamp: number }[] = [];

  public recordRequest(responseTime: number, success: boolean): void {
    this.requests.push({
      time: responseTime,
      success,
      timestamp: Date.now()
    });

    // Keep only last 100 requests
    if (this.requests.length > 100) {
      this.requests = this.requests.slice(-100);
    }
  }

  public getMetrics(): any {
    if (this.requests.length === 0) {
      return {
        totalRequests: 0,
        successRate: 0,
        averageResponseTime: 0,
        fastestResponse: 0,
        slowestResponse: 0
      };
    }

    const successful = this.requests.filter(r => r.success);
    const responseTimes = this.requests.map(r => r.time);

    return {
      totalRequests: this.requests.length,
      successRate: (successful.length / this.requests.length) * 100,
      averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      fastestResponse: Math.min(...responseTimes),
      slowestResponse: Math.max(...responseTimes),
      recentRequests: this.requests.slice(-10)
    };
  }
}

// Enhanced Diagram-specific AI helper class
export class DiagramAIHelper {
  private aiService: AIServiceManager;

  constructor() {
    this.aiService = AIServiceManager.getInstance();
  }

  public async analyzeShape(shapes: any[], connections: any[]): Promise<string> {
    const context = this.buildAdvancedDiagramContext(shapes, connections);
    const prompt = `Analyze this diagram structure and provide comprehensive insights about its completeness, design quality, potential improvements, and adherence to best practices. Focus on both structural and semantic aspects.`;
    
    const response = await this.aiService.getResponse(prompt, context);
    return response.content;
  }

  public async suggestOptimizations(shapes: any[], connections: any[]): Promise<string> {
    const context = this.buildAdvancedDiagramContext(shapes, connections);
    const prompt = `Based on this diagram analysis, provide specific, actionable optimization recommendations for layout, readability, structure, and semantic clarity. Prioritize suggestions by impact and implementation difficulty.`;
    
    const response = await this.aiService.getResponse(prompt, context);
    return response.content;
  }

  public async generateDiagramIdeas(type: string, requirements?: string): Promise<string> {
    let prompt = `Generate innovative and comprehensive ${type} diagram structures with detailed element specifications, logical connections, and implementation best practices.`;
    
    if (requirements) {
      prompt += ` Specific requirements: ${requirements}`;
    }
    
    const response = await this.aiService.getResponse(prompt);
    return response.content;
  }

  public async processGeneralQuery(query: string, shapes: any[], connections: any[]): Promise<string> {
    const intentData = this.aiService.analyzePromptIntent(query);
    const context = this.buildAdvancedDiagramContext(shapes, connections);
    
    let enhancedQuery = query;
    if (intentData.diagramType !== 'custom') {
      enhancedQuery += ` (Context: This appears to be a ${intentData.diagramType} in the ${intentData.domain} domain)`;
    }
    
    const response = await this.aiService.getResponse(enhancedQuery, context);
    return response.content;
  }

  private buildAdvancedDiagramContext(shapes: any[], connections: any[]): string {
    // Analyze shape distribution
    const shapeAnalysis = this.analyzeShapeDistribution(shapes);
    
    // Analyze connectivity patterns
    const connectivityAnalysis = this.analyzeConnectivity(shapes, connections);
    
    // Analyze layout patterns
    const layoutAnalysis = this.analyzeLayout(shapes);
    
    return `Advanced Diagram Analysis:
Shape Distribution: ${shapeAnalysis}
Connectivity Patterns: ${connectivityAnalysis}
Layout Analysis: ${layoutAnalysis}
Total Elements: ${shapes.length}
Total Connections: ${connections.length}`;
  }

  private analyzeShapeDistribution(shapes: any[]): string {
    const distribution = shapes.reduce((acc, shape) => {
      acc[shape.type] = (acc[shape.type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(distribution)
      .map(([type, count]) => `${type}: ${count}`)
      .join(", ");
  }

  private analyzeConnectivity(shapes: any[], connections: any[]): string {
    if (shapes.length === 0) return "No elements";
    
    const connectivity = connections.length / shapes.length;
    if (connectivity > 1.5) return "Highly connected";
    if (connectivity > 0.8) return "Well connected";
    if (connectivity > 0.3) return "Moderately connected";
    return "Sparsely connected";
  }

  private analyzeLayout(shapes: any[]): string {
    if (shapes.length < 2) return "Minimal layout";
    
    // Simple layout analysis based on positioning
    const avgX = shapes.reduce((sum, s) => sum + s.x, 0) / shapes.length;
    const avgY = shapes.reduce((sum, s) => sum + s.y, 0) / shapes.length;
    
    const variance = shapes.reduce((sum, s) => {
      return sum + Math.pow(s.x - avgX, 2) + Math.pow(s.y - avgY, 2);
    }, 0) / shapes.length;
    
    if (variance > 50000) return "Distributed layout";
    if (variance > 20000) return "Structured layout";
    return "Compact layout";
  }
}

// Legacy compatibility
export const getAIResponse = async (prompt: string, diagramContext?: string): Promise<string> => {
  const aiService = AIServiceManager.getInstance();
  const response = await aiService.getResponse(prompt, diagramContext);
  return response.content;
};

// Export enhanced classes
export { BaseAIProvider, EnhancedOpenAIProvider as OpenAICompatibleProvider };