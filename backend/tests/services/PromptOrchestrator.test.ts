import { PromptOrchestrator } from '../../src/services/PromptOrchestrator';
import { UserContext, AIServiceProvider, PromptTemplate, PromptResult } from '../../src/types/orchestrator';

// Mock the validation functions to allow testing edge cases
jest.mock('../../src/types/orchestrator', () => {
  const actual = jest.requireActual('../../src/types/orchestrator');
  return {
    ...actual,
    validateUserContext: jest.fn(), // Mock this to allow invalid contexts for testing
    validatePromptTemplate: jest.fn() // Mock this too for consistency
  };
});

// Mock logger
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

// Mock AI service providers
const mockClaudeService = {
  name: 'claude' as const,
  generateResponse: jest.fn(),
  analyzeImage: jest.fn()
};

const mockGPTService = {
  name: 'gpt' as const,
  generateResponse: jest.fn(),
  analyzeImage: jest.fn()
};

describe('PromptOrchestrator', () => {
  let orchestrator: PromptOrchestrator;
  const mockUserId = 'user123';

  beforeEach(() => {
    jest.clearAllMocks();
    orchestrator = new PromptOrchestrator();
  });

  describe('AI Service Management', () => {
    it('should register AI service providers', () => {
      orchestrator.registerProvider(mockClaudeService);
      orchestrator.registerProvider(mockGPTService);

      const providers = orchestrator.getRegisteredProviders();
      expect(providers).toHaveLength(2);
      expect(providers.map(p => p.name)).toContain('claude');
      expect(providers.map(p => p.name)).toContain('gpt');
    });

    it('should throw error when registering duplicate provider', () => {
      orchestrator.registerProvider(mockClaudeService);
      
      expect(() => {
        orchestrator.registerProvider(mockClaudeService);
      }).toThrow('Provider claude is already registered');
    });

    it('should select preferred provider when available', () => {
      orchestrator.registerProvider(mockClaudeService);
      orchestrator.registerProvider(mockGPTService);

      const selected = orchestrator.selectProvider('claude');
      expect(selected.name).toBe('claude');
    });

    it('should fallback to any available provider when preferred not found', () => {
      orchestrator.registerProvider(mockGPTService);

      const selected = orchestrator.selectProvider('claude');
      expect(selected.name).toBe('gpt');
    });

    it('should throw error when no providers are available', () => {
      expect(() => {
        orchestrator.selectProvider('claude');
      }).toThrow('No AI providers available');
    });
  });

  describe('Dynamic Prompt Generation', () => {
    const mockUserContext: UserContext = {
      userId: mockUserId,
      preferences: {
        beerStyles: ['IPA', 'Stout'],
        flavorProfile: { bitter: 8, hoppy: 9, malty: 3 },
        abvRange: [4.0, 8.0]
      },
      currentMood: 'adventurous',
      location: {
        latitude: 47.6062,
        longitude: -122.3321,
        city: 'Seattle'
      },
      recentActivity: []
    };

    it('should generate personalized beer recommendation prompt', async () => {
      const template: PromptTemplate = {
        type: 'beer_recommendation',
        basePrompt: 'Recommend beers based on user preferences',
        contextualFactors: ['mood', 'preferences', 'location']
      };

      const result = await orchestrator.generatePrompt(template, mockUserContext);

      expect(result.prompt).toContain('adventurous');
      expect(result.prompt).toContain('IPA');
      expect(result.prompt).toContain('Seattle');
      expect(result.contextUsed).toEqual(['mood', 'preferences', 'location']);
      expect(result.personalizationScore).toBeGreaterThan(0);
    });

    it('should adapt prompt based on user mood', async () => {
      const adventurousContext = { ...mockUserContext, currentMood: 'adventurous' as const };
      const comfortContext = { ...mockUserContext, currentMood: 'comfort' as const };

      const template: PromptTemplate = {
        type: 'beer_recommendation',
        basePrompt: 'Recommend beers',
        contextualFactors: ['mood']
      };

      const adventurousResult = await orchestrator.generatePrompt(template, adventurousContext);
      const comfortResult = await orchestrator.generatePrompt(template, comfortContext);

      expect(adventurousResult.prompt).toContain('adventurous');
      expect(comfortResult.prompt).toContain('comfort');
      expect(adventurousResult.prompt).not.toEqual(comfortResult.prompt);
    });

    it('should include weather context when available', async () => {
      const contextWithWeather = {
        ...mockUserContext,
        weatherContext: {
          condition: 'sunny',
          temperature: 75,
          humidity: 60
        }
      };

      const template: PromptTemplate = {
        type: 'beer_recommendation',
        basePrompt: 'Recommend beers',
        contextualFactors: ['mood', 'weather']
      };

      const result = await orchestrator.generatePrompt(template, contextWithWeather);

      expect(result.prompt).toContain('sunny');
      expect(result.prompt).toContain('75');
      expect(result.contextUsed).toContain('weather');
    });
  });

  describe('Cross-Platform AI Execution', () => {
    beforeEach(() => {
      orchestrator.registerProvider(mockClaudeService);
      orchestrator.registerProvider(mockGPTService);
    });

    it('should execute prompt with single provider', async () => {
      const mockResponse = {
        content: 'Recommended beer: Hoppy IPA',
        confidence: 0.9,
        provider: 'claude'
      };
      
      mockClaudeService.generateResponse.mockResolvedValue(mockResponse);

      const result = await orchestrator.executePrompt(
        'Recommend a beer',
        { providers: ['claude'] }
      );

      expect(result.responses).toHaveLength(1);
      expect(result.responses[0]).toEqual(mockResponse);
      expect(result.primaryResponse).toEqual(mockResponse);
      expect(mockClaudeService.generateResponse).toHaveBeenCalledWith('Recommend a beer');
    });

    it('should execute prompt with multiple providers for cross-validation', async () => {
      const claudeResponse = {
        content: 'Claude recommends: West Coast IPA',
        confidence: 0.9,
        provider: 'claude'
      };
      
      const gptResponse = {
        content: 'GPT recommends: New England IPA',
        confidence: 0.85,
        provider: 'gpt'
      };

      mockClaudeService.generateResponse.mockResolvedValue(claudeResponse);
      mockGPTService.generateResponse.mockResolvedValue(gptResponse);

      const result = await orchestrator.executePrompt(
        'Recommend a beer',
        { providers: ['claude', 'gpt'], crossValidation: true }
      );

      expect(result.responses).toHaveLength(2);
      expect(result.primaryResponse).toEqual(claudeResponse); // Higher confidence
      expect(result.crossValidationScore).toBeDefined();
      expect(mockClaudeService.generateResponse).toHaveBeenCalled();
      expect(mockGPTService.generateResponse).toHaveBeenCalled();
    });

    it('should handle provider failures gracefully', async () => {
      mockClaudeService.generateResponse.mockRejectedValue(new Error('Claude API error'));
      mockGPTService.generateResponse.mockResolvedValue({
        content: 'GPT fallback response',
        confidence: 0.8,
        provider: 'gpt'
      });

      const result = await orchestrator.executePrompt(
        'Recommend a beer',
        { providers: ['claude', 'gpt'], fallbackEnabled: true }
      );

      expect(result.responses).toHaveLength(1);
      expect(result.primaryResponse.provider).toBe('gpt');
      expect(result.errors).toHaveLength(1);
      expect(result.errors![0].provider).toBe('claude');
    });

    it('should throw error when all providers fail', async () => {
      mockClaudeService.generateResponse.mockRejectedValue(new Error('Claude error'));
      mockGPTService.generateResponse.mockRejectedValue(new Error('GPT error'));

      await expect(
        orchestrator.executePrompt('Recommend a beer', { providers: ['claude', 'gpt'] })
      ).rejects.toThrow('All AI providers failed');
    });
  });

  describe('Prompt Optimization and Learning', () => {
    it('should track prompt performance metrics', async () => {
      const promptId = 'beer_rec_001';
      const userFeedback = {
        helpful: true,
        accuracy: 4.5,
        relevance: 4.0,
        userId: mockUserId
      };

      await orchestrator.recordPromptFeedback(promptId, userFeedback);

      const metrics = await orchestrator.getPromptMetrics(promptId);
      expect(metrics.totalFeedback).toBe(1);
      expect(metrics.averageAccuracy).toBe(4.5);
      expect(metrics.averageRelevance).toBe(4.0);
      expect(metrics.helpfulnessRate).toBe(1.0);
    });

    it('should optimize prompts based on user feedback', async () => {
      const template: PromptTemplate = {
        type: 'beer_recommendation',
        basePrompt: 'Recommend beers',
        contextualFactors: ['mood']
      };

      // Simulate negative feedback
      await orchestrator.recordPromptFeedback('beer_rec_001', {
        helpful: false,
        accuracy: 2.0,
        relevance: 2.5,
        userId: mockUserId
      });

      const optimizedTemplate = await orchestrator.optimizePrompt(template, mockUserId);

      expect(optimizedTemplate.basePrompt).not.toBe(template.basePrompt);
      expect(optimizedTemplate.contextualFactors).toBeDefined();
      expect(optimizedTemplate.optimizationVersion).toBeGreaterThan(0);
    });

    it('should learn user preferences from interaction history', async () => {
      const interactions = [
        { type: 'liked_beer', data: { style: 'IPA', abv: 6.5, ibu: 60 } },
        { type: 'liked_beer', data: { style: 'IPA', abv: 7.2, ibu: 70 } },
        { type: 'disliked_beer', data: { style: 'Lager', abv: 4.8, ibu: 20 } }
      ];

      await orchestrator.updateUserLearningModel(mockUserId, interactions);

      const learnedPreferences = await orchestrator.getUserLearningModel(mockUserId);
      
      expect(learnedPreferences.preferredStyles).toContain('IPA');
      expect(learnedPreferences.preferredAbvRange).toEqual([6.0, 7.5]);
      expect(learnedPreferences.preferredIbuRange).toEqual([55, 75]);
      expect(learnedPreferences.avoidedStyles).toContain('Lager');
    });
  });

  describe('Contextual Personalization', () => {
    it('should calculate personalization score based on context richness', async () => {
      const richContext: UserContext = {
        userId: mockUserId,
        preferences: { beerStyles: ['IPA'], flavorProfile: { hoppy: 9 }, abvRange: [5, 8] },
        currentMood: 'adventurous',
        location: { latitude: 47.6062, longitude: -122.3321, city: 'Seattle' },
        weatherContext: { condition: 'sunny', temperature: 75 },
        recentActivity: [
          { type: 'brewery_visit', timestamp: new Date(), data: { breweryId: 'brewery1' } }
        ]
      };

      const poorContext: UserContext = {
        userId: mockUserId,
        preferences: { beerStyles: [], flavorProfile: {}, abvRange: [0, 20] },
        currentMood: 'neutral',
        location: { latitude: 0, longitude: 0 },
        recentActivity: []
      };

      const template: PromptTemplate = {
        type: 'beer_recommendation',
        basePrompt: 'Recommend beers',
        contextualFactors: ['mood', 'preferences', 'location', 'weather', 'activity']
      };

      const richResult = await orchestrator.generatePrompt(template, richContext);
      const poorResult = await orchestrator.generatePrompt(template, poorContext);

      expect(richResult.personalizationScore).toBeGreaterThan(poorResult.personalizationScore);
      expect(richResult.contextUsed.length).toBeGreaterThan(poorResult.contextUsed.length);
    });
  });

  describe('Coverage Completion Tests', () => {
    beforeEach(() => {
      orchestrator.registerProvider(mockClaudeService);
    });

    it('should handle missing contextual factors', async () => {
      const contextWithMissingFactors: UserContext = {
        userId: mockUserId,
        preferences: { beerStyles: [], flavorProfile: {}, abvRange: [4, 8] }, // Empty beer styles
        currentMood: 'neutral',
        location: { latitude: 47.6062, longitude: -122.3321 }, // Missing city
        recentActivity: [] // Empty activity
      };

      const template: PromptTemplate = {
        type: 'beer_recommendation',
        basePrompt: 'Recommend beers',
        contextualFactors: ['preferences', 'location', 'activity', 'weather'] // Weather not provided
      };

      const result = await orchestrator.generatePrompt(template, contextWithMissingFactors);
      
      // Only mood should be absent from contextUsed due to various missing data
      expect(result.contextUsed).not.toContain('preferences'); // Empty beer styles
      expect(result.contextUsed).not.toContain('location'); // Missing city
      expect(result.contextUsed).not.toContain('activity'); // Empty activity
      expect(result.contextUsed).not.toContain('weather'); // Not provided
      expect(result.personalizationScore).toBe(0.1); // Base score only
    });

    it('should use default provider when no providers specified', async () => {
      const mockResponse = {
        content: 'Default provider response',
        confidence: 0.8,
        provider: 'claude'
      };
      
      mockClaudeService.generateResponse.mockResolvedValue(mockResponse);

      const result = await orchestrator.executePrompt('Test prompt'); // No providers specified

      expect(result.responses).toHaveLength(1);
      expect(result.primaryResponse).toEqual(mockResponse);
      expect(mockClaudeService.generateResponse).toHaveBeenCalledWith('Test prompt');
    });

    it('should update existing prompt metrics when recording feedback', async () => {
      const promptId = 'existing_prompt';
      
      // First, record initial feedback
      await orchestrator.recordPromptFeedback(promptId, {
        helpful: true,
        accuracy: 4.0,
        relevance: 4.5,
        userId: mockUserId
      });

      // Then record additional feedback to trigger the update path
      await orchestrator.recordPromptFeedback(promptId, {
        helpful: false,
        accuracy: 3.0,
        relevance: 3.5,
        userId: mockUserId
      });

      const metrics = await orchestrator.getPromptMetrics(promptId);
      
      expect(metrics.totalFeedback).toBe(2);
      expect(metrics.averageAccuracy).toBe(3.5); // (4.0 + 3.0) / 2
      expect(metrics.averageRelevance).toBe(4.0); // (4.5 + 3.5) / 2
      expect(metrics.helpfulnessRate).toBe(0.5); // 1 helpful out of 2
    });

    it('should throw error when getting metrics for non-existent prompt', async () => {
      await expect(
        orchestrator.getPromptMetrics('non_existent_prompt')
      ).rejects.toThrow('No metrics found for prompt non_existent_prompt');
    });

    it('should throw error when getting learning model for non-existent user', async () => {
      await expect(
        orchestrator.getUserLearningModel('non_existent_user')
      ).rejects.toThrow('No learning model found for user non_existent_user');
    });

    it('should handle null currentMood to cover break statement', async () => {
      const contextWithNullMood: UserContext = {
        userId: mockUserId,
        preferences: { beerStyles: ['IPA'], flavorProfile: {}, abvRange: [4, 8] },
        currentMood: null as any, // null mood to trigger break statement
        location: { latitude: 47.6062, longitude: -122.3321, city: 'Seattle' },
        recentActivity: []
      };

      const template: PromptTemplate = {
        type: 'beer_recommendation',
        basePrompt: 'Recommend beers',
        contextualFactors: ['mood', 'preferences']
      };

      const result = await orchestrator.generatePrompt(template, contextWithNullMood);
      
      // Should use preferences but not mood since currentMood is null
      expect(result.contextUsed).toContain('preferences');
      expect(result.contextUsed).not.toContain('mood');
      expect(result.personalizationScore).toBeGreaterThan(0.1); // Should have some score from preferences
    });
  });
});