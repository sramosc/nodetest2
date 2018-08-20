var express = require('express');
var router = express.Router();

// GET activities list
router.get('/listActivitiesTypes', function (req, res) {
  var db = req.db;
  var collection = db.get('activitiesTypes');
  collection.find({}, {}, function (e, docs) {
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
      "activityType_id": "1",
      "activityType_name": "PROYECTO EXTERNO"
    },
    {
      "activityType_id": "2",
      "activityType_name": "PROYECTO INTERNO"
    },
    {
      "activityType_id": "3",
      "activityType_name": "PREVENTA"
    },
    {
      "activityType_id": "4",
      "activityType_name": "FORMACION"
    },
    {
      "activityType_id": "5",
      "activityType_name": "GESTION / ESTRUCTURA"
    },
    {
      "activityType_id": "6",
      "activityType_name": "PENDIENTE DE ASIGNACION"
    },
    {
      "activityType_id": "7",
      "activityType_name": "HORAS SINDICALES"
    },
    {
      "activityType_id": "8",
      "activityType_name": "AUSENCIA"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
