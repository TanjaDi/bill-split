export class PersonGroup {
  friendIds: string[];

  constructor(friendIds: string[]) {
    this.friendIds = friendIds;
  }

  getFriendIds(): string[] {
    return this.friendIds;
  }

  isOne(): boolean {
    return this.friendIds.length === 1;
  }

  isFriendSelected(friendId: string): boolean {
    const foundIndex = this.friendIds.findIndex(
      (iFriend) => iFriend === friendId
    );
    if (foundIndex > -1) {
      return true;
    }
    return false;
  }

  toggleSelected(friendId: string): void {
    const foundIndex = this.friendIds.findIndex(
      (iFriend) => iFriend === friendId
    );
    if (foundIndex > -1) {
      if (this.isOne() === false) {
        // only allow deselection if there is more than one debtor left
        this.friendIds.splice(foundIndex, 1);
      }
    } else {
      this.friendIds.push(friendId);
      this.friendIds.sort();
    }
  }
}
