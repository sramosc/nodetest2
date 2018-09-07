var express = require('express');
var router = express.Router();

// GET activityRoles list
router.get('/listActivityRoles', function (req, res) {
  var db = req.db;
  var collection = db.get('activityRoles');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET resetCollectionActivityRoles
router.get('/resetCollectionActivityRoles', function (req, res) {
  var db = req.db;
  var collection = db.get('activityRoles');
  collection.remove({});
  collection.insert([
    {
      "name": "TECNICO",
      "activityRoleId": "1"
    },
    {
      "name": "JEFE PROYECTO",
      "activityRoleId": "2"
    },
    {
      "name": "D. NEGOCIO",
      "activityRoleId": "3"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: activitiyRoles collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
