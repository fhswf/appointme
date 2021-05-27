/// <reference types="cypress" />

context('Schedule page', () => {
    beforeEach(() => {
        //const now = new Date(2021, 5, 25).getTime()
        cy.clock(Date.UTC(2021, 5, 25), ['Date'])
        cy.intercept('/bookme/api/v1/users/findUserByUrl?url=christian-gawron', { fixture: 'userByURL' }).as('getUser')
        cy.intercept('/bookme/api/v1/events/getEventBy?user=109150731150582581691&url=test_5', { fixture: 'event' }).as('getEvent')
        cy.visit('https://jupiter.fh-swf.de/bookme/schedule/christian-gawron/test_5')
    })


    describe('Visit scheduling page', () => {
        it('Check basic elements', () => {
            cy.wait(['@getUser', '@getEvent'])
            cy.get('h6').should('contain', 'Christian Gawron')
            cy.get('.MuiPickersDay-today').should('contain', '25')
        })
    })
})