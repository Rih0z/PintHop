/**
 * Breweries E2E tests
 */

describe('Breweries', () => {
  beforeEach(() => {
    cy.seedTestData();
    cy.createTestUser().then((user) => {
      cy.login(user.email, user.password);
    });
  });

  describe('Map View', () => {
    beforeEach(() => {
      cy.visit('/map');
    });

    it('should display map with brewery markers', () => {
      // Map should be visible
      cy.get('.leaflet-container').should('be.visible');

      // Should have brewery markers
      cy.get('.leaflet-marker-icon').should('have.length.greaterThan', 0);
    });

    it('should show brewery details on marker click', () => {
      // Click on a brewery marker
      cy.get('.leaflet-marker-icon').first().click();

      // Should show popup with brewery info
      cy.get('.leaflet-popup').should('be.visible');
      cy.get('.leaflet-popup-content').within(() => {
        cy.get('h3').should('exist'); // Brewery name
        cy.contains('Check in').should('be.visible');
      });
    });

    it('should allow checking in at a brewery', () => {
      // Click on a brewery marker
      cy.get('.leaflet-marker-icon').first().click();

      // Click check-in button
      cy.get('.leaflet-popup-content').within(() => {
        cy.contains('Check in').click();
      });

      // Should show success message or update UI
      cy.contains('Checked in successfully').should('be.visible');
    });

    it('should update presence count in real-time', () => {
      // Initial presence count
      cy.get('.leaflet-marker-icon').first().click();
      
      let initialCount = 0;
      cy.get('.leaflet-popup-content').then(($popup) => {
        const text = $popup.text();
        const match = text.match(/(\d+) people? here now/);
        if (match) {
          initialCount = parseInt(match[1]);
        }
      });

      // Check in
      cy.get('.leaflet-popup-content').within(() => {
        cy.contains('Check in').click();
      });

      // Presence count should increase
      cy.get('.leaflet-marker-icon').first().click();
      cy.get('.leaflet-popup-content').should('contain', `${initialCount + 1} people here now`);
    });
  });

  describe('Brewery List', () => {
    it('should display list of breweries', () => {
      cy.visit('/breweries');

      // Should show brewery cards
      cy.get('[data-testid="brewery-card"]').should('have.length.greaterThan', 0);

      // Each card should have brewery info
      cy.get('[data-testid="brewery-card"]').first().within(() => {
        cy.get('h3').should('exist'); // Brewery name
        cy.contains('Seattle, Washington').should('exist');
      });
    });

    it('should filter breweries by search', () => {
      cy.visit('/breweries');

      // Type in search box
      cy.get('input[placeholder="Search breweries..."]').type('Fremont');

      // Should filter results
      cy.get('[data-testid="brewery-card"]').should('have.length.greaterThan', 0);
      cy.get('[data-testid="brewery-card"]').each(($card) => {
        cy.wrap($card).should('contain.text', 'Fremont');
      });
    });

    it('should navigate to brewery details', () => {
      cy.visit('/breweries');

      // Click on a brewery card
      cy.get('[data-testid="brewery-card"]').first().click();

      // Should navigate to brewery details page
      cy.url().should('match', /\/breweries\/[a-zA-Z0-9]+$/);

      // Should show brewery details
      cy.get('h1').should('exist'); // Brewery name
      cy.contains('Address').should('be.visible');
      cy.contains('Website').should('be.visible');
    });
  });

  describe('Brewery Details', () => {
    it('should display brewery information', () => {
      // Get first brewery ID
      cy.request('GET', `${Cypress.env('apiUrl')}/breweries`).then((response) => {
        const brewery = response.body.data[0];
        cy.visit(`/breweries/${brewery._id}`);

        // Should show brewery details
        cy.get('h1').should('contain', brewery.name);
        cy.contains(brewery.city).should('be.visible');
        
        if (brewery.websiteUrl) {
          cy.contains('Website').should('be.visible');
        }

        // Should show ratings if available
        if (brewery.ratings?.untappd) {
          cy.contains('Untappd').should('be.visible');
        }
      });
    });

    it('should show current presence at brewery', () => {
      cy.request('GET', `${Cypress.env('apiUrl')}/breweries`).then((response) => {
        const brewery = response.body.data[0];
        cy.visit(`/breweries/${brewery._id}`);

        // Should show presence section
        cy.contains('Who\'s here').should('be.visible');
        
        // Should show presence count
        cy.get('[data-testid="presence-count"]').should('exist');
      });
    });

    it('should allow checking in from details page', () => {
      cy.request('GET', `${Cypress.env('apiUrl')}/breweries`).then((response) => {
        const brewery = response.body.data[0];
        cy.visit(`/breweries/${brewery._id}`);

        // Click check-in button
        cy.contains('Check in here').click();

        // Should show success
        cy.contains('Checked in successfully').should('be.visible');

        // Should update presence list
        cy.get('[data-testid="presence-list"]').should('contain', 'You');
      });
    });
  });

  describe('Nearby Breweries', () => {
    it('should request location permission', () => {
      cy.visit('/map');

      // Click "Find nearby" button
      cy.contains('Find nearby breweries').click();

      // Should show location permission request
      // Note: Actual geolocation requires special Cypress config
      cy.on('window:alert', (text) => {
        expect(text).to.contains('location');
      });
    });

    it('should show nearby breweries when location is available', () => {
      // Mock geolocation
      cy.visit('/map', {
        onBeforeLoad(win) {
          cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb) => {
            cb({
              coords: {
                latitude: 47.6062,
                longitude: -122.3321,
                accuracy: 100
              },
              timestamp: Date.now()
            });
          });
        }
      });

      // Click "Find nearby" button
      cy.contains('Find nearby breweries').click();

      // Should show nearby breweries
      cy.contains('Nearby Breweries').should('be.visible');
      cy.get('[data-testid="nearby-brewery"]').should('have.length.greaterThan', 0);
    });
  });
});