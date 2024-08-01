const email = Cypress.env('e2e_email');
const password = Cypress.env('e2e_password');
const totp_secret = Cypress.env('totp_secret');

describe('my-listings', () => {
  beforeEach(() => {
    cy.visit("https://market.lebl.ca/login");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.generateTotp(totp_secret).then((totp_code) => {
      cy.get('input[name="totp_code"]').type(totp_code);
    })
    cy.get('form[data-testid="login-form"]').submit();
    cy.url().should("eq", "https://market.lebl.ca/");
    cy.contains('button', 'My Listings').click();
  });

  it('Should display the My Listings page', () => {
    cy.url().should("eq", "https://market.lebl.ca/profile");
    cy.contains("h4", email).should("be.visible");
  })

  it('Should view a listing', () => {
    cy.get('.MuiCardContent-root').should('be.visible').first().click();
    cy.url().should('include', 'listing');
  })

  it('Should edit a listing', () => {
    cy.get('.MuiCardContent-root').should('be.visible').first().click();
    cy.url().should('include', '/listing/');
    cy.get('[data-testid="EditButton"]').should('be.visible').click();
    cy.url().should('include', 'edit-listing');
    cy.get('#Listing-Description').clear().should('have.value', '').type('Updating Description!');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/listing/');
    cy.contains("p", 'Updating Description!').should("be.visible");
  })

})
