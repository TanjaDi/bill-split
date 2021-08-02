export class PersonGroup {
  personNumbers: number[];

  constructor(personNumbers: number[]) {
    this.personNumbers = personNumbers;
  }

  getPersonIds(): number[] {
    return this.personNumbers;
  }

  getPersonColors(): string[] {
    return this.isOne()
      ? this.personNumbers.map((personNumber) => 'color' + (personNumber - 1))
      : [];
  }

  isOne(): boolean {
    return this.personNumbers.length === 1;
  }

  isPersonSelected(personNumber: number): boolean {
    const foundIndex = this.personNumbers.findIndex(
      (iDebtor) => iDebtor === personNumber
    );
    if (foundIndex > -1) {
      return true;
    }
    return false;
  }

  toggleSelected(personNumber: number): void {
    const foundIndex = this.personNumbers.findIndex(
      (iPerson) => iPerson === personNumber
    );
    if (foundIndex > -1) {
      if (this.isOne() === false) {
        // only allow deselection if there is more than one debtor left
        this.personNumbers.splice(foundIndex, 1);
      }
    } else {
      this.personNumbers.push(personNumber);
      this.personNumbers.sort();
    }
  }
}
