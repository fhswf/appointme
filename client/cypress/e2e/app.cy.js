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

context('Scheduling page', () => {
  beforeEach(() => {
    window.localStorage.setItem('access_token', '"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMDkxNTA3MzExNTA1ODI1ODE2OTEiLCJuYW1lIjoiQ2hyaXN0aWFuIEdhd3JvbiIsImVtYWlsIjoiY2hyaXN0aWFuLmdhd3JvbkBnbWFpbC5jb20iLCJpYXQiOjE3MjgxNDA5NDAsImV4cCI6MTcyODIyNzM0MH0.uTbfQLwteBjXrHfeTelCmLAYxByheMI2Cr2O41D9EsU"')
  })

  describe('Visit app main page', () => {
    before(() => {
      cy.intercept('/api/v1/users/user', { fixture: 'user' }).as('getUser')
      cy.intercept('/api/v1/events/getEvents', { fixture: 'events' }).as('getEvents')
    })

    it('Check simple schedule flow', () => {
      cy.visit('/app')
      cy.wait(['@getUser'], { timeout: 10000 })
      cy.wait(['@getEvents'], { timeout: 10000 })
      cy.get('.MuiFab-primary')
    })
  })


})
