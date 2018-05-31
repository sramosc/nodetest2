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

// POST to adduser.
router.post('/addEmployee', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE to deleteuser
router.delete('/delEmployee/:code', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var docToDelete = req.params.code;
  collection.remove({ '_id': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

module.exports = router;
