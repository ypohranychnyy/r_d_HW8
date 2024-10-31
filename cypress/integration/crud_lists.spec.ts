/// <reference types="cypress" />

describe('ClickUp CRUD Tests for Lists', () => {
    let listId;

    it('should create a list', () => {
        const uniqueName = `Test List ${Date.now()}`;
        cy.request({
            method: 'POST',
            url: `${Cypress.env('BASE_URL')}/folder/${Cypress.env('CLICKUP_FOLDER_ID')}/list`,
            headers: {
                Authorization: Cypress.env('CLICKUP_API_TOKEN'),
                'Content-Type': 'application/json',
            },
            body: {
                name: uniqueName,
                content: 'This is a test list',
                due_date: null,
                due_date_time: false,
                priority: null,
            },
        }).then((response) => {
            expect(response.status).to.equal(200);
            listId = response.body.id;
        });
    });

    it('should get the list', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('BASE_URL')}/list/${listId}`,
            headers: {
                Authorization: Cypress.env('CLICKUP_API_TOKEN'),
            },
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.id).to.equal(listId);
        });
    });

    it('should update the list', () => {
        const updatedName = `Updated List ${Date.now()}`;
        cy.request({
            method: 'PUT',
            url: `${Cypress.env('BASE_URL')}/list/${listId}`,
            headers: {
                Authorization: Cypress.env('CLICKUP_API_TOKEN'),
                'Content-Type': 'application/json',
            },
            body: {
                name: updatedName,
                content: 'This list has been updated',
                due_date: null,
                due_date_time: false,
                priority: 2,
            },
        }).then((response) => {
            expect(response.status).to.equal(200);
        });
    });

    it('should delete the list', () => {
        cy.request({
            method: 'DELETE',
            url: `${Cypress.env('BASE_URL')}/list/${listId}`,
            headers: {
                Authorization: Cypress.env('CLICKUP_API_TOKEN'),
            },
        }).then((response) => {
            expect(response.status).to.equal(200);
        });
    });
});