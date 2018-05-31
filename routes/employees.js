var express = require('express');
var router = express.Router();

// GET userList
router.get('/listEmployees', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  collection.find({}, {}, function (e, docs) {
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
router.delete('/delEmployee/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var docToDelete = req.params.id;
  collection.remove({ '_id': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

module.exports = router;
