var express = require('express');
var router = express.Router();

// GET employees list
router.get('/listEmployees', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

// GET employee
router.get('/getEmployee/:code', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var docToFind = req.params.code;
  collection.find({'code':docToFind}, {}, function (e, docs) {
    res.json(docs);
  });
});

// POST addEmployee.
router.post('/addEmployee', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE delEmployee
router.delete('/delEmployee/:code', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var userToDelete = req.params.code;
  collection.remove({ 'code': userToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateEmployee
router.put('/updateEmployee/:code', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var userToUpdate = req.params.code;
  collection.update({ 'code': userToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

module.exports = router;
