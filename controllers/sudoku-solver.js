const ROW_LENGTH = 9;

class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString == null) {
      throw new Error('Required field missing');
    }

    if (false === /^[1-9.]*$/.test(puzzleString)) {
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

  solve(puzzleStringInput) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    const cols = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let puzzleString = puzzleStringInput;

    while(puzzleString.includes('.')) {
      const variants = {};
      let newPuzzleString = '';

      for (let i = 0; i < rows.length; i++) {
        let currentSolution = null;

        const row = rows[i];

        for (let j = 0; j < cols.length; j++) {
          const col = cols[j];

          for (let k = 0; k < values.length; k++) {
            const value = values[k];

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

            let cellKey = `${row}${col}`;

            if (variants[cellKey] == null) {
              variants[cellKey] = [];
            }

            variants[cellKey].push(value);
          }
        }
      }

      for (const key in variants) {
        if (variants[key].length === 1) {
          newPuzzleString += variants[key];
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
