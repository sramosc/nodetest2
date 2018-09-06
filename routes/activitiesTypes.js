var express = require('express');
var router = express.Router();

// GET activities list
router.get('/listActivitiesTypes', function (req, res) {
  var db = req.db;
  var collection = db.get('activitiesTypes');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET resetCollectionActivitiesTypes
router.get('/resetCollectionActivitiesTypes', function (req, res) {
  var db = req.db;
  var collection = db.get('activitiesTypes');
  collection.remove({});
  collection.insert([
    {
      "activityTypeId": "1",
      "activityTypeName": "PROYECTO EXTERNO"
    },
    {
      "activityTypeId": "2",
      "activityTypeName": "PROYECTO INTERNO"
    },
    {
      "activityTypeId": "3",
      "activityTypeName": "PREVENTA"
    },
    {
      "activityTypeId": "4",
      "activityTypeName": "FORMACION"
    },
    {
      "activityTypeId": "5",
      "activityTypeName": "GESTION / ESTRUCTURA"
    },
    {
      "activityTypeId": "6",
      "activityTypeName": "PENDIENTE DE ASIGNACION"
    },
    {
      "activityTypeId": "7",
      "activityTypeName": "HORAS SINDICALES"
    },
    {
      "activityTypeId": "8",
      "activityTypeName": "AUSENCIA"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
