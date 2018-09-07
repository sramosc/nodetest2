var express = require('express');
var router = express.Router();

// GET activityIncomeTypes list
router.get('/listActivityIncomeTypes', function (req, res) {
  var db = req.db;
  var collection = db.get('activityIncomeTypes');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET resetCollectionActivityIncomeTypes
router.get('/resetCollectionActivityIncomeTypes', function (req, res) {
  var db = req.db;
  var collection = db.get('activityIncomeTypes');
  collection.remove({});
  collection.insert([
    {
      "name": "SUELO",
      "activityIncomeTypeId": "1"
    },
    {
      "name": "RENOVACION",
      "activityIncomeTypeId": "2"
    },
    {
      "name": "CRECIMIENTO",
      "activityIncomeTypeId": "3"
    },
    {
      "name": "NUEVA VENTA",
      "activityIncomeTypeId": "4"
    },
    {
      "name": "NUEVO CLIENTE",
      "activityIncomeTypeId": "5"
    },
    {
      "name": "CARTERA PROXIMOS EJERCICIOS",
      "activityIncomeTypeId": "6"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: activityIncomeTypes collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
