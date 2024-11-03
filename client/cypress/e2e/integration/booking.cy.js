/// <reference types="cypress" />

context('Booking an appointment', () => {
  describe('Open scheduling page', () => {
    before(() => {
      cy.visit('https://appoint.gawron.cloud/users/christian-gawron')
    })

    it('Should show error message', () => {
      cy.get('.MuiButton-textPrimary').click()
      cy.get('.MuiDateCalendar-root').should('be.visible')
    })
  })
})


