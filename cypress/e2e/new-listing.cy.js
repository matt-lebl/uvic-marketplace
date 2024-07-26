describe("New Listing", () => {
  beforeEach(() => {
    cy.visit("https://market.lebl.ca/login");
    cy.get('input[name="email"]').type("id7@uvic.ca");
    cy.get('input[name="password"]').type("abcd1234");
    cy.get('input[name="totp_code"]').type("123456");
    cy.get('form[data-testid="login-form"]').submit();
    cy.get("button").eq(5).click();
  });

  it("Should load the New Listing page", () => {
    cy.url().should('include', '/new-listing');
    cy.contains("h2", "New Listing").should("be.visible");
  })

  it("Should create a valid listing", () => {
    cy.get('#Listing-Title').type('e2e test listing');
    cy.get('#Listing-Price').type('10');
    cy.get('#Listing-Description').type('e2e test listing description');
    cy.get('button[type="submit"]').click();
    const fileName = 'umbrella.jpg';
    cy.get('input#photoInput').attachFile(fileName);
  });

  it("Should not create an invalid listing", () => {
    cy.get('button[type="submit"]').click();
    cy.get('#Listing-Title-helper-text')
      .should('be.visible')
      .and('contain.text', 'Title is required');
    cy.get('#Listing-Price-helper-text')
      .should('be.visible')
      .and('contain.text', 'Price is required');
  });

  afterEach(() => {
    //TODO: DELETE LISTINGS
  })
});
