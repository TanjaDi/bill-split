import { PersonGroup } from '../../src/app/model/person-group.model';
import { BillEntry } from './../../src/app/model/billl-entry.model';
import { LocalStorageService } from './../../src/app/service/local-storage.service';

context('Bill', () => {
  describe('empty bill', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should redirect to the bill and have the right title', () => {
      cy.location('pathname').should('equal', '/bill');
      cy.title().should('eq', 'Splify');
    });

    it('should have an actions row with add and split buttons', () => {
      cy.get('.actionsRow')
        .should('have.length', 1)
        .first()
        .should('exist')
        .as('actionsRow');

      cy.get('@actionsRow')
        .find('button')
        .first()
        .find('mat-icon')
        .should('have.text', 'add');

      cy.get('@actionsRow')
        .find('button')
        .last()
        .find('mat-icon')
        .should('have.text', 'call_split');
    });

    it('should have a total row with the sum', () => {
      cy.get('.totalRow')
        .should('have.length', 1)
        .first()
        .should('exist')
        .as('totalRow');

      cy.get('@totalRow')
        .find('.name')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Summe');

      cy.get('@totalRow')
        .find('.price')
        .should('have.length', 1)
        .first()
        .should('contain.text', '0.00');
    });

    it('should have a total + tip row with an edit button', () => {
      cy.get('.totalWithTipRow')
        .should('have.length', 1)
        .first()
        .should('exist')
        .as('totalWithTipRow');

      cy.get('@totalWithTipRow')
        .find('.name')
        .should('have.length', 1)
        .first()
        .should('contain.text', 'Summe mit Trinkgeld');

      cy.get('@totalWithTipRow')
        .find('.price')
        .should('have.length', 1)
        .first()
        .should('contain.text', '0.00');

      cy.get('@totalWithTipRow')
        .find('button')
        .should('have.length', 1)
        .first()
        .find('mat-icon')
        .should('have.text', 'edit');
    });
  });

  describe('new entry dialog', () => {
    beforeEach(() => {
      // open dialog
      cy.get('.addButton').first().click();
    });

    it('should show dialog to add a new entry', () => {
      cy.get('.mat-dialog-container').should('be.visible');

      cy.get('.mat-dialog-container h2').should(
        'contain.text',
        'Neuer Eintrag'
      );
      cy.get('.mat-dialog-container mat-form-field')
        .first()
        .should('be.visible')
        .find('label')
        .should('have.text', 'Name');
      cy.get('.mat-dialog-container mat-form-field')
        .last()
        .should('be.visible')
        .find('label')
        .should('contain.text', 'Preis')
        .and('contain.text', '*');

      cy.get('.mat-dialog-container button').should('have.length', 4);
      cy.get('.mat-dialog-container .okButton').first().should('be.visible');
      // close dialog
      cy.get('.mat-dialog-container .deleteButton')
        .first()
        .should('be.visible')
        .click();
    });

    it('should add new entry', () => {
      cy.get('.mat-dialog-container').should('be.visible');

      cy.get('.mat-dialog-container mat-form-field')
        .first()
        .type('Pizza')
        .find('input')
        .should('have.attr', 'ng-reflect-model', 'Pizza');
      cy.get('.mat-dialog-container mat-form-field')
        .last()
        .type('10.80')
        .find('input')
        .should('have.attr', 'ng-reflect-model', '10.8');

      // close dialog
      cy.get('.mat-dialog-container .okButton').first().click();

      cy.get('.dataRow')
        .find('.name')
        .should('have.length', 1)
        .first()
        .should('contain.text', 'Pizza');
      cy.get('.dataRow')
        .find('.price')
        .should('have.length', 1)
        .first()
        .should('contain.text', '10.80');

      cy.get('.totalRow')
        .find('.price')
        .should('have.length', 1)
        .first()
        .should('contain.text', '10.80');
    });
  });

  describe('load bill from local storage', () => {
    beforeEach(() => {
      const billEntries: BillEntry[] = [
        {
          id: '1',
          price: 9.9,
          currency: 'EUR',
          name: 'Pizza Vegetaria',
          debtors: new PersonGroup([2]),
        },
        {
          id: '2',
          price: 6.6,
          currency: 'EUR',
          name: 'Coca Cola Zero',
          debtors: new PersonGroup([1, 2]),
        },
        {
          id: '3',
          price: 9.7,
          currency: 'EUR',
          name: 'Pizza Funghi',
          debtors: new PersonGroup([1]),
        },
      ];
      cy.visit('/');
      cy.log('set local storage: ' + billEntries);
      window.localStorage.setItem(
        LocalStorageService.PREFIX + LocalStorageService.CURRENT_BILL,
        JSON.stringify(billEntries)
      );
    });

    it('should show bill entries from local storage', () => {
      cy.get('.dataRow')
        .eq(0)
        .find('.name')
        .first()
        .should('contain.text', 'Pizza Vegetaria');
      cy.get('.dataRow')
        .eq(0)
        .find('.price')
        .first()
        .should('contain.text', '9.90');

      cy.get('.dataRow')
        .eq(1)
        .find('.name')
        .first()
        .should('contain.text', 'Coca Cola Zero');
      cy.get('.dataRow')
        .eq(1)
        .find('.price')
        .first()
        .should('contain.text', '6.60');

      cy.get('.dataRow')
        .eq(2)
        .find('.name')
        .first()
        .should('contain.text', 'Pizza Funghi');
      cy.get('.dataRow')
        .eq(2)
        .find('.price')
        .first()
        .should('contain.text', '9.70');

      cy.get('.totalRow')
        .find('.price')
        .should('have.length', 1)
        .first()
        .should('contain.text', '26.20');

      cy.get('.totalWithTipRow')
        .find('.price')
        .should('have.length', 1)
        .first()
        .should('contain.text', '28.00');
    });
  });
});
