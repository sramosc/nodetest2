var express = require('express');
var router = express.Router();

// GET accounts list
router.get('/listAccounts', function (req, res) {
  var db = req.db;
  var collection = db.get('accounts');
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

// GET account (id = id)
router.get('/getAccount/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('accounts');
  var docToFind = req.params.id;
  collection.find({ 'id': docToFind }, {}, function (e, docs) {
    res.json(docs);
  });
});

// POST addAccount.
router.post('/addAccount', function (req, res) {
  var db = req.db;
  var collection = db.get('accounts');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE delAccount (id = id)
router.delete('/delAccount/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('accounts');
  var docToDelete = req.params.id;
  collection.remove({ 'id': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateAccount (id = id)
router.put('/updateAccount/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('accounts');
  var docToUpdate = req.params.id;
  collection.update({ 'id': docToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// GET resetCollectionAccounts
router.get('/resetCollectionAccounts', function (req, res) {
  var db = req.db;
  var collection = db.get('accounts');
  collection.remove({});
  collection.insert([
    {
      "id": "1",
      "name": "BANCO POPULAR",
      "account": "ES950075104383050000227346",
      "company":{
        "id":1,
        "name":"ENTELGY CONSULTING S.A"
      },
      "bookAccount":{
        "id": 1,
        "value":"57200005"
      }
    },
    {
      "id": "2",
      "name": "CAIXA BANK",
      "account": "ES1121002120870200294059",
      "company":{
        "id":1,
        "name":"ENTELGY CONSULTING S.A"
      },
      "bookAccount":{
        "id": 2,
        "value":"57200030"
      }
    },
    {
      "id": "3",
      "name": "LA CAIXA",
      "account": "ES1121002120870200294059",
      "company":{
        "id":2,
        "name":"ENTELGY IBAI S.A"
      },
      "bookAccount":{
        "id": 2,
        "value":"57200030"
      }
    },
    {
      "id": "4",
      "name": "BANCO PEPE",
      "account": "ES950075104383050000227346",
      "company":{
        "id":2,
        "name":"ENTELGY IBAI S.A"
      },
      "bookAccount":{
        "id": 1,
        "value":"57200005"
      }
    },
    {
      "id": "5",
      "name": "BANCO PACO",
      "account": "ES950075104383050000227346",
      "company":{
        "id":3,
        "name":"ENTELGY DIGITAL"
      },
      "bookAccount":{
        "id": 3,
        "value":"57200012"
      }
    },
    {
      "id": "6",
      "name": "BANCO JUAN",
      "account": "ES950075104383050000227346",
      "company":{
        "id":3,
        "name":"ENTELGY DIGITAL"
      },
      "bookAccount":{
        "id": 4,
        "value":"57200067"
      }
    },
    {
      "id": "7",
      "name": "BANCO MANOLO",
      "account": "ES950075104383050000227346",
      "company":{
        "id":4,
        "name":"ENTELGY S.A."
      },
      "bookAccount":{
        "id": 4,
        "value":"57200067"
      }
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
