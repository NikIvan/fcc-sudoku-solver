const ROW_LENGTH = 9;
const MIN_VALUE = 1;
const MAX_VALUE = 9;
const PUZZLE_STRING_LENGTH = 81;

class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString == null) {
      throw new Error('Required field missing');
    }

    if (false === /^[1-9.]*$/.test(puzzleString)) {
      throw new Error('Invalid characters in puzzle');
    }

    if (puzzleString.length !== PUZZLE_STRING_LENGTH) {
      throw new Error('Expected puzzle to be 81 characters long');
    }
  }

  checkRowPlacement(puzzleString, rowNum, columnNum, value) {
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

  checkColPlacement(puzzleString, rowNum, columnNum, value) {
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

  checkRegionPlacement(puzzleString, rowNum, columnNum, value) {
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

  solve(puzzleStringInput) {
    let puzzleString = puzzleStringInput;

    while(puzzleString.includes('.')) {
      let newPuzzleString = '';

      for (let i = 0; i < PUZZLE_STRING_LENGTH; i++) {
        const variants = new Array(PUZZLE_STRING_LENGTH).fill([]);
        const {row, col} = this.getCellCoords(i);

        const currentChar = puzzleString.charAt(i);

        if (currentChar !== '.') {
          newPuzzleString += currentChar;
          continue;
        }

        for (let value = MIN_VALUE; value <= MAX_VALUE; value++) {
          const isValidRow = this.checkRowPlacement(puzzleString, row, col, value);

          if (false === isValidRow) {
            continue;
          }

          const isValidCol = this.checkColPlacement(puzzleString, row, col, value);

          if (false === isValidCol) {
            continue;
          }

          const isValidRegion = this.checkRegionPlacement(puzzleString, row, col, value);

          if (false === isValidRegion) {
            continue;
          }

          variants[i].push(`${value}`);
        }

        if (variants[i].length === 1) {
          newPuzzleString += variants[i][0];
          continue;
        }

        newPuzzleString += '.';
      }

      if (newPuzzleString === puzzleString) {
        throw new Error('Puzzle cannot be solved');
      }

      puzzleString = newPuzzleString;
    }

    return puzzleString;
  }

  rowToNumber(row) {
    return row.charCodeAt(0) - 65;
  }

  colToNumber(column) {
    return +column - 1;
  }

  getCellCoords(index) {
    const row = Math.floor(index / ROW_LENGTH);
    const col = (index % ROW_LENGTH);

    return {row, col};
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
