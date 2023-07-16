export class PersonGroup {
  personIds: string[];

  constructor(personIds: string[]) {
    this.personIds = personIds;
  }

  getPersonIds(): string[] {
    return this.personIds;
  }

  isOne(): boolean {
    return this.personIds.length === 1;
  }

  isPersonSelected(personId: string): boolean {
    const foundIndex = this.personIds.findIndex(
      (iPerson) => iPerson === personId
    );
    if (foundIndex > -1) {
      return true;
    }
    return false;
  }

  toggleSelected(personId: string): void {
    const foundIndex = this.personIds.findIndex(
      (iPerson) => iPerson === personId
    );
    if (foundIndex > -1) {
      if (this.isOne() === false) {
        // only allow deselection if there is more than one debtor left
        this.personIds.splice(foundIndex, 1);
      }
    } else {
      this.personIds.push(personId);
      this.personIds.sort();
    }
  }
}
