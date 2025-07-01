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
}

export interface AIConfiguration {
  apiKey: string;
  apiUrl: string;
  model: string;
  temperature: number;
  maxTokens?: number;
  timeout?: number;
}

// Abstract base class untuk AI providers
abstract class BaseAIProvider {
  protected config: AIConfiguration;

  constructor(config: AIConfiguration) {
    this.config = config;
  }

  abstract sendRequest(messages: AIMessage[]): Promise<AIResponse>;
  abstract validateConfig(): boolean;
}

// Concrete implementation untuk OpenAI-compatible API
class OpenAICompatibleProvider extends BaseAIProvider {
  constructor(config: AIConfiguration) {
    super(config);
    if (!this.validateConfig()) {
      throw new Error("Invalid AI configuration");
    }
  }

  validateConfig(): boolean {
    return !!(this.config.apiKey && this.config.apiUrl && this.config.model);
  }

  async sendRequest(messages: AIMessage[]): Promise<AIResponse> {
    try {
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
          messages: messages,
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
      
      return {
        content: data.choices[0]?.message?.content || "I couldn't process that request.",
        success: true,
        metadata: {
          model: data.model,
          usage: data.usage
        }
      };
    } catch (error) {
      console.error("AI API Error:", error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            content: "Request timed out. Please try again.",
            success: false,
            error: "TIMEOUT"
          };
        }
        
        return {
          content: "Sorry, there was an error processing your request.",
          success: false,
          error: error.message
        };
      }
      
      return {
        content: "An unknown error occurred.",
        success: false,
        error: "UNKNOWN_ERROR"
      };
    }
  }
}

// AI Service Manager - Singleton pattern
export class AIServiceManager {
  private static instance: AIServiceManager;
  private provider: BaseAIProvider;
  private conversationHistory: AIMessage[] = [];
  private systemPrompt: string;

  private constructor() {
    // Default configuration
    const defaultConfig: AIConfiguration = {
      apiKey: "sk-iMvFMAyg1AJSCKpScqsMvbp6svIs0s1f5sn9wu7h6gze946k",
      apiUrl: "https://api.chatanywhere.org/v1/chat/completions",
      model: "deepseek-v3",
      temperature: 0.7,
      maxTokens: 1000,
      timeout: 30000
    };

    this.provider = new OpenAICompatibleProvider(defaultConfig);
    this.systemPrompt = "You are a professional diagram assistant. Help users with diagram creation, analysis and optimization. Respond concisely and professionally.";
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

  public setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
  }

  public updateConfiguration(config: Partial<AIConfiguration>): void {
    if (this.provider instanceof OpenAICompatibleProvider) {
      // Create new provider with updated config
      const currentConfig = (this.provider as any).config;
      const newConfig = { ...currentConfig, ...config };
      this.provider = new OpenAICompatibleProvider(newConfig);
    }
  }

  public async getResponse(prompt: string, diagramContext?: string): Promise<AIResponse> {
    try {
      // Build context-aware system message
      let systemContent = this.systemPrompt;
      if (diagramContext) {
        systemContent += ` Current diagram context: ${diagramContext}`;
      }

      // Prepare messages
      const messages: AIMessage[] = [
        { role: "system", content: systemContent },
        ...this.conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: "user", content: prompt }
      ];

      // Get response from provider
      const response = await this.provider.sendRequest(messages);

      // Update conversation history if successful
      if (response.success) {
        this.conversationHistory.push(
          { role: "user", content: prompt },
          { role: "assistant", content: response.content }
        );

        // Keep history manageable (last 20 messages)
        if (this.conversationHistory.length > 20) {
          this.conversationHistory = this.conversationHistory.slice(-20);
        }
      }

      return response;
    } catch (error) {
      console.error("AIServiceManager error:", error);
      return {
        content: "I encountered an unexpected error. Please try again.",
        success: false,
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
}

// Diagram-specific AI helper class
export class DiagramAIHelper {
  private aiService: AIServiceManager;

  constructor() {
    this.aiService = AIServiceManager.getInstance();
  }

  public async analyzeShape(shapes: any[], connections: any[]): Promise<string> {
    const context = this.buildDiagramContext(shapes, connections);
    const prompt = `Please analyze this diagram structure and provide insights about its complexity, potential improvements, and any issues you notice.`;
    
    const response = await this.aiService.getResponse(prompt, context);
    return response.content;
  }

  public async suggestOptimizations(shapes: any[], connections: any[]): Promise<string> {
    const context = this.buildDiagramContext(shapes, connections);
    const prompt = `Based on this diagram, suggest specific optimizations for layout, readability, and structure. Provide actionable recommendations.`;
    
    const response = await this.aiService.getResponse(prompt, context);
    return response.content;
  }

  public async generateDiagramIdeas(type: string): Promise<string> {
    const prompt = `Generate a ${type} diagram structure with specific elements, connections, and best practices. Provide a clear description of what should be created.`;
    
    const response = await this.aiService.getResponse(prompt);
    return response.content;
  }

  public async processGeneralQuery(query: string, shapes: any[], connections: any[]): Promise<string> {
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
      .slice(0, 5)
      .map(s => s.text || s.title || 'Untitled')
      .join(", ");

    return `Diagram with ${shapes.length} elements (${mainElements}${shapes.length > 5 ? "..." : ""}) and ${connections.length} connections. Shape types: ${Object.entries(shapeTypes).map(([type, count]) => `${type}: ${count}`).join(", ")}.`;
  }
}

// Legacy function for backward compatibility
export const getAIResponse = async (prompt: string, diagramContext?: string): Promise<string> => {
  const aiService = AIServiceManager.getInstance();
  const response = await aiService.getResponse(prompt, diagramContext);
  return response.content;
};

// Export types and classes
export { BaseAIProvider, OpenAICompatibleProvider };