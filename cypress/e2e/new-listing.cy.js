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
    })
    cy.get('form[data-testid="login-form"]').submit();
    cy.url().should("eq", "https://market.lebl.ca/");
    cy.contains('button', '+').click();
  });

  it("Should load the New Listing page", () => {
    cy.url().should('eq', 'https://market.lebl.ca/new-listing');
    cy.contains("h2", "New Listing").should("be.visible");
  })

  it("Should create a valid listing", () => {
    cy.get('#Listing-Title').type('e2e test listing');
    cy.get('#Listing-Price').type('10');
    cy.get('#Listing-Description').type('e2e test listing description');
    cy.get('button[type="submit"]').click();
    const fileName = 'umbrella.jpg';
    cy.get('input#photoInput').attachFile(fileName);
    cy.url().should("include", "/listing");
  });

  it("Should not create an invalid listing", () => {
    cy.get('button[type="submit"]').click();
    cy.url().should("eq", "https://market.lebl.ca/new-listing");
  });

  afterEach(() => {
    //TODO: DELETE LISTINGS
  })
});
