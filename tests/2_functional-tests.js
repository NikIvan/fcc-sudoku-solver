const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const validSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
  const invalidCharactersPuzzle = '!!!..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const invalidLengthPuzzle = '34...34';
  const nonSolvablePuzzle = '....................................................9.47...8..1..16....926914.37.';

  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: validPuzzle})
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.property(res.body, 'solution', 'Should contain "solution" property');
        assert.strictEqual(res.body.solution, validSolution);

        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.property(res.body, 'error', 'Should contain "error" property');
        assert.strictEqual(res.body.error, 'Required field missing');

        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: invalidCharactersPuzzle})
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.property(res.body, 'error', 'Should contain "error" property');
        assert.strictEqual(res.body.error, 'Invalid characters in puzzle');

        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: invalidLengthPuzzle})
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.property(res.body, 'error', 'Should contain "error" property');
        assert.strictEqual(res.body.error, 'Expected puzzle to be 81 characters long');

        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: nonSolvablePuzzle})
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.property(res.body, 'error', 'Should contain "error" property');
        assert.strictEqual(res.body.error, 'Puzzle cannot be solved');

        done();
      });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'A2',
        value: '3'
      })
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.property(res.body, 'valid', 'Should contain "valid" property');
        assert.strictEqual(res.body.valid, true);

        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'A2',
        value: '9'
      })
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.property(res.body, 'valid', 'Should contain "error" property');
        assert.strictEqual(res.body.valid, false);
        assert.property(res.body, 'conflict', 'Should contain "conflict" property');
        assert.strictEqual(res.body.conflict.length, 1);

        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'A2',
        value: '1'
      })
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.property(res.body, 'valid', 'Should contain "error" property');
        assert.strictEqual(res.body.valid, false);
        assert.property(res.body, 'conflict', 'Should contain "conflict" property');
        assert.strictEqual(res.body.conflict.length, 2);

        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'A7',
        value: '2'
      })
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.property(res.body, 'valid', 'Should contain "error" property');
        assert.strictEqual(res.body.valid, false);
        assert.property(res.body, 'conflict', 'Should contain "conflict" property');
        assert.strictEqual(res.body.conflict.length, 3);

        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({})
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.property(res.body, 'error', 'Should contain "error" property');
        assert.strictEqual(res.body.error, 'Required field(s) missing');

        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: invalidCharactersPuzzle,
        coordinate: 'A7',
        value: '2'})
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.property(res.body, 'error', 'Should contain "error" property');
        assert.strictEqual(res.body.error, 'Invalid characters in puzzle');

        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: invalidLengthPuzzle,
        coordinate: 'A7',
        value: '2'})
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.property(res.body, 'error', 'Should contain "error" property');
        assert.strictEqual(res.body.error, 'Expected puzzle to be 81 characters long');

        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'A10',
        value: '2'})
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.property(res.body, 'error', 'Should contain "error" property');
        assert.strictEqual(res.body.error, 'Invalid coordinate');

        done();
      });
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzle,
        coordinate: 'A1',
        value: 'F'})
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.property(res.body, 'error', 'Should contain "error" property');
        assert.strictEqual(res.body.error, 'Invalid value');

        done();
      });
  });

});

