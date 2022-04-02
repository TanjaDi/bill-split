import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FriendService } from 'src/app/service/friend.service';
import { PersonGroup } from '../model/person-group.model';

@Component({
  selector: 'bsplit-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PeopleComponent implements OnInit {
  @Input() friendIds: string[] = [];
  @Input() selected = false;
  @Output() clickButton: EventEmitter<void>;

  personGroup: PersonGroup;
  friendsInitials: string = '';

  constructor(private friendService: FriendService) {
    this.clickButton = new EventEmitter();
    this.personGroup = new PersonGroup(
      this.friendService.friends.map((f) => f.id)
    );
  }

  ngOnInit(): void {
    this.personGroup = new PersonGroup(this.friendIds);
    const friends = this.friendIds.map(
      (id) => this.friendService.friends.find((friend) => friend.id === id)!
    );
    this.friendsInitials = friends
      .map((f, index) => f.initials ?? index + 1)
      .join(', ');
  }

  onClickButton(): void {
    this.clickButton.emit();
  }

  getFriendColor(friendIds: string[]): string {
    if (friendIds.length === 1) {
      const index =
        this.friendService.friends.findIndex(
          (friend) => friend.id === friendIds[0]
        ) ?? 0;
      return 'color' + index;
    }
    return '';
  }
}
