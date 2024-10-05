/// <reference types="cypress" />

context('Planning page', () => {
  describe('Error getting user', () => {
    before(() => {
      cy.intercept('/api/v1/users/findUserByUrl?url=christian-gawron', { statusCode: 500, body: { error: "no data" } }).as('getUser')
      cy.visit('/users/christian-gawron')
    })

    it('Should show error message', () => {
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.get('.error')
    })
  })
})

context('Planning page', () => {
  beforeEach(() => {
    //const now = new Date(2021, 4, 25).getTime()
    cy.clock(Date.UTC(2024, 9, 4), ['Date'])
    cy.intercept('/api/v1/users/findUserByUrl?url=christian-gawron', { fixture: 'userByURL' }).as('getUser')
    cy.intercept('/api/v1/events/getActiveEvents?user=109150731150582581691', { fixture: 'activeEvents' }).as('getEvent')
    cy.intercept('/api/v1/events/getAvailable?*', { fixture: 'available' }).as('getAvailable')
  })

  describe('Visit scheduling page and schedule appointment', () => {
    before(() => {
      cy.intercept('POST', '/api/v1/**', { body: { error: 'not possible' } }).as('apiCheck')
      cy.visit('/users/christian-gawron')
    })

    it('Check simple schedule flow', () => {
      cy.wait(['@getUser', '@getEvent'], { timeout: 10000 })
    })
  })

})
