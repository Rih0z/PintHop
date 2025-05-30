// Custom Cypress commands

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, {
    email,
    password
  }).then((response) => {
    const { accessToken, refreshToken } = response.body.data.tokens;
    window.localStorage.setItem('accessToken', accessToken);
    window.localStorage.setItem('refreshToken', refreshToken);
    cy.visit('/');
  });
});

Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('accessToken');
  window.localStorage.removeItem('refreshToken');
  cy.visit('/');
});

Cypress.Commands.add('createTestUser', () => {
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    username: `testuser${Date.now()}`
  };

  cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, testUser)
    .then(() => testUser);
});

Cypress.Commands.add('seedTestData', () => {
  // Seed breweries if needed
  cy.request('GET', `${Cypress.env('apiUrl')}/breweries`).then((response) => {
    if (response.body.data.length === 0) {
      cy.log('Seeding brewery data...');
      // Run seed command or create test breweries
    }
  });
});

Cypress.Commands.add('cleanupTestData', () => {
  // Cleanup test data after tests
  cy.log('Cleaning up test data...');
});