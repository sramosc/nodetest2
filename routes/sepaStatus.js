var express = require('express');
var router = express.Router();

// GET sepa status list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('sepaStatus');
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
  var collection = db.get('sepaStatus');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": 1,
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
  var collection = db.get('sepaStatus');
  collection.remove({});
  collection.insert([
    {
      "id": 1,
      "name": 'CARGADAS EN BANCO'
    },
    {
      "id": 2,
      "name": 'TRAMITADAS'
    },
    {
      "id": 3,
      "name": 'CANCELADAS'
    },
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: sepaStatus collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
