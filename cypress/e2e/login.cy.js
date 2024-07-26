describe("Login", () => {
  beforeEach(() => {
    cy.visit("https://market.lebl.ca/login");
  });

  it("Should load the login page", () => {
    cy.contains("h4", "Login").should("be.visible");
  });

  //Note: If id7@uvic.ca test user was removed from db the test will fail
  it("Should login successfully with valid credentials", () => {
    cy.window().then((win) => {
      cy.stub(win, "alert").as("alert");
    });

    cy.get('input[name="email"]').type("id7@uvic.ca");
    cy.get('input[name="password"]').type("abcd1234");
    cy.get('input[name="totp_code"]').type("123456");
    cy.get('form[data-testid="login-form"]').submit();

    cy.get("@alert")
      .should("have.been.calledOnce")
      .and("have.been.calledWith", "Login successful.")
      .then(() => {
        cy.url().should("eq", "https://market.lebl.ca/");
      });
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
        "have.been.calledWith",
        "Login failed: Error: Request failed with status code 500"
      );
  });
  //TODO: implement
  it('Should logout a user', () => {
    cy.visit('https://market.lebl.ca/login')
  })
  
  it('Should Delete a User', () => {
    cy.visit('https://market.lebl.ca/login')
  })
});
