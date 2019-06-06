var express = require('express');
var router = express.Router();

// GET companies list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET companies Modal list
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": "$companyId",
        "name": "$companyName"
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

// GET company (companyId = id)
router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  var docToFind = req.params.id;
  collection.find({ 'companyId': docToFind }, {}, function (e, docs) {
    res.json(docs);
  });
});

// POST addCompany.
router.post('/add', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE delCompany (companyId = id)
router.delete('/del/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  var docToDelete = req.params.id;
  collection.remove({ 'companyId': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateCompany (companyId = id)
router.put('/update/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  var docToUpdate = req.params.id;
  collection.update({ 'companyId': docToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// GET resetCollectionCompanies
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  collection.remove({});
  collection.insert([
    {
      "id": 1,
      "name": "NTL CONSULTING S.A"
    },
    {
      "id": 2,
      "name": "NTL QWER S.A"
    },
    {
      "id": 3,
      "name": "NTL DIGITAL"
    },
    {
      "id": 4,
      "name": "NTL S.A."
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: companies collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
