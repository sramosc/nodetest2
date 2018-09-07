var express = require('express');
var router = express.Router();

// GET activitySubtypes list
router.get('/listActivitySubtypes', function (req, res) {
  var db = req.db;
  var collection = db.get('activitySubtypes');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET resetCollectionActivitySubtypes
router.get('/resetCollectionActivitySubtypes', function (req, res) {
  var db = req.db;
  var collection = db.get('activitySubtypes');
  collection.remove({});
  collection.insert([
    {
      "name": "PROYECTO INTERNO",
      "activityTypeId": "2",
      "activitySubTypeId": "5"
    },
    {
      "name": "PREVENTA",
      "activityTypeId": "3",
      "activitySubTypeId": "8"
    },
    {
      "name": "FORMACION",
      "activityTypeId": "2",
      "activitySubTypeId": "9"
    },
    {
      "name": "GESTION / ESTRUCTURA",
      "activityTypeId": "2",
      "activitySubTypeId": "12"
    },
    {
      "name": "PENDIENTE DE ASIGNACIÓN",
      "activityTypeId": "2",
      "activitySubTypeId": "15"
    },
    {
      "name": "HORAS SINDICALES",
      "activityTypeId": "2",
      "activitySubTypeId": "16"
    },
    {
      "name": "AUSENCIA",
      "activityTypeId": "4",
      "activitySubTypeId": "24"
    },
    {
      "name": "PROYECTO EXTERNO",
      "activityTypeId": "1",
      "activitySubTypeId": "25"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: activitySubtypes collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
