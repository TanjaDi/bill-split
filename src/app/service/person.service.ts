import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { Color } from 'src/app/model/color.model';
import { Person } from 'src/app/model/person.model';
import { v4 as uuidv4 } from 'uuid';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  initFinished$: Subject<boolean> = new Subject();
  persons: Person[] = [];
  readonly COLORS: Color[] = [
    { name: 'red', value: '#c21943' },
    { name: 'green', value: '#3cb44b' },
    { name: 'lila', value: '#911eb4' },
    { name: 'yellow', value: '#ffe119' },
    { name: 'blue', value: '#256fdf' },
    { name: 'orange', value: '#f58231' },
  ];

  constructor(
    private translateService: TranslateService,
    private localStorageService: LocalStorageService
  ) {
    this.translateService.get('SETTINGS.PAYERS.YOU').subscribe(() => {
      this.persons = this.init();
      this.initFinished$.next(true);
    });
  }

  createNewPerson(name: string, color?: Color): Person {
    if (!color) {
      const lastPersonColor =
        this.persons.length > 0
          ? this.persons[this.persons.length - 1]?.color
          : this.COLORS[0];
      const lastPersonColorIndex = this.COLORS.findIndex(
        (color) => color.name === lastPersonColor.name
      );
      const maxColorIndex = this.COLORS.length - 1;
      const newColorIndex = (lastPersonColorIndex + 1) % maxColorIndex;
      color = this.COLORS[newColorIndex];
    }
    const newPerson: Person = {
      id: uuidv4(),
      name,
      initials: null,
      color,
    };
    return newPerson;
  }

  getPersons(): Person[] {
    return this.persons;
  }

  getPersonName(personId: string): string {
    return (
      this.persons.find((person) => person.id === personId)?.name ?? personId
    );
  }

  savePersons(): void {
    this.updateInitials();
    this.localStorageService.setItem(
      LocalStorageService.SETTINGS_PERSONS,
      JSON.stringify(this.persons)
    );
  }

  private init(): Person[] {
    const personsFromLocalStorage = this.localStorageService.getItem(
      LocalStorageService.SETTINGS_PERSONS
    );
    let persons: Person[] = [];
    if (personsFromLocalStorage !== null) {
      persons = JSON.parse(personsFromLocalStorage);
    }
    if (persons.length === 0) {
      const youInitialValue = this.translateService.instant(
        'SETTINGS.PAYERS.YOU'
      );
      const firstPerson = this.createNewPerson(youInitialValue, this.COLORS[0]);
      persons.push(firstPerson);
    }
    return persons;
  }

  private updateInitials() {
    this.persons.forEach((person, index) => {
      person.initials = this.getInitials(person.name) ?? index + 1 + '';
    });
  }

  private getInitials(name: string): string | null {
    if (name?.trim().length > 0) {
      const names = name.split(' ');
      return names
        .map((name) => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return null;
  }
}
