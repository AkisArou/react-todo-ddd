export class BooleanNumberConverter {
  static fromBooleanToNumber(bool: boolean): number {
    return bool ? 1 : 0;
  }

  static fromNumberToBoolean(num: number): boolean {
    return num === 1;
  }
}
