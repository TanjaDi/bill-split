export class DebtorGroup {
  personNumbers: number[];

  constructor(personNumbers: number[]) {
    this.personNumbers = personNumbers;
  }

  getDebtors(): number[] {
    return this.personNumbers;
  }

  getCurrentPayersColorList(): string[] {
    return this.isSingleDebtor()
      ? this.personNumbers.map((personNumber) => 'color' + (personNumber - 1))
      : [];
  }

  isSingleDebtor(): boolean {
    return this.personNumbers.length === 1;
  }

  isPersonDebtor(personNumber: number): boolean {
    const foundIndex = this.personNumbers.findIndex(
      (iDebtor) => iDebtor === personNumber
    );
    if (foundIndex > -1) {
      return true;
    }
    return false;
  }

  toggleDebtor(personNumber: number): void {
    const foundIndex = this.personNumbers.findIndex(
      (iPerson) => iPerson === personNumber
    );
    if (foundIndex > -1) {
      if (this.isSingleDebtor() === false) {
        // only allow deselection if there is more than one payer left
        this.personNumbers.splice(foundIndex, 1);
      }
    } else {
      this.personNumbers.push(personNumber);
      this.personNumbers.sort();
    }
  }
}
