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

// GET company (id = id)
router.get('/getCompany/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  var docToFind = req.params.id;
  collection.find({ 'id': docToFind }, {}, function (e, docs) {
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

// DELETE delCompany (id = id)
router.delete('/delCompany/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  var docToDelete = req.params.id;
  collection.remove({ 'id': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateCompany (id = id)
router.put('/updateCompany/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('companies');
  var docToUpdate = req.params.id;
  collection.update({ 'id': docToUpdate }, req.body, function (err) {
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
      "id": 1,
      "name": "ENTELGY CONSULTING S.A"
    },
    {
      "id": 2,
      "name": "ENTELGY IBAI S.A"
    },
    {
      "id": 3,
      "name": "ENTELGY DIGITAL"
    },
    {
      "id": 4,
      "name": "ENTELGY S.A."
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
