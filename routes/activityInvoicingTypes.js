var express = require('express');
var router = express.Router();

// GET activityInvoicingTypes list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('activityInvoicingTypes');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET activityInvoicingTypes selection list
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('activityInvoicingTypes');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": "$activityInvoicingTypeId",
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


// GET reset Collection ActivityInvoicingTypes
router.get('/reset', function (req, res) {
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
