var express = require('express');
var router = express.Router();

// GET activityInvoicingTypes list
router.get('/listActivityInvoicingTypes', function (req, res) {
  var db = req.db;
  var collection = db.get('activityInvoicingTypes');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET resetCollectionActivityInvoicingTypes
router.get('/resetCollectionActivityInvoicingTypes', function (req, res) {
  var db = req.db;
  var collection = db.get('activityInvoicingTypes');
  collection.remove({});
  collection.insert([
    {
      "name": "TARIFA",
      "activityInvoicingTypeId": "1"
    },
    {
      "name": "PROYECTO CERRADO",
      "activityInvoicingTypeId": "2"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: activityInvoicingTypes collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
