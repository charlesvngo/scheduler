describe("Appointments", () => {

  beforeEach(() => {
    // Reset the database before each test
    cy.request("/api/debug/reset")

    // Render the homepage
    cy.visit("/");
    cy.contains("Monday");
  })

  it("should book an interview", () => {

    // Clicks on the "Add" button in the second appointment
    cy.get(':nth-child(2) > .appointment__add > .appointment__add-button')
      .click();

    // Enters their name
    cy.get('[data-testid="student-name-input"]')
      .type("Lydia Miller-Jones");

    // Chooses an interviewer
    cy.get(':nth-child(1) > .interviewers__item-image')
      .click();

    // Clicks the save button
    cy.get('.button--confirm')
      .click();

    // Sees the booked appointment
    cy.contains(".appointment__card--show", "Archie Cohen");
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");

  });

  it("should edit an existing interview", () => {
    // Clicks the edit button for the existing appointment
    cy.get("[alt=Edit]")
      .first()
      .click({ force: true });

    // Changes the name and interviewer
    cy.get('[data-testid="student-name-input"]')
      .clear()
      .type("Lydia Miller-Jones");
    cy.get(':nth-child(2) > .interviewers__item-image')
      .click();

    // Clicks the save button
    cy.get('.button--confirm')
      .click();

    // Sees the edit to the appointment
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
  });
  
  it("should cancel an existing interview", () => {
    // Clicks the delete button for the existing appointment
    cy.get("[alt=Delete]")
      .first()
      .click({ force: true });

    // Clicks the confirm button
    cy.get('.appointment__actions > :nth-child(2)')
      .click()

    // Check to see if the deleting card is present and if it goes away
    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");

    // Sees that the appointment slot is empty
    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  });
  
});
