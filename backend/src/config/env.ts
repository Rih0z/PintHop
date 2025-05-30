import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  CORS_ORIGIN: string;
}

class EnvValidator {
  private static instance: EnvConfig | null = null;

  static get(): EnvConfig {
    if (!this.instance) {
      this.instance = this.validate();
    }
    return this.instance;
  }

  private static validate(): EnvConfig {
    const requiredVars = [
      'NODE_ENV',
      'PORT',
      'MONGODB_URI',
      'JWT_SECRET',
      'JWT_EXPIRES_IN',
      'JWT_REFRESH_EXPIRES_IN',
      'CORS_ORIGIN'
    ];

    // Check for missing required variables
    const missing = requiredVars.filter(varName => !process.env[varName]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Validate NODE_ENV
    const nodeEnv = process.env.NODE_ENV as string;
    if (!['development', 'test', 'production'].includes(nodeEnv)) {
      throw new Error('NODE_ENV must be one of: development, test, production');
    }

    // Validate PORT
    const port = parseInt(process.env.PORT as string, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      throw new Error('PORT must be a valid number between 1 and 65535');
    }

    // Validate JWT_SECRET length
    if ((process.env.JWT_SECRET as string).length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long');
    }

    return {
      NODE_ENV: nodeEnv as 'development' | 'test' | 'production',
      PORT: port,
      MONGODB_URI: process.env.MONGODB_URI as string,
      JWT_SECRET: process.env.JWT_SECRET as string,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
      JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
      CORS_ORIGIN: process.env.CORS_ORIGIN as string
    };
  }
}

export const env = EnvValidator.get();