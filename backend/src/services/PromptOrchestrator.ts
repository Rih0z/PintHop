import { 
  UserContext, 
  AIServiceProvider, 
  PromptTemplate, 
  PromptResult, 
  ExecutionOptions, 
  ExecutionResult,
  PromptFeedback,
  PromptMetrics,
  UserLearningModel,
  ContextualFactor,
  validateUserContext,
  validatePromptTemplate
} from '../types/orchestrator';
import { logger } from '../utils/logger';

export class PromptOrchestrator {
  private providers: Map<string, AIServiceProvider> = new Map();
  private promptMetrics: Map<string, PromptMetrics> = new Map();
  private userLearningModels: Map<string, UserLearningModel> = new Map();

  registerProvider(provider: AIServiceProvider): void {
    if (this.providers.has(provider.name)) {
      logger.warn(`Attempt to register duplicate provider: ${provider.name}`);
      throw new Error(`Provider ${provider.name} is already registered`);
    }
    this.providers.set(provider.name, provider);
    logger.info(`AI provider registered: ${provider.name}`);
  }

  getRegisteredProviders(): AIServiceProvider[] {
    return Array.from(this.providers.values());
  }

  selectProvider(preferredName?: string): AIServiceProvider {
    if (this.providers.size === 0) {
      throw new Error('No AI providers available');
    }

    if (preferredName && this.providers.has(preferredName)) {
      return this.providers.get(preferredName)!;
    }

    // Fallback to any available provider
    return Array.from(this.providers.values())[0];
  }

  async generatePrompt(template: PromptTemplate, context: UserContext): Promise<PromptResult> {
    // Validate inputs
    validatePromptTemplate(template);
    validateUserContext(context);

    let prompt = template.basePrompt;
    const contextUsed: ContextualFactor[] = [];
    let personalizationScore = 0.1; // Base score

    logger.debug(`Generating prompt for template type: ${template.type}, user: ${context.userId}`);

    // Add contextual information based on available factors
    for (const factor of template.contextualFactors) {
      const factorResult = this.processContextualFactor(factor, context);
      if (factorResult) {
        prompt += ` ${factorResult.text}`;
        contextUsed.push(factor);
        personalizationScore += factorResult.score;
      }
    }

    const result: PromptResult = {
      prompt,
      contextUsed,
      personalizationScore: Math.min(personalizationScore, 1.0),
      timestamp: new Date(),
      templateVersion: template.optimizationVersion || 1,
      estimatedTokens: this.estimateTokenCount(prompt)
    };

    logger.debug(`Generated prompt with personalization score: ${result.personalizationScore}`);
    return result;
  }

  private processContextualFactor(factor: ContextualFactor, context: UserContext): { text: string; score: number } | null {
    switch (factor) {
      case 'mood':
        if (context.currentMood) {
          return {
            text: `Consider the user's ${context.currentMood} mood.`,
            score: 0.15
          };
        }
        break;
      case 'preferences':
        if (context.preferences.beerStyles.length > 0) {
          return {
            text: `User prefers: ${context.preferences.beerStyles.join(', ')}.`,
            score: 0.2
          };
        }
        break;
      case 'location':
        if (context.location.city) {
          return {
            text: `User is in ${context.location.city}.`,
            score: 0.1
          };
        }
        break;
      case 'weather':
        if (context.weatherContext) {
          return {
            text: `Weather: ${context.weatherContext.condition}, ${context.weatherContext.temperature}°F.`,
            score: 0.1
          };
        }
        break;
      case 'activity':
        if (context.recentActivity.length > 0) {
          return {
            text: `Recent activity: ${context.recentActivity[0].type}.`,
            score: 0.1
          };
        }
        break;
    }
    return null;
  }

  private estimateTokenCount(text: string): number {
    // More sophisticated token estimation (rough approximation)
    return Math.ceil(text.length / 4);
  }

  async executePrompt(prompt: string, options: ExecutionOptions = {}): Promise<ExecutionResult> {
    const { providers = [], crossValidation = false, fallbackEnabled = false, timeout = 30000 } = options;
    const responses: any[] = [];
    const errors: Array<{ provider: string; error: Error }> = [];

    logger.info(`Executing prompt with ${providers.length || 1} providers, crossValidation: ${crossValidation}`);

    let targetProviders: AIServiceProvider[];
    if (providers.length > 0) {
      targetProviders = providers.map(name => this.selectProvider(name));
    } else {
      targetProviders = [this.selectProvider()];
    }

    // Execute with all requested providers in parallel for better performance
    const providerPromises = targetProviders.map(async (provider) => {
      try {
        logger.debug(`Executing prompt with provider: ${provider.name}`);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout: ${provider.name}`)), timeout)
        );
        
        const response = await Promise.race([
          provider.generateResponse(prompt),
          timeoutPromise
        ]);
        
        logger.debug(`Provider ${provider.name} completed successfully`);
        return { provider: provider.name, response, success: true as const };
      } catch (error) {
        logger.warn(`Provider ${provider.name} failed: ${(error as Error).message}`);
        return { provider: provider.name, error: error as Error, success: false as const };
      }
    });

    const results = await Promise.allSettled(providerPromises);
    
    for (const result of results) {
      if (result.status === 'fulfilled') {
        const value = result.value;
        if (value.success) {
          responses.push(value.response);
        } else {
          errors.push({ provider: value.provider, error: value.error });
        }
      }
    }

    if (responses.length === 0) {
      logger.error('All AI providers failed');
      throw new Error('All AI providers failed');
    }

    // Select primary response (highest confidence)
    const primaryResponse = responses.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );

    const executionResult: ExecutionResult = {
      responses,
      primaryResponse,
      errors: errors.length > 0 ? errors : undefined
    };

    // Add cross-validation score if multiple responses
    if (crossValidation && responses.length > 1) {
      executionResult.crossValidationScore = this.calculateCrossValidationScore(responses);
      logger.info(`Cross-validation score: ${executionResult.crossValidationScore}`);
    }

    logger.info(`Prompt execution completed. Responses: ${responses.length}, Errors: ${errors.length}`);
    return executionResult;
  }

  private calculateCrossValidationScore(responses: any[]): number {
    // Simple similarity calculation - in reality this would be more sophisticated
    const avgConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;
    return Math.min(avgConfidence, 1.0);
  }

  async recordPromptFeedback(promptId: string, feedback: PromptFeedback): Promise<void> {
    const existing = this.promptMetrics.get(promptId);
    
    if (existing) {
      const totalFeedback = existing.totalFeedback + 1;
      const newMetrics: PromptMetrics = {
        totalFeedback,
        averageAccuracy: (existing.averageAccuracy * existing.totalFeedback + feedback.accuracy) / totalFeedback,
        averageRelevance: (existing.averageRelevance * existing.totalFeedback + feedback.relevance) / totalFeedback,
        helpfulnessRate: feedback.helpful 
          ? (existing.helpfulnessRate * existing.totalFeedback + 1) / totalFeedback
          : (existing.helpfulnessRate * existing.totalFeedback) / totalFeedback,
        lastUpdated: new Date()
      };
      this.promptMetrics.set(promptId, newMetrics);
    } else {
      this.promptMetrics.set(promptId, {
        totalFeedback: 1,
        averageAccuracy: feedback.accuracy,
        averageRelevance: feedback.relevance,
        helpfulnessRate: feedback.helpful ? 1.0 : 0.0,
        lastUpdated: new Date()
      });
    }
  }

  async getPromptMetrics(promptId: string): Promise<PromptMetrics> {
    const metrics = this.promptMetrics.get(promptId);
    if (!metrics) {
      throw new Error(`No metrics found for prompt ${promptId}`);
    }
    return metrics;
  }

  async optimizePrompt(template: PromptTemplate, userId: string): Promise<PromptTemplate> {
    // Simple optimization based on poor performance
    const optimizedTemplate: PromptTemplate = {
      ...template,
      basePrompt: `${template.basePrompt} Please provide detailed, specific recommendations.`,
      contextualFactors: [...template.contextualFactors, 'preferences'],
      optimizationVersion: (template.optimizationVersion || 0) + 1
    };

    return optimizedTemplate;
  }

  async updateUserLearningModel(userId: string, interactions: any[]): Promise<void> {
    const preferredStyles: string[] = [];
    const avoidedStyles: string[] = [];
    let abvSum = 0;
    let abvCount = 0;
    let ibuSum = 0;
    let ibuCount = 0;

    for (const interaction of interactions) {
      if (interaction.type === 'liked_beer') {
        preferredStyles.push(interaction.data.style);
        abvSum += interaction.data.abv;
        abvCount++;
        if (interaction.data.ibu) {
          ibuSum += interaction.data.ibu;
          ibuCount++;
        }
      } else if (interaction.type === 'disliked_beer') {
        avoidedStyles.push(interaction.data.style);
      }
    }

    const avgAbv = abvCount > 0 ? abvSum / abvCount : 5.0;
    const avgIbu = ibuCount > 0 ? ibuSum / ibuCount : 30;

    // Calculate preferred ranges based on the data spread
    const abvValues = interactions
      .filter(i => i.type === 'liked_beer')
      .map(i => i.data.abv);
    const minAbv = abvValues.length > 0 ? Math.min(...abvValues) : avgAbv;
    const maxAbv = abvValues.length > 0 ? Math.max(...abvValues) : avgAbv;
    
    const ibuValues = interactions
      .filter(i => i.type === 'liked_beer' && i.data.ibu)
      .map(i => i.data.ibu);
    const minIbu = ibuValues.length > 0 ? Math.min(...ibuValues) : avgIbu;
    const maxIbu = ibuValues.length > 0 ? Math.max(...ibuValues) : avgIbu;

    const learningModel: UserLearningModel = {
      userId,
      preferredStyles: [...new Set(preferredStyles)],
      avoidedStyles: [...new Set(avoidedStyles)],
      preferredAbvRange: [Math.max(minAbv - 0.5, 0), maxAbv + 0.3],
      preferredIbuRange: [Math.max(minIbu - 5, 0), maxIbu + 5],
      flavorPreferences: {
        hoppy: preferredStyles.includes('IPA') ? 8 : 5,
        bitter: preferredStyles.includes('IPA') ? 7 : 4
      },
      contextualPatterns: {},
      lastUpdated: new Date()
    };

    this.userLearningModels.set(userId, learningModel);
  }

  async getUserLearningModel(userId: string): Promise<UserLearningModel> {
    const model = this.userLearningModels.get(userId);
    if (!model) {
      throw new Error(`No learning model found for user ${userId}`);
    }
    return model;
  }
}