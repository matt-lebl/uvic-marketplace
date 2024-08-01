const email = Cypress.env('e2e_email');
const password = Cypress.env('e2e_password');
const totp_secret = Cypress.env('totp_secret');

describe("Login", () => {
  beforeEach(() => {
    cy.visit("https://market.lebl.ca/login");
  });

  it("Should load the login page", () => {
    cy.contains("h4", "Login").should("be.visible");
  });

  it("Should login successfully with valid credentials", () => {
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.generateTotp(totp_secret).then((totp_code) => {
      cy.get('input[name="totp_code"]').type(totp_code);
    })
    cy.get('form[data-testid="login-form"]').submit();
    cy.url().should("eq", "https://market.lebl.ca/");
    cy.contains("h4", "Recommended Listings").should("be.visible");
  });

  it("Should display an error for wrong credentials", () => {
    cy.window().then((win) => {
      cy.stub(win, "alert").as("alert");
    });
    cy.get('input[name="email"]').type("fakeuser@example.com");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.get('input[name="totp_code"]').type("123456");
    cy.get('form[data-testid="login-form"]').submit();
    cy.get("@alert")
      .should("have.been.calledOnce")
      .and(
        "have.been.calledWithMatch",
        "Login failed: Error"
      );
  });
 
  it('Should logout a user', () => {
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.generateTotp(totp_secret).then((totp_code) => {
      cy.get('input[name="totp_code"]').type(totp_code);
    })
    cy.get('form[data-testid="login-form"]').submit();
    cy.url().should("eq", "https://market.lebl.ca/");
    cy.contains("h4", "Recommended Listings").should("be.visible");
    cy.get('button[data-testid="header-pfp"]').click();
    cy.url().should("eq", "https://market.lebl.ca/profile");

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alert");
    });
    cy.contains('button', 'Logout').click();
    cy.get("@alert")
      .should("have.been.calledOnce")
      .and(
        "have.been.calledWith",
        "Logged out successfully. See you later!"
      );
    cy.url().should("eq", "https://market.lebl.ca/login");
  })
});
