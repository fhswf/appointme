/// <reference types="cypress" />

context('User not logged in', () => {
  describe('Error getting user', () => {
    beforeEach(() => {
      cy.intercept('/api/v1/users/user', {
        statusCode: 200, body: { "success": false, "message": "Unauthorized! Sign in again!" }
      }).as('getUser')
      cy.intercept('https://accounts.google.com/gsi/button', {
        statusCode: 200, body: {}
      }).as('googleButton')

      cy.visit('/app')
    })

    it('Should redirect to landing', () => {
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.location('pathname').should('eq', '/landing')
    })

    it('should show login button', () => {
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.location('pathname').should('eq', '/landing')
      cy.get('[data-testid="profile-menu"]').click()
      cy.get('[data-testid="login-button"]').click()
      cy.get('iframe').should('exist')
    })
  })
})

context('Main page', () => {
  beforeEach(() => {
  })

  describe('Visit app main page & add event type', () => {
    before(() => {
      cy.intercept('/api/v1/users/user', { fixture: 'user' }).as('getUser')
      cy.intercept('/api/v1/events/getEvents', { fixture: 'events' }).as('getEvents')
      cy.intercept('/api/v1/events/addEvent', { fixture: 'addEvent' }).as('addEvent')
    })

    it('Check add event type', () => {
      cy.visit('/app')
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.wait(['@getEvents'], { timeout: 10000 })
      cy.get('[data-testid="add-event-button"]').click()
      cy.get('[data-testid="event-form-title"]').type('Test event')
      cy.get('[data-testid="event-form-submit"]').click()
      cy.wait(['@addEvent'], { timeout: 10000 })
    })
  })

  describe('Visit app main page & edit event type', () => {
    before(() => {
      cy.intercept('/api/v1/users/user', { fixture: 'user' }).as('getUser')
      cy.intercept('/api/v1/events/getEvents', { fixture: 'events' }).as('getEvents')
      cy.intercept('/api/v1/events/getEvent/66e41e641f4f81ece1828ab5', { fixture: 'sprechstunde' }).as('getEvent')
    })

    it('Check edit event type', () => {
      cy.visit('/app')
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.wait(['@getEvents'], { timeout: 10000 })
      cy.get('[data-testid="edit-event-button"]').click()
      cy.wait(['@getEvent'], { timeout: 10000 })
      cy.get('[data-testid="event-form-title"] input').should('have.value', 'Sprechstunde')
    })
  })

  describe('Visit app main page & log out', () => {
    before(() => {
      cy.intercept('/api/v1/users/user', { fixture: 'user' }).as('getUser')
      cy.intercept('/api/v1/events/getEvents', { fixture: 'events' }).as('getEvents')
      cy.intercept('/api/v1/events/getEvent/66e41e641f4f81ece1828ab5', { fixture: 'sprechstunde' }).as('getEvent')
    })

    it('Check log out', () => {
      cy.visit('/app')
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.wait(['@getEvents'], { timeout: 10000 })
      cy.get('[data-testid="profile-menu"]').click()
      cy.get('[data-testid="logout-button"]').click()
      cy.location('pathname').should('eq', '/landing')
    })
  })

  describe('Visit app main page & open calendar integration', () => {
    before(() => {
      cy.intercept('/api/v1/users/user', { fixture: 'user' }).as('getUser')
      cy.intercept('/api/v1/events/getEvents', { fixture: 'events' }).as('getEvents')
      cy.intercept('/api/v1/google/calendarList', { fixture: 'calendarList' }).as('calendarList')
    })

    it('Check log out', () => {
      cy.visit('/app')
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.wait(['@getEvents'], { timeout: 10000 })
      cy.get('[data-testid="profile-menu"]').click()
      cy.get('[data-testid="calendar-button"]').click()
      cy.location('pathname').should('eq', '/integration')
      cy.wait(['@calendarList'], { timeout: 10000 })
    })
  })

})
