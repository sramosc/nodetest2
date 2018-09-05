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

// GET account (accountId = accountId)
router.get('/getAccount/:accountId', function (req, res) {
  var db = req.db;
  var collection = db.get('accounts');
  var docToFind = req.params.accountId;
  collection.findOne({ 'accountId': docToFind }, {}, function (e, docs) {
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

// DELETE delAccount (accountId = accountId)
router.delete('/delAccount/:accountId', function (req, res) {
  var db = req.db;
  var collection = db.get('accounts');
  var docToDelete = req.params.accountId;
  collection.remove({ 'accountId': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateAccount (accountId = accountId)
router.put('/updateAccount/:accountId', function (req, res) {
  var db = req.db;
  var collection = db.get('accounts');
  var docToUpdate = req.params.accountId;
  collection.update({ 'accountId': docToUpdate }, req.body, function (err) {
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
      "accountId": "1",
      "accountName": "BANCO POPULAR",
      "accountNumber": "ES6621000418401234567891",
      "companyId":"1",
      "ledgerAccount":"57200001"      
    },
    {
      "accountId": "2",
      "accountName": "CAIXA BANK",
      "accountNumber": "ES6000491500051234567892",
      "companyId":"1",
      "ledgerAccount":"57200005"    
    },
    {
      "accountId": "3",
      "accountName": "LA CAIXA",
      "accountNumber": "ES9420805801101234567891",
      "companyId":"2",
      "ledgerAccount":"57200002"    
    },
    {
      "accountId": "4",
      "accountName": "BANCO PEPE",
      "accountNumber": "ES9000246912501234567891",
      "companyId":"2",
      "ledgerAccount":"57200003"    
    },
    {
      "accountId": "5",
      "accountName": "BANCO PACO",
      "accountNumber": "ES7100302053091234567895",
      "companyId":"3",
      "ledgerAccount":"57200005"    
    },
    {
      "accountId": "6",
      "accountName": "BANCO JUAN",
      "accountNumber": "ES1000492352082414205416",
      "companyId":"3",
      "ledgerAccount":"57200003"    
    },
    {
      "accountId": "7",
      "accountName": "BANCO MANOLO",
      "accountNumber": "ES1720852066623456789011",
      "companyId":"4",
      "ledgerAccount":"57200001"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
