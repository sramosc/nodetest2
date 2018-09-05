var express = require('express');
var router = express.Router();

// GET companies list
router.get('/listCompanies', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
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
      "companyName": "ENTELGY CONSULTING S.A"
    },
    {
      "companyId": "2",
      "companyName": "ENTELGY IBAI S.A"
    },
    {
      "companyId": "3",
      "companyName": "ENTELGY DIGITAL"
    },
    {
      "companyId": "4",
      "companyName": "ENTELGY S.A."
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
