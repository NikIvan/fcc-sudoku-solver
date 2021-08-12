'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const {puzzle, coordinate, value} = req.body;

      if (
        (puzzle == null)
        || (coordinate == null)
        || (value == null)
      ) {
        return res.json({error: 'Required field(s) missing'});
      }

      try {
        solver.validate(puzzle);
      } catch (err) {
        return res.json({error: err.message});
      }

      const isValidCoordinate = /[A-I][1-9]/.test(coordinate);

      if (false === isValidCoordinate) {
        return res.json({error: 'Invalid coordinate'});
      }

      const isValidValue = /[1-9]/.test(value);

      if (false === isValidValue) {
        return res.json({error: 'Invalid value'});
      }

      const [row, column] = coordinate.split('');

      const conflict = [];

      const isValidRow = solver.checkRowPlacement(puzzle, row, column, value);
      const isValidCol = solver.checkColPlacement(puzzle, row, column, value);
      const isValidRegion = solver.checkRegionPlacement(puzzle, row, column, value);

      if (false === isValidRow) conflict.push('row');
      if (false === isValidCol) conflict.push('column');
      if (false === isValidRegion) conflict.push('region');

      if (conflict.length > 0) {
        return res.json({
          valid: false,
          conflict,
        });
      }

      return res.json({
        valid: true,
      });
    });

  app.route('/api/solve')
    .post((req, res) => {
      const {puzzle} = req.body;

      try {
        solver.validate(puzzle);
      } catch (err) {
        return res.json({error: err.message});
      }

      let solution;

      try {
        solution = solver.solve(puzzle);
      } catch (err) {
        return res.json({error: err.message});
      }

      return res.json({solution});
    });
};
