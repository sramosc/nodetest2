var express = require('express');
var router = express.Router();

// GET activityRoles list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('activityRoles');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET activityRoles Modal list
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('activityRoles');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": "$activityRoleId",
        "name": 1
      }
    }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      let result = {
        options: docs
      }
      res.json(result)      
    }
  })
});

// GET resetCollectionActivityRoles
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('activityRoles');
  collection.remove({});
  collection.insert([
    {
      "name": "TECNICO",
      "activityRoleId": 1
    },
    {
      "name": "JEFE PROYECTO",
      "activityRoleId": 2
    },
    {
      "name": "D. NEGOCIO",
      "activityRoleId": 3
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: activityRoles collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
