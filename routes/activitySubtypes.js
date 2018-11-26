var express = require('express');
var router = express.Router();

// GET activities types list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('activitySubtypes');
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
  var collection = db.get('activitySubtypes');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": "$activitySubtypeId",
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

// GET resetCollectionActivitySubtypes
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('activitySubtypes');
  collection.remove({});
  collection.insert([
    {
      "name": "PROYECTO INTERNO",
      "activityTypeId": 2,
      "activitySubtypeId": 5
    },
    {
      "name": "PREVENTA",
      "activityTypeId": 3,
      "activitySubtypeId": 8
    },
    {
      "name": "FORMACION",
      "activityTypeId": 2,
      "activitySubtypeId": 9
    },
    {
      "name": "GESTION / ESTRUCTURA",
      "activityTypeId": 2,
      "activitySubtypeId": 12
    },
    {
      "name": "PENDIENTE DE ASIGNACIÓN",
      "activityTypeId": 2,
      "activitySubtypeId": 15
    },
    {
      "name": "HORAS SINDICALES",
      "activityTypeId": 2,
      "activitySubtypeId": 16
    },
    {
      "name": "AUSENCIA",
      "activityTypeId": 4,
      "activitySubtypeId": 24
    },
    {
      "name": "PROYECTO EXTERNO",
      "activityTypeId": 1,
      "activitySubtypeId": 25
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: activitySubtypes collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
