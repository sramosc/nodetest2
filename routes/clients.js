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
      "client_id": "1",
      "client_name": "TELEFONICA",
    },
    {
      "client_id": "2",
      "client_name": "BBVA",
    },
    {
      "client_id": "3",
      "client_name": "BANCO SANTANDER",
    },
    {
      "client_id": "4",
      "client_name": "LA CAIXA",
    },
    {
      "client_id": "5",
      "client_name": "MERCADONA",
    },
    
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
