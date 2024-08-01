const email = Cypress.env('e2e_email');
const password = Cypress.env('e2e_password');
const totp_secret = Cypress.env('totp_secret');

describe("New Listing", () => {
  beforeEach(() => {
    cy.visit("https://market.lebl.ca/login");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.generateTotp(totp_secret).then((totp_code) => {
      cy.get('input[name="totp_code"]').type(totp_code);
    });
    cy.get('form[data-testid="login-form"]').submit();
    cy.url().should("eq", "https://market.lebl.ca/");
  });

  it("Should show recommendations and view one", () => {
    cy.get('.MuiGrid-root.MuiGrid-item').should('exist');
    cy.get('.MuiGrid-root.MuiGrid-item').first().within(() => {
      cy.get('h6').first().click();
    });
    cy.url().should('include', 'listing');
  })

  it("Should search for a listing and view one", () => {
    cy.get('input[id="Search Field"]').type('umbrella{enter}');
    cy.get('.MuiGrid-root.MuiGrid-item').first().within(() => {
      cy.get('h6').first().click();
    });
    cy.url().should('include', 'listing');
  });

  it("Should filter the listings", () => {
    cy.visit("https://market.lebl.ca/login");
  });

  it("Should change recommendations", () => {
    cy.visit("https://market.lebl.ca/login");
  });
});
