import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Color } from 'src/app/model/color.model';
import { Friend } from 'src/app/model/friend.model';
import { v4 as uuidv4 } from 'uuid';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  friends: Friend[];
  private subscription: Subscription;
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
    this.subscription = new Subscription();
    this.friends = this.initFriends();
  }

  createNewFriend(name: string, color?: Color): Friend {
    if (!color) {
      const lastFriendColor =
        this.friends.length > 0
          ? this.friends[this.friends.length - 1]?.color
          : this.COLORS[0];
      const lastFriendColorIndex = this.COLORS.findIndex(
        (color) => color.name === lastFriendColor.name
      );
      const maxColorIndex = this.COLORS.length - 1;
      const newColorIndex = (lastFriendColorIndex + 1) % maxColorIndex;
      color = this.COLORS[newColorIndex];
    }
    const newFriend: Friend = {
      id: uuidv4(),
      name,
      initials: null,
      color,
    };
    return newFriend;
  }

  getFriends(): Friend[] {
    return this.friends;
  }

  saveFriends(): void {
    this.updateInitials();
    this.localStorageService.setItem(
      LocalStorageService.SETTINGS_FRIENDS,
      JSON.stringify(this.friends)
    );
  }

  private initFriends(): Friend[] {
    const friendsFromLocalStorage = this.localStorageService.getItem(
      LocalStorageService.SETTINGS_FRIENDS
    );
    let friends: Friend[] = [];
    if (friendsFromLocalStorage !== null) {
      friends = JSON.parse(friendsFromLocalStorage);
    }
    if (friends.length === 0) {
      const firstPerson = this.createNewFriend(
        this.translateService.instant('SETTINGS.PAYERS.YOU'),
        this.COLORS[0]
      );
      friends.push(firstPerson);
    }
    return friends;
  }

  private updateInitials() {
    this.friends.forEach((friend, index) => {
      friend.initials = this.getInitials(friend.name) ?? index + 1 + '';
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
