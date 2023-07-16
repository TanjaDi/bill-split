import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PersonService } from 'src/app/service/person.service';
import { PersonGroup } from '../model/person-group.model';

@Component({
  selector: 'bsplit-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PeopleComponent implements OnInit {
  @Input() personIds: string[] = [];
  @Input() selected = false;
  @Output() clickButton: EventEmitter<void>;

  personGroup: PersonGroup;
  personsInitials: string = '';

  constructor(private personService: PersonService) {
    this.clickButton = new EventEmitter();
    this.personGroup = new PersonGroup(
      this.personService.persons.map((f) => f.id)
    );
  }

  ngOnInit(): void {
    this.personGroup = new PersonGroup(this.personIds);
    const persons = this.personIds.map(
      (id) => this.personService.persons.find((person) => person.id === id)!
    );
    this.personsInitials = persons
      .map((f, index) => f.initials ?? index + 1)
      .join(', ');
  }

  onClickButton(): void {
    this.clickButton.emit();
  }

  getPersonColor(personIds: string[]): string {
    if (personIds.length === 1) {
      const index =
        this.personService.persons.findIndex(
          (person) => person.id === personIds[0]
        ) ?? 0;
      return 'color' + index;
    }
    return '';
  }
}
