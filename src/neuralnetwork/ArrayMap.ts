export class ArrayMap {
  private rows: number;
  private cols: number;
  private data: number[][];

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.data = Array<number>(this.rows)
      .fill(0, 0, this.rows)
      .map(() => Array<number>(this.cols).fill(0));
  }

  copy() {
    let m = new ArrayMap(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        m.data[i][j] = this.data[i][j];
      }
    }
    return m;
  }

  static fromArray(arr: number[]) {
    return new ArrayMap(arr.length, 1).map((e: number, i: number) => arr[i]);
  }

  static subtract(a: ArrayMap, b: ArrayMap) {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      console.error("Columns and Rows of A must match Columns and Rows of B.");
      return;
    }

    // Return a new Matrix a-b
    return new ArrayMap(a.rows, a.cols).map(
      (_: any, i: number, j: number) => a.data[i][j] - b.data[i][j]
    );
  }

  toArray() {
    let arr = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  randomize() {
    return this.map((e: any) => Math.random() * 2 - 1);
  }

  add(n: ArrayMap) {
    if (n instanceof ArrayMap) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.error(
          "Columns and Rows of A must match Columns and Rows of B."
        );
        return;
      }
      return this.map((e: number, i: number, j: number) => e + n.data[i][j]);
    } else {
      return this.map((e: number) => e + n);
    }
  }

  static transpose(matrix: ArrayMap) {
    return new ArrayMap(matrix.cols, matrix.rows).map(
      (_: any, i: number, j: number) => matrix.data[j][i]
    );
  }

  static multiply(a: ArrayMap, b: ArrayMap) {
    // Matrix product
    if (a.cols !== b.rows) {
      console.error("Columns of A must match rows of B.");
      return;
    }

    return new ArrayMap(a.rows, b.cols).map((e: any, i: number, j: number) => {
      // Dot product of values in col
      let sum = 0;
      for (let k = 0; k < a.cols; k++) {
        sum += a.data[i][k] * b.data[k][j];
      }
      return sum;
    });
  }

  multiply(n: ArrayMap | number) {
    if (n instanceof ArrayMap) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.error(
          "Columns and Rows of A must match Columns and Rows of B."
        );
        return;
      }

      // hadamard product
      return this.map((e: number, i: number, j: number) => e * n.data[i][j]);
    } else {
      // Scalar product
      return this.map((e: number) => e * n);
    }
  }

  map(func: any) {
    // Apply a function to every element of matrix
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val, i, j);
      }
    }
    return this;
  }

  static map(matrix: ArrayMap, func: any) {
    // Apply a function to every element of matrix
    return new ArrayMap(matrix.rows, matrix.cols).map(
      (e: number, i: number, j: number) => func(matrix.data[i][j], i, j)
    );
  }

  print() {
    console.table(this.data);
    return this;
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data: any) {
    if (typeof data == "string") {
      data = JSON.parse(data);
    }
    let matrix = new ArrayMap(data.rows, data.cols);
    matrix.data = data.data;
    return matrix;
  }
}
