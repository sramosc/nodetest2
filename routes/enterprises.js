var express = require('express');
var router = express.Router();

// GET enterprises list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('enterprises');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET enterprises Modal list
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('enterprises');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": "$enterpriseId",
        "name": "$enterpriseName"
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

// GET enterprise (enterpriseId = id)
router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('enterprises');
  var docToFind = req.params.id;
  collection.find({ 'enterpriseId': docToFind }, {}, function (e, docs) {
    res.json(docs);
  });
});

// POST add enterprise.
router.post('/add', function (req, res) {
  var db = req.db;
  var collection = db.get('enterprises');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE del Enterprise (enterpriseId = id)
router.delete('/del/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('enterprises');
  var docToDelete = req.params.id;
  collection.remove({ 'enterpriseId': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateEnterprise (enterpriseId = id)
router.put('/update/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('enterprises');
  var docToUpdate = req.params.id;
  collection.update({ 'enterpriseId': docToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// GET resetCollectionEnterprises
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('enterprises');
  collection.remove({});
  collection.insert([
    {
      "enterpriseId": "1",
      "enterpriseName": "NTL CONSULTING S.A"
    },
    {
      "enterpriseId": "2",
      "enterpriseName": "NTL QWER S.A"
    },
    {
      "enterpriseId": "3",
      "enterpriseName": "NTL DIGITAL"
    },
    {
      "enterpriseId": "4",
      "enterpriseName": "NTL S.A."
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: enterprises collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
