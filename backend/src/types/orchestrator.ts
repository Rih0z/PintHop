export type UserMood = 'adventurous' | 'comfort' | 'social' | 'contemplative' | 'neutral';

export type PromptTemplateType = 'beer_recommendation' | 'taplist_analysis' | 'brewery_discovery' | 'flavor_matching';

export type ContextualFactor = 'mood' | 'preferences' | 'location' | 'weather' | 'activity' | 'social' | 'time';

export type ActivityType = 'brewery_visit' | 'beer_checkin' | 'taplist_scan' | 'social_interaction' | 'location_change';

export interface FlavorProfile {
  bitter?: number;
  hoppy?: number;
  malty?: number;
  sweet?: number;
  sour?: number;
  roasted?: number;
  fruity?: number;
  spicy?: number;
}

export interface UserPreferences {
  beerStyles: string[];
  flavorProfile: FlavorProfile;
  abvRange: [number, number];
  preferredBreweries?: string[];
  avoidedIngredients?: string[];
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
}

export interface WeatherContext {
  condition: string;
  temperature: number;
  humidity?: number;
  windSpeed?: number;
}

export interface UserActivity {
  type: ActivityType;
  timestamp: Date;
  data: Record<string, any>;
}

export interface UserContext {
  userId: string;
  preferences: UserPreferences;
  currentMood: UserMood;
  location: Location;
  weatherContext?: WeatherContext;
  recentActivity: UserActivity[];
}

export interface PromptTemplate {
  type: PromptTemplateType;
  basePrompt: string;
  contextualFactors: ContextualFactor[];
  requiredContext?: ContextualFactor[];
  optimizationVersion?: number;
}

export interface PromptResult {
  prompt: string;
  contextUsed: ContextualFactor[];
  personalizationScore: number;
  timestamp: Date;
  templateVersion?: number;
  estimatedTokens?: number;
}

export interface AIResponse {
  content: string;
  confidence: number;
  provider: string;
  metadata?: Record<string, any>;
}

export interface AIServiceProvider {
  name: string;
  generateResponse: (prompt: string, options?: any) => Promise<AIResponse>;
  analyzeImage?: (image: Buffer | string, prompt: string) => Promise<AIResponse>;
  capabilities?: string[];
  config?: Record<string, any>;
}

export interface ExecutionOptions {
  providers?: string[];
  crossValidation?: boolean;
  fallbackEnabled?: boolean;
  timeout?: number;
}

export interface ExecutionResult {
  responses: AIResponse[];
  primaryResponse: AIResponse;
  crossValidationScore?: number;
  errors?: Array<{ provider: string; error: Error }>;
}

export interface PromptFeedback {
  helpful: boolean;
  accuracy: number;
  relevance: number;
  userId: string;
  comments?: string;
}

export interface PromptMetrics {
  totalFeedback: number;
  averageAccuracy: number;
  averageRelevance: number;
  helpfulnessRate: number;
  lastUpdated: Date;
}

export interface UserLearningModel {
  userId: string;
  preferredStyles: string[];
  avoidedStyles: string[];
  preferredAbvRange: [number, number];
  preferredIbuRange?: [number, number];
  flavorPreferences: FlavorProfile;
  contextualPatterns: Record<string, any>;
  lastUpdated: Date;
}

// Validation functions
export function validateUserContext(context: UserContext): void {
  if (!context.userId) {
    throw new Error('User ID is required');
  }

  const validMoods: UserMood[] = ['adventurous', 'comfort', 'social', 'contemplative', 'neutral'];
  if (!validMoods.includes(context.currentMood)) {
    throw new Error(`Invalid mood: ${context.currentMood}`);
  }

  if (context.preferences.abvRange[0] >= context.preferences.abvRange[1]) {
    throw new Error('Invalid ABV range: minimum must be less than maximum');
  }

  // Validate flavor profile values
  Object.values(context.preferences.flavorProfile).forEach(value => {
    if (value !== undefined && (value < 0 || value > 10)) {
      throw new Error('Flavor profile values must be between 0 and 10');
    }
  });
}

export function validatePromptTemplate(template: PromptTemplate): void {
  const validTypes: PromptTemplateType[] = ['beer_recommendation', 'taplist_analysis', 'brewery_discovery', 'flavor_matching'];
  if (!validTypes.includes(template.type)) {
    throw new Error(`Invalid template type: ${template.type}`);
  }

  if (!template.basePrompt || template.basePrompt.trim().length === 0) {
    throw new Error('Base prompt cannot be empty');
  }

  const validFactors: ContextualFactor[] = ['mood', 'preferences', 'location', 'weather', 'activity', 'social', 'time'];
  template.contextualFactors.forEach(factor => {
    if (!validFactors.includes(factor)) {
      throw new Error(`Invalid contextual factor: ${factor}`);
    }
  });
}