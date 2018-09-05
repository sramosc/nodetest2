var express = require('express');
var router = express.Router();

// GET userList
router.get('/listClients', function (req, res) {
  var db = req.db;
  var collection = db.get('clients');
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

// GET resetCollectionEmployees
router.get('/resetCollectionClients', function (req, res) {
  var db = req.db;
  var collection = db.get('clients');
  collection.remove({});
  collection.insert([
    {
      "clientId": "1",
      "clientName": "430000025 - TELEFONICA MOVILES ESPAÑA S.A.",
    },
    {
      "clientId": "2",
      "clientName": "430000026 - BBVA",
    },
    {
      "clientId": "3",
      "clientName": "430000027 - BANCO SANTANDER",
    },
    {
      "clientId": "4",
      "clientName": "430000028 - LA CAIXA",
    },
    {
      "clientId": "5",
      "clientName": "430000029 - MERCADONA",
    },
    
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
