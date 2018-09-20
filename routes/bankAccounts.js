var express = require('express');
var router = express.Router();

// GET bank accounts list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('bankaccounts');
  collection.aggregate([
    {
      $lookup: {
        from: "enterprises",
        localField: "enterpriseId",
        foreignField: "enterpriseId",
        as: "enterprise"
      }
    },
    {
      $project: {
        "_id": 0,
        "id": 1,
        "name": 1,
        "number": 1,
        "enterprise.id": "$enterpriseId",
        "enterprise.name": { $arrayElemAt: ["$enterprise.enterpriseName", 0] },
        "ledgerAccount": 1
      }
    },
    { $unwind: "$enterprise" }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      let result = {
        banksAccounts: docs
      }
      res.json(result)
    }
  })
});

// GET bank account (id = id)
router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('bankaccounts');
  var docToFind = req.params.id;
  /*collection.findOne({ 'id': docToFind }, {}, function (e, docs) {
    res.json(docs);
  });*/
  collection.aggregate([
    {
      $match: { 'id': docToFind }
    },
    {
      $lookup: {
        from: "enterprises",
        localField: "enterpriseId",
        foreignField: "enterpriseId",
        as: "enterprise"
      }
    },
    {
      $project: {
        "_id": 0,
        "id": 1,
        "name": 1,
        "number": 1,
        "enterprise.id": "$enterpriseId",
        "ledgerAccount": 1
      }
    },
    { $unwind: "$enterprise" }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      let result = {
        bankAccount: docs[0]
      }
      res.json(result)
    }
  })
});

// POST add bank Account.
router.post('/add', function (req, res) {
  var db = req.db;
  var collection = db.get('bankaccounts');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE del Bank Account (id = id)
router.delete('/del/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('bankaccounts');
  var docToDelete = req.params.id;
  collection.remove({ 'id': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateAccount (id = id)
router.put('/update/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('bankaccounts');
  var docToUpdate = req.params.id;
  collection.update({ 'id': docToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// GET resetCollectionAccounts
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('bankaccounts');
  collection.remove({});
  collection.insert([
    {
      "id": "1",
      "name": "BANCO POPULAR",
      "number": "ES6621000418401234567891",
      "enterpriseId": "1",
      "ledgerAccount": "57200001"
    },
    {
      "id": "2",
      "name": "CAIXA BANK",
      "number": "ES6000491500051234567892",
      "enterpriseId": "1",
      "ledgerAccount": "57200005"
    },
    {
      "id": "3",
      "name": "LA CAIXA",
      "number": "ES9420805801101234567891",
      "enterpriseId": "2",
      "ledgerAccount": "57200002"
    },
    {
      "id": "4",
      "name": "BANCO PEPE",
      "number": "ES9000246912501234567891",
      "enterpriseId": "2",
      "ledgerAccount": "57200003"
    },
    {
      "id": "5",
      "name": "BANCO PACO",
      "number": "ES7100302053091234567895",
      "enterpriseId": "3",
      "ledgerAccount": "57200005"
    },
    {
      "id": "6",
      "name": "BANCO JUAN",
      "number": "ES1000492352082414205416",
      "enterpriseId": "3",
      "ledgerAccount": "57200003"
    },
    {
      "id": "7",
      "name": "BANCO MANOLO",
      "number": "ES1720852066623456789011",
      "enterpriseId": "4",
      "ledgerAccount": "57200001"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: bankaccounts collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
