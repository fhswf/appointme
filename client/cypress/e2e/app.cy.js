/// <reference types="cypress" />

context('User not logged in', () => {
  describe('Error getting user', () => {
    before(() => {
      cy.intercept('/api/v1/users/user', {
        statusCode: 200, body: { "success": false, "message": "Unauthorized! Sign in again!" }
      }).as('getUser')
      window.localStorage.setItem('access_token', '"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMDkxNTA3MzExNTA1ODI1ODE2OTEiLCJuYW1lIjoiQ2hyaXN0aWFuIEdhd3JvbiIsImVtYWlsIjoiY2hyaXN0aWFuLmdhd3JvbkBnbWFpbC5jb20iLCJpYXQiOjE3MjgxNDA5NDAsImV4cCI6MTcyODIyNzM0MH0.uTbfQLwteBjXrHfeTelCmLAYxByheMI2Cr2O41D9EsU"')
      cy.visit('/app')
    })

    it('Should redirect to landing', () => {
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.location('pathname').should('eq', '/landing')
    })
  })
})

context('Main page', () => {
  beforeEach(() => {
    window.localStorage.setItem('access_token', '"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMDkxNTA3MzExNTA1ODI1ODE2OTEiLCJuYW1lIjoiQ2hyaXN0aWFuIEdhd3JvbiIsImVtYWlsIjoiY2hyaXN0aWFuLmdhd3JvbkBnbWFpbC5jb20iLCJpYXQiOjE3MjgxNDA5NDAsImV4cCI6MTcyODIyNzM0MH0.uTbfQLwteBjXrHfeTelCmLAYxByheMI2Cr2O41D9EsU"')
  })

  describe('Visit app main page & add event type', () => {
    before(() => {
      cy.intercept('/api/v1/users/user', { fixture: 'user' }).as('getUser')
      cy.intercept('/api/v1/events/getEvents', { fixture: 'events' }).as('getEvents')
    })

    it('Check add event type', () => {
      cy.visit('/app')
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.wait(['@getEvents'], { timeout: 10000 })
      cy.get('[data-testid="add-event-button"]').click()
      cy.get('[data-testid="event-form-title"]').type('Test event')
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
      cy.intercept('/api/v1/events/getEvent/66e41e641f4f81ece1828ab5', { fixture: 'sprechstunde' }).as('getEvent')
    })

    it('Check log out', () => {
      cy.visit('/app')
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.wait(['@getEvents'], { timeout: 10000 })
      cy.get('[data-testid="profile-menu"]').click()
      cy.get('[data-testid="calendar-button"]').click()
      cy.location('pathname').should('eq', '/integration')
    })
  })

})
