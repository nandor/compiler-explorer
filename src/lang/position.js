
export class Location {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  toString() {
    return `${this.row},${this.col}`
  }
}

export class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  toString() {
    return `${this.start}-${this.end}`
  }
}
