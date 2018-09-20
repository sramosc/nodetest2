var express = require('express');
var router = express.Router();

// GET activities types list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('activityTypes');
  collection.aggregate([
    {
      $project: {
        "_id": 0,
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

// GET activities types para combo modal
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('activityTypes');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": "$activityTypeId",
        "name": "$activityTypeName"
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

// GET resetCollectionActivityTypes
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('activityTypes');
  collection.remove({});
  collection.insert([
    {
      "activityTypeId": "1",
      "activityTypeName": "FACTURABLE"
    },
    {
      "activityTypeId": "2",
      "activityTypeName": "NO FACTURABLE"
    },
    {
      "activityTypeId": "3",
      "activityTypeName": "PREVENTA"
    },
    {
      "activityTypeId": "4",
      "activityTypeName": "AUSENCIA"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: activitiyTypes collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
