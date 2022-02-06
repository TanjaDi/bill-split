import * as billEntries from '../fixtures/billEntries.json';
import { LocalStorageService } from './../../src/app/service/local-storage.service';

context('Performance', () => {
  it('page load on the start page (empty bill)', () => {
    cy.visit('/', {
      onBeforeLoad: (cyWindow) => {
        cyWindow.performance.mark('start-loading');
      },
    })
      .its('performance')
      .then((performance) => {
        cy.get('.actionsRow .addButton mat-icon')
          .first()
          .should('have.text', 'add')
          .then(() => performance.mark('end-loading'))
          .then(() => {
            const measureName = 'pageLoad';
            performance.measure(measureName, 'start-loading', 'end-loading');
            // Retrieve the timestamp we just created
            const measure = performance.getEntriesByName(measureName)[0];
            // This is the total amount of time (in milliseconds) between the start and end
            assert.isAtMost(measure.duration, 5000);
            cy.log(
              `[PERFORMANCE] ${Cypress.currentTest.title}: ${Number(
                measure.duration / 1000
              ).toFixed(3)} seconds`
            );
          });
      });
  });

  it('page load on the start page with existing bill', () => {
    cy.visit('/', {
      onBeforeLoad: (cyWindow) => {
        window.localStorage.setItem(
          LocalStorageService.PREFIX + LocalStorageService.CURRENT_BILL,
          JSON.stringify(billEntries)
        );
        cyWindow.performance.mark('start-loading');
      },
    })
      .its('performance')
      .then((performance) => {
        cy.get('.actionsRow .addButton mat-icon')
          .first()
          .should('have.text', 'add')
          .then(() => performance.mark('end-loading'))
          .then(() => {
            const measureName = 'pageLoad';
            performance.measure(measureName, 'start-loading', 'end-loading');
            // Retrieve the timestamp we just created
            const measure = performance.getEntriesByName(measureName)[0];
            // This is the total amount of time (in milliseconds) between the start and end
            assert.isAtMost(measure.duration, 5000);
            cy.log(
              `[PERFORMANCE] ${Cypress.currentTest.title}: ${Number(
                measure.duration / 1000
              ).toFixed(3)} seconds`
            );
          });
      });
  });

    it("opening 'new entry' dialog", () => {
      cy.visit('/');
      cy.get('.addButton')
        .first()
        .click()
        .then(() => {
          window.performance.mark('button-click');
        });

      cy.get('.mat-dialog-container .okButton')
        .then(() => performance.mark('dialog-displayed'))
        .then(() => {
          const measureName = 'openingDialog';
          performance.measure(measureName, 'button-click', 'dialog-displayed');
          const measure = performance.getEntriesByName(measureName)[0];
          // This is the total amount of time (in milliseconds) between the start and end
          assert.isAtMost(measure.duration, 5000);
          cy.log(
            `[PERFORMANCE] ${Cypress.currentTest.title}: ${Number(
              measure.duration / 1000
            ).toFixed(3)} seconds`
          );
        });
    });
});
