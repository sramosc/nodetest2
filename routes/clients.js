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
      "clientName": "MODAS AMPARO",
    },
    {
      "clientId": "2",
      "clientName": "CHARCUTERIA PEPI",
    },
    {
      "clientId": "3",
      "clientName": "ULTRAMARINOS MANOLO",
    },
    {
      "clientId": "4",
      "clientName": "MERCERIA TOÑI",
    },
    {
      "clientId": "5",
      "clientName": "FABRICA DE MIGUELITOS",
    },
    
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: clients collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
