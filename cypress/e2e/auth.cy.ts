/**
 * Authentication E2E tests
 */

describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Registration', () => {
    it('should register a new user', () => {
      // Navigate to register page
      cy.visit('/register');

      // Fill registration form
      const timestamp = Date.now();
      const testUser = {
        username: `testuser${timestamp}`,
        email: `test${timestamp}@example.com`,
        password: 'password123'
      };

      cy.get('input[name="username"]').type(testUser.username);
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('input[name="confirmPassword"]').type(testUser.password);

      // Submit form
      cy.get('button[type="submit"]').click();

      // Should redirect to timeline after successful registration
      cy.url().should('include', '/timeline');
      
      // Should show authenticated state
      cy.contains('Logout').should('be.visible');
    });

    it('should show error for duplicate email', () => {
      // First create a user
      cy.createTestUser().then((user) => {
        cy.visit('/register');

        cy.get('input[name="username"]').type('newusername');
        cy.get('input[name="email"]').type(user.email);
        cy.get('input[name="password"]').type('password123');
        cy.get('input[name="confirmPassword"]').type('password123');

        cy.get('button[type="submit"]').click();

        // Should show error message
        cy.contains('already exists').should('be.visible');
      });
    });

    it('should validate password confirmation', () => {
      cy.visit('/register');

      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('differentpassword');

      cy.get('button[type="submit"]').click();

      // Should show error message
      cy.contains('Passwords do not match').should('be.visible');
    });
  });

  describe('Login', () => {
    let testUser: { email: string; password: string; username: string };

    before(() => {
      cy.createTestUser().then((user) => {
        testUser = user;
      });
    });

    it('should login with valid credentials', () => {
      cy.visit('/login');

      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);

      cy.get('button[type="submit"]').click();

      // Should redirect to timeline
      cy.url().should('include', '/timeline');
      
      // Should show authenticated state
      cy.contains('Logout').should('be.visible');
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/login');

      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type('wrongpassword');

      cy.get('button[type="submit"]').click();

      // Should show error message
      cy.contains('Invalid email or password').should('be.visible');
      
      // Should stay on login page
      cy.url().should('include', '/login');
    });

    it('should redirect to requested page after login', () => {
      // Try to visit protected route
      cy.visit('/map');

      // Should redirect to login
      cy.url().should('include', '/login');

      // Login
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('button[type="submit"]').click();

      // Should redirect to originally requested page
      cy.url().should('include', '/map');
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      cy.createTestUser().then((user) => {
        cy.login(user.email, user.password);
      });
    });

    it('should logout successfully', () => {
      // Should be on timeline page and authenticated
      cy.url().should('include', '/timeline');
      cy.contains('Logout').should('be.visible');

      // Click logout
      cy.contains('Logout').click();

      // Should redirect to login
      cy.url().should('include', '/login');

      // Try to visit protected route
      cy.visit('/timeline');

      // Should redirect back to login
      cy.url().should('include', '/login');
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to login when not authenticated', () => {
      cy.logout();

      // Try to visit protected routes
      const protectedRoutes = ['/timeline', '/map'];

      protectedRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', '/login');
      });
    });

    it('should allow access when authenticated', () => {
      cy.createTestUser().then((user) => {
        cy.login(user.email, user.password);

        // Should be able to visit protected routes
        const protectedRoutes = ['/timeline', '/map'];

        protectedRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', route);
        });
      });
    });
  });
});