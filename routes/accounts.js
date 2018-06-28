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
  collection.findOne({ 'id': docToFind }, {}, function (e, docs) {
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
      "account": "ES6621000418401234567891",
      "company":{
        "id":"1",
        "name":"ENTELGY CONSULTING S.A"
      },
      "ledgerAccount":"57200001"      
    },
    {
      "id": "2",
      "name": "CAIXA BANK",
      "account": "ES6000491500051234567892",
      "company":{
        "id":"1",
        "name":"ENTELGY CONSULTING S.A"
      },
      "ledgerAccount":"57200005"    
    },
    {
      "id": "3",
      "name": "LA CAIXA",
      "account": "ES9420805801101234567891",
      "company":{
        "id":"2",
        "name":"ENTELGY IBAI S.A"
      },
      "ledgerAccount":"57200002"    
    },
    {
      "id": "4",
      "name": "BANCO PEPE",
      "account": "ES9000246912501234567891",
      "company":{
        "id":"2",
        "name":"ENTELGY IBAI S.A"
      },
      "ledgerAccount":"57200003"    
    },
    {
      "id": "5",
      "name": "BANCO PACO",
      "account": "ES7100302053091234567895",
      "company":{
        "id":"3",
        "name":"ENTELGY DIGITAL"
      },
      "ledgerAccount":"57200005"    
    },
    {
      "id": "6",
      "name": "BANCO JUAN",
      "account": "ES1000492352082414205416",
      "company":{
        "id":"3",
        "name":"ENTELGY DIGITAL"
      },
      "ledgerAccount":"57200003"    
    },
    {
      "id": "7",
      "name": "BANCO MANOLO",
      "account": "ES1720852066623456789011",
      "company":{
        "id":"4",
        "name":"ENTELGY S.A."
      },
      "ledgerAccount":"57200001"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
