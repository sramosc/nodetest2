var express = require('express');
var router = express.Router();

// GET activityTypes list
router.get('/listActivityTypes', function (req, res) {
  var db = req.db;
  var collection = db.get('activityTypes');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET resetCollectionActivityTypes
router.get('/resetCollectionActivityTypes', function (req, res) {
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
