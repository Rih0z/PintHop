import { 
  UserContext, 
  PromptTemplate, 
  AIServiceProvider, 
  PromptResult,
  UserPreferences,
  WeatherContext,
  UserActivity,
  validateUserContext,
  validatePromptTemplate
} from '../../src/types/orchestrator';

describe('Orchestrator Types', () => {
  describe('UserContext validation', () => {
    it('should validate complete UserContext', () => {
      const validContext: UserContext = {
        userId: 'user123',
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

      expect(() => validateUserContext(validContext)).not.toThrow();
    });

    it('should reject UserContext with invalid mood', () => {
      const invalidContext = {
        userId: 'user123',
        preferences: {
          beerStyles: ['IPA'],
          flavorProfile: { hoppy: 5 },
          abvRange: [4.0, 8.0] as [number, number]
        },
        currentMood: 'invalid_mood', // Invalid mood
        location: { latitude: 47.6062, longitude: -122.3321 },
        recentActivity: []
      };

      expect(() => validateUserContext(invalidContext as any)).toThrow('Invalid mood');
    });

    it('should reject UserContext with invalid ABV range', () => {
      const invalidContext: Partial<UserContext> = {
        userId: 'user123',
        preferences: {
          beerStyles: ['IPA'],
          flavorProfile: { hoppy: 5 },
          abvRange: [8.0, 4.0] // Invalid range (max < min)
        },
        currentMood: 'adventurous',
        location: { latitude: 47.6062, longitude: -122.3321 },
        recentActivity: []
      };

      expect(() => validateUserContext(invalidContext as UserContext)).toThrow('Invalid ABV range');
    });

    it('should accept optional weather context', () => {
      const contextWithWeather: UserContext = {
        userId: 'user123',
        preferences: {
          beerStyles: ['IPA'],
          flavorProfile: { hoppy: 5 },
          abvRange: [4.0, 8.0]
        },
        currentMood: 'adventurous',
        location: { latitude: 47.6062, longitude: -122.3321 },
        weatherContext: {
          condition: 'sunny',
          temperature: 75,
          humidity: 60
        },
        recentActivity: []
      };

      expect(() => validateUserContext(contextWithWeather)).not.toThrow();
    });
  });

  describe('PromptTemplate validation', () => {
    it('should validate complete PromptTemplate', () => {
      const validTemplate: PromptTemplate = {
        type: 'beer_recommendation',
        basePrompt: 'Recommend beers based on user preferences',
        contextualFactors: ['mood', 'preferences', 'location'],
        requiredContext: ['preferences'],
        optimizationVersion: 1
      };

      expect(() => validatePromptTemplate(validTemplate)).not.toThrow();
    });

    it('should reject template with invalid type', () => {
      const invalidTemplate = {
        type: 'invalid_type',
        basePrompt: 'Test prompt',
        contextualFactors: ['mood']
      };

      expect(() => validatePromptTemplate(invalidTemplate as any)).toThrow('Invalid template type');
    });

    it('should reject template with empty basePrompt', () => {
      const invalidTemplate: PromptTemplate = {
        type: 'beer_recommendation',
        basePrompt: '', // Empty prompt
        contextualFactors: ['mood']
      };

      expect(() => validatePromptTemplate(invalidTemplate)).toThrow('Base prompt cannot be empty');
    });

    it('should reject template with invalid contextual factors', () => {
      const invalidTemplate = {
        type: 'beer_recommendation',
        basePrompt: 'Test prompt',
        contextualFactors: ['invalid_factor']
      };

      expect(() => validatePromptTemplate(invalidTemplate as any)).toThrow('Invalid contextual factor');
    });
  });

  describe('AIServiceProvider interface', () => {
    it('should define correct provider structure', () => {
      const mockProvider: AIServiceProvider = {
        name: 'claude',
        generateResponse: jest.fn().mockResolvedValue({
          content: 'Test response',
          confidence: 0.9,
          provider: 'claude'
        }),
        analyzeImage: jest.fn().mockResolvedValue({
          content: 'Image analysis',
          confidence: 0.85,
          provider: 'claude'
        }),
        capabilities: ['text_generation', 'image_analysis'],
        config: {
          maxTokens: 4000,
          temperature: 0.7
        }
      };

      expect(mockProvider.name).toBe('claude');
      expect(typeof mockProvider.generateResponse).toBe('function');
      expect(typeof mockProvider.analyzeImage).toBe('function');
      expect(mockProvider.capabilities).toContain('text_generation');
    });
  });

  describe('UserActivity type safety', () => {
    it('should accept valid activity types', () => {
      const validActivities: UserActivity[] = [
        {
          type: 'brewery_visit',
          timestamp: new Date(),
          data: { breweryId: 'brewery1', duration: 120 }
        },
        {
          type: 'beer_checkin',
          timestamp: new Date(),
          data: { beerId: 'beer1', rating: 4.5, notes: 'Great beer!' }
        },
        {
          type: 'taplist_scan',
          timestamp: new Date(),
          data: { breweryId: 'brewery1', beersIdentified: 12 }
        }
      ];

      validActivities.forEach(activity => {
        expect(activity.type).toBeDefined();
        expect(activity.timestamp).toBeInstanceOf(Date);
        expect(activity.data).toBeDefined();
      });
    });
  });

  describe('PromptResult structure', () => {
    it('should define complete result structure', () => {
      const result: PromptResult = {
        prompt: 'Generated personalized prompt',
        contextUsed: ['mood', 'preferences'],
        personalizationScore: 0.85,
        timestamp: new Date(),
        templateVersion: 1,
        estimatedTokens: 250
      };

      expect(typeof result.prompt).toBe('string');
      expect(Array.isArray(result.contextUsed)).toBe(true);
      expect(typeof result.personalizationScore).toBe('number');
      expect(result.personalizationScore).toBeGreaterThanOrEqual(0);
      expect(result.personalizationScore).toBeLessThanOrEqual(1);
    });
  });

  describe('Type inference and safety', () => {
    it('should infer correct types for mood values', () => {
      type MoodType = UserContext['currentMood'];
      
      const validMoods: MoodType[] = ['adventurous', 'comfort', 'social', 'contemplative', 'neutral'];
      
      validMoods.forEach(mood => {
        expect(['adventurous', 'comfort', 'social', 'contemplative', 'neutral']).toContain(mood);
      });
    });

    it('should enforce flavor profile value ranges', () => {
      const validProfile: UserPreferences['flavorProfile'] = {
        bitter: 8,
        hoppy: 9,
        malty: 3,
        sweet: 2,
        sour: 1,
        roasted: 4
      };

      Object.values(validProfile).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(10);
      });
    });

    it('should reject UserContext with missing user ID', () => {
      const invalidContext = {
        userId: '', // Empty user ID
        preferences: {
          beerStyles: ['IPA'],
          flavorProfile: { hoppy: 5 },
          abvRange: [4.0, 8.0] as [number, number]
        },
        currentMood: 'neutral',
        location: { latitude: 47.6062, longitude: -122.3321 },
        recentActivity: []
      };

      expect(() => validateUserContext(invalidContext as any)).toThrow('User ID is required');
    });

    it('should reject UserContext with invalid flavor profile values', () => {
      const invalidContext: UserContext = {
        userId: 'user123',
        preferences: {
          beerStyles: ['IPA'],
          flavorProfile: { hoppy: 15 }, // Invalid value > 10
          abvRange: [4.0, 8.0]
        },
        currentMood: 'neutral',
        location: { latitude: 47.6062, longitude: -122.3321 },
        recentActivity: []
      };

      expect(() => validateUserContext(invalidContext)).toThrow('Flavor profile values must be between 0 and 10');
    });
  });
});