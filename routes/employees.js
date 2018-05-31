var express = require('express');
var router = express.Router();

// GET employees list
router.get('/listEmployees', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

// GET employee
router.get('/getEmployee/:code', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var docToFind = req.params.code;
  collection.find({'code':docToFind}, {}, function (e, docs) {
    res.json(docs);
  });
});

// POST addEmployee.
router.post('/addEmployee', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE delEmployee
router.delete('/delEmployee/:code', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var userToDelete = req.params.code;
  collection.remove({ 'code': userToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateEmployee
router.put('/updateEmployee/:code', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var userToUpdate = req.params.code;
  collection.update({ 'code': userToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// GET resetCollectionEmployees
router.get('/resetCollectionEmployees', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  collection.remove({});
  collection.insert([
    {
      "code": "1",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT1"
    },
    {
      "code": "2",
      "name": "Pablo Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT2"
    },
    {
      "code": "3",
      "name": "Carlos Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT3"
    },
    {
      "code": "4",
      "name": "Jose Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT1"
    },
    {
      "code": "5",
      "name": "Rafael Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": ""
    },
    {
      "code": "6",
      "name": "Yolanda Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT4"
    },
    {
      "code": "7",
      "name": "Trinidad Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": ""
    },
    {
      "code": "8",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT5"
    },
    {
      "code": "9",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT5"
    },
    {
      "code": "10",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT6"
    },
    {
      "code": "11",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": ""
    },
    {
      "code": "12",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT2"
    },
    {
      "code": "13",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT2"
    },
    {
      "code": "14",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT2"
    },
    {
      "code": "15",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT5"
    },
    {
      "code": "16",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT4"
    },
    {
      "code": "17",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT6"
    },
    {
      "code": "18",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT6"
    },
    {
      "code": "19",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT1"
    },
    {
      "code": "20",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT1"
    },
    {
      "code": "21",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT3"
    },
    {
      "code": "22",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT3"
    },
    {
      "code": "23",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT3"
    },
    {
      "code": "24",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT2"
    },
    {
      "code": "25",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT2"
    },
    {
      "code": "26",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT5"
    },
    {
      "code": "27",
      "name": "Ana Pérez",
      "mail": "anaperez@entelgy.com",
      "ounit": "UNIT5"
    }
  ]);  
});

module.exports = router;
