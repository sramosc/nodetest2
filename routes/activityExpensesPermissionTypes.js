var express = require('express');
var router = express.Router();

// GET activityExpensesPermissionTypes list
router.get('/listActivityExpensesPermissionTypes', function (req, res) {
  var db = req.db;
  var collection = db.get('activityExpensesPermissionTypes');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET resetCollectionActivityExpensesPermissionTypes
router.get('/resetCollectionActivityExpensesPermissionTypes', function (req, res) {
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
