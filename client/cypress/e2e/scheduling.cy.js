/// <reference types="cypress" />

context('Error handling', () => {
  describe('Error getting user', () => {
    before(() => {
      cy.intercept('/api/v1/users/findUserByUrl?url=christian-gawron', { statusCode: 500, body: { error: "no data" } }).as('getUser')
      cy.visit('/schedule/christian-gawron/sprechstunde')
    })

    it('Should show error message', () => {
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.get('.error')
    })
  })
})

context('Scheduling page', () => {
  beforeEach(() => {
    //const now = new Date(2021, 4, 25).getTime()
    cy.clock(Date.UTC(2021, 4, 25), ['Date'])
    cy.intercept('/api/v1/users/findUserByUrl?url=christian-gawron', { fixture: 'userByURL' }).as('getUser')
    cy.intercept('/api/v1/events/getEventBy?user=109150731150582581691&url=sprechstunde', { fixture: 'event' }).as('getEvent')
    cy.intercept('/api/v1/events/getAvailable?*', { fixture: 'available' }).as('getAvailable')
  })

  describe('Visit scheduling page and schedule appointment', () => {
    before(() => {
      cy.intercept('POST', '/api/v1/**', { body: { error: 'not possible' } }).as('apiCheck')
      cy.visit('/schedule/christian-gawron/sprechstunde')
    })

    it('Check simple schedule flow', () => {
      cy.wait(['@getUser', '@getEvent', '@getAvailable'], { timeout: 10000 })
      cy.get('h6').should('contain', 'Christian Gawron')
      cy.get('.MuiPickersDay-today').should('contain', '25')
      cy.contains('07:00').click()
      cy.get('[name=name]').type('Max Mustermann')
      cy.get('[name=email]').type('mustermann.max@fh-swf.de')
      cy.get('form').submit()
      cy.wait('@apiCheck', { timeout: 10000 }).then((interception) => {
        cy.log(interception.request.body)
        assert.equal(interception.request.body.name, 'Max Mustermann')
      })
    })
  })

  describe('Error creating appointment', () => {
    before(() => {
      cy.intercept('POST', '/api/v1/**', { statusCode: 400, body: { error: 'not possible' } }).as('apiCheck')
      cy.visit('/schedule/christian-gawron/sprechstunde')
    })

    it('should show an error message', () => {
      cy.wait(['@getUser', '@getEvent', '@getAvailable'], { timeout: 10000 })
      cy.get('h6').should('contain', 'Christian Gawron')
      cy.get('.MuiPickersDay-today').should('contain', '25')
      cy.contains('07:00').click()
      cy.get('[name=name]').type('Max Mustermann')
      cy.get('[name=email]').type('mustermann.max@fh-swf.de')
      cy.get('form').submit()
      cy.wait('@apiCheck', { timeout: 10000 })
      cy.get('.error')
    })
  })
})
