const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();

suite('UnitTests', () => {
  const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const validSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
  const invalidCharactersPuzzle = '!!!..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const invalidLengthPuzzle = '34...34';
  const validPuzzleStrings = [
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
    '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
    '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
    '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
    '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
  ];
  const invalidPuzzleStrings = [
    '...........................................................8..1..16....926914.37.',
    '123123...........................................................16....926914....',
    '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
  ];

  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.doesNotThrow(() => solver.validate(validPuzzle));
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    assert.throws(() => solver.validate(invalidCharactersPuzzle));
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.throws(() => solver.validate(invalidLengthPuzzle));
  });

  test('Logic handles a valid row placement', () => {
    assert.strictEqual(solver.checkRowPlacement(validPuzzle, 0, 1, '3'), true);
  });

  test('Logic handles an invalid row placement', () => {
    assert.strictEqual(solver.checkRowPlacement(validPuzzle, 0, 1, '1'), false);
  });

  test('Logic handles a valid column placement', () => {
    assert.strictEqual(solver.checkColPlacement(validPuzzle, 0, 1, '3'), true);
  });

  test('Logic handles an invalid column placement', () => {
    assert.strictEqual(solver.checkColPlacement(validPuzzle, 0, 1, '2'), false);
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.strictEqual(solver.checkRegionPlacement(validPuzzle, 0, 1, '3'), true);
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.strictEqual(solver.checkRegionPlacement(validPuzzle, 0, 1, '6'), false);
  });

  test('Valid puzzle strings pass the solver', () => {
    validPuzzleStrings.forEach((puzzle) => {
      assert.doesNotThrow(() => solver.solve(puzzle));
    });
  });

  test('Invalid puzzle strings fail the solver', () => {
    invalidPuzzleStrings.forEach((puzzle) => {
      assert.throws(() => solver.solve(puzzle));
    });
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    assert.strictEqual(solver.solve(validPuzzle), validSolution);
  });
});
