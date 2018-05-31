var express = require('express');
var router = express.Router();

// GET userList
router.get('/listOUnits', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

// POST to adduser.
router.post('/addOUnit', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE to deleteuser
router.delete('/delOUnit/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  var docToDelete = req.params.id;
  collection.remove({ '_id': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

module.exports = router;
