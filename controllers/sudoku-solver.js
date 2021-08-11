const ROW_LENGTH = 9;

class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString == null) {
      throw new Error('Required field missing');
    }

    if (false === /[1-9.]*/.test(puzzleString)) {
      throw new Error('Invalid characters in puzzle');
    }

    if (puzzleString.length !== 81) {
      throw new Error('Expected puzzle to be 81 characters long');
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowNum = this.rowToNumber(row);
    const columnNum = this.colToNumber(column);
    const valueNum = +value;
    const startIndex = rowNum * ROW_LENGTH;

    const valuesString = puzzleString.slice(startIndex, startIndex + ROW_LENGTH);

    const valuesMap = this.valuesStringToMap(valuesString);
    const valuesSet = this.valuesStringToSet(valuesString);

    const currentValue = valuesMap.get(columnNum);

    if (currentValue != null) {
      return currentValue === valueNum;
    }

    return (false === valuesSet.has(valueNum));
  }

  checkColPlacement(puzzleString, row, column, value) {
    const rowNum = this.rowToNumber(row);
    const columnNum = this.colToNumber(column);
    const valueNum = +value;
    let valuesString = '';

    for (let i = 0; i < 9; i++) {
      valuesString += puzzleString.charAt(columnNum + i * ROW_LENGTH);
    }

    const valuesMap = this.valuesStringToMap(valuesString);
    const valuesSet = this.valuesStringToSet(valuesString);

    const currentValue = valuesMap.get(rowNum);

    if (currentValue != null) {
      return currentValue === valueNum;
    }

    return (false === valuesSet.has(valueNum));
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowNum = this.rowToNumber(row);
    const columnNum = this.colToNumber(column);
    const valueNum = +value;

    const firstColInRegion = Math.floor(columnNum / 3) * 3;
    const firstRowInRegion = Math.floor(rowNum / 3) * 3;
    const lastRowInRegion = firstRowInRegion + 3;

    let valuesString = '';

    for (let i = firstRowInRegion; i < lastRowInRegion; i++) {
      const firstInSubstr = (i * ROW_LENGTH) + firstColInRegion
      valuesString += puzzleString.substr(firstInSubstr, 3);
    }

    const valuesMap = this.valuesStringToMap(valuesString);
    const valuesSet = this.valuesStringToSet(valuesString);

    const indexInMap = (rowNum % 3) * 3 + (columnNum % 3);
    const currentValue = valuesMap.get(indexInMap);

    if (currentValue != null) {
      return currentValue === valueNum;
    }

    return (false === valuesSet.has(valueNum));
  }

  solve(puzzleString) {
    return '';
  }

  rowToNumber(row) {
    return row.charCodeAt(0) - 65;
  }

  colToNumber(column) {
    return +column - 1;
  }

  valuesStringToMap(valuesString) {
    return valuesString
      .split('')
      .reduce((map, el, i) => {
        if (el === '.') {
          return map;
        }

        map.set(i, +el);
        return map;
      }, new Map());
  }

  valuesStringToSet(valuesString) {
    return valuesString.split('')
      .filter((el) => el !== '.')
      .reduce((set, el) => {
        set.add(+el);
        return set;
      }, new Set())
  }
}

module.exports = SudokuSolver;
