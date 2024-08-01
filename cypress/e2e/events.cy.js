const email = Cypress.env('e2e_email');
const password = Cypress.env('e2e_password');
const totp_secret = Cypress.env('totp_secret');

describe('Events', () => {
  beforeEach(() => {
    cy.visit("https://market.lebl.ca/login");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.generateTotp(totp_secret).then((totp_code) => {
      cy.get('input[name="totp_code"]').type(totp_code);
    })
    cy.get('form[data-testid="login-form"]').submit();
    cy.url().should("eq", "https://market.lebl.ca/");
    cy.contains('button', 'Events').click();
  });

  it('Should display events', () => {
    cy.url().should("eq", "https://market.lebl.ca/events");
    cy.wait(3000); 
    cy.contains("h4", "Charity Events").should("be.visible");
  })

})
