var express = require('express');
var router = express.Router();

// GET companies list
router.get('/listCompanies', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET companies Modal list
router.get('/listCompaniesModal', function (req, res) {
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
      res.json(docs)
    }
  })
});

// GET company (companyId = id)
router.get('/getCompany/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  var docToFind = req.params.id;
  collection.find({ 'companyId': docToFind }, {}, function (e, docs) {
    res.json(docs);
  });
});

// POST addCompany.
router.post('/addCompany', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE delCompany (companyId = id)
router.delete('/delCompany/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  var docToDelete = req.params.id;
  collection.remove({ 'companyId': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateCompany (companyId = id)
router.put('/updateCompany/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  var docToUpdate = req.params.id;
  collection.update({ 'companyId': docToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// GET resetCollectionCompanies
router.get('/resetCollectionCompanies', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  collection.remove({});
  collection.insert([
    {
      "companyId": "1",
      "companyName": "NTL CONSULTING S.A"
    },
    {
      "companyId": "2",
      "companyName": "NTL QWER S.A"
    },
    {
      "companyId": "3",
      "companyName": "NTL DIGITAL"
    },
    {
      "companyId": "4",
      "companyName": "NTL S.A."
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: companies collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
