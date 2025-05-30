// ***********************************************************
// This file is processed and loaded automatically before test files.
// ***********************************************************

import './commands';

// Cypress commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      createTestUser(): Chainable<{
        email: string;
        password: string;
        username: string;
      }>;
      seedTestData(): Chainable<void>;
      cleanupTestData(): Chainable<void>;
    }
  }
}

// Prevent TypeScript errors
export {};