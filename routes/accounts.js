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
      "cuenta": "ES950075104383050000227346",
      "compañia": "Cambiar ENTELGY CONSULTING S.A",
      "cuentaCon": "57200005"
    },
    {
      "id": "2",
      "name": "CAIXA BANK",
      "cuenta": "ES1121002120870200294059",
      "compañia": "CAMBIAR ENTELGY CONSULTING S.A",
      "cuentaCon": "57200030"
    },
    {
      "id": "3",
      "name": "LA CAIXA",
      "cuenta": "ES1121002120870200294059",
      "compañia": "CAMBIAR ENTELGY IBAI S.A",
      "cuentaCon": "57200030"
    },
    {
      "id": "4",
      "name": "LA CAIXA-DCL",
      "cuenta": "ES112100676780870200294059",
      "compañia": "CAMBIAR DCL SERPRO S.L",
      "cuentaCon": "57200630"
    },
    {
      "id": "5",
      "name": "POPULAR IBAI",
      "cuenta": "ES11210021208705667594059",
      "compañia": "CAMBIAR ENTELGY ENTELGY IBAI S.A",
      "cuentaCon": "57270030"
    },
    {
      "id": "6",
      "name": "CAIXA-BANK",
      "cuenta": "ES112100212087058988294059",
      "compañia": "CAMBIAR ENTELGY ENTELGY IBAI S.A",
      "cuentaCon": "57270030"
    },
    {
      "id": "7",
      "name": "BANCO POULAR",
      "cuenta": "ES1121002120870566788294059",
      "compañia": "CAMBIAR ENTELGY ENTELGY IBAI S.A",
      "cuentaCon": "57270030"
    },
    {
      "id": "8",
      "name": "POPULAR IBAI",
      "cuenta": "ES1121002120870566788294059",
      "compañia": "CAMBIAR ENTELGY ENTELGY IBAI S.A",
      "cuentaCon": "57270030"
    },
    {
      "id": "9",
      "name": "LA CAIXA",
      "cuenta": "ES11R6002120870566788294059",
      "compañia": "CAMBIAR ENTELGY ENTELGY IBAI S.A",
      "cuentaCon": "57270030"

    },
    {
      "id": "10",
      "name": "POPULAR IBAI",
      "cuenta": "ES1121002120870566788294059",
      "compañia": "CAMBIAR ENTELGY DCL IBAI S.A",
      "cuentaCon": "57270030"
    },
    {
      "id": "11",
      "name": "BANCO POPULAR",
      "cuenta": "ES1121002120870566788294059",
      "compañia": "CAMBIAR ENTELGY S.A",
      "cuentaCon": "57270030"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
