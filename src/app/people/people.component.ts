import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PersonGroup } from '../model/person-group.model';

@Component({
  selector: 'bsplit-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PeopleComponent implements OnInit {
  @Input() peopleIds: number[] = [];
  @Input() selected = false;
  @Input() iconOnly = false;
  @Output() clickButton: EventEmitter<void>;

  personGroup: PersonGroup = new PersonGroup([1]);

  constructor() {
    this.clickButton = new EventEmitter();
  }

  ngOnInit(): void {
    this.personGroup = new PersonGroup(this.peopleIds);
  }

  onClickButton(): void {
    this.clickButton.emit();
  }
}
