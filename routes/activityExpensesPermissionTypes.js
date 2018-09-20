var express = require('express');
var router = express.Router();

// GET activityExpensesPermissionTypes list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('activityExpensesPermissionTypes');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET activityExpensesPermissionTypes selection list
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('activityExpensesPermissionTypes');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": "$activityExpensesPermissionTypeId",
        "name": 1
      }
    }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      res.json(docs)
    }
  })
});

// GET reset Collection ActivityExpensesPermissionTypes
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('activityExpensesPermissionTypes');
  collection.remove({});
  collection.insert([
    {
      "name": "NO PERMITIDO",
      "activityExpensesPermissionTypeId": "1"
    },
    {
      "name": "SÓLO AL EQUIPO",
      "activityExpensesPermissionTypeId": "3"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: activityExpensesPermissionTypes collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
