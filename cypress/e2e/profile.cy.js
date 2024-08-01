const email = Cypress.env('e2e_email');
const password = Cypress.env('e2e_password');
const totp_secret = Cypress.env('totp_secret');

describe('Listings', () => {
  beforeEach(() => {
    cy.visit("https://market.lebl.ca/login");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.generateTotp(totp_secret).then((totp_code) => {
      cy.get('input[name="totp_code"]').type(totp_code);
    });
    cy.get('form[data-testid="login-form"]').submit();
    cy.url().should("eq", "https://market.lebl.ca/");
    cy.get('[data-testid="header-pfp"]').click();
  });

  it('Should display profile page', () => {
    cy.url().should("eq", "https://market.lebl.ca/profile");
    cy.contains("h4", email).should("be.visible");
  })
  
  it('Should edit profile information', () => {
    cy.url().should("eq", "https://market.lebl.ca/profile");
    cy.contains('button', 'Edit').click();
    cy.get('input[type="text"]').eq(1).clear().type('newname');
    cy.contains('button', 'Save').click();
    cy.contains("h6", "newname").should("be.visible");
  })
})
