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
  collection.find({ 'code': docToFind }, {}, function (e, docs) {
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

// PATCH updateEmployee/:code/ounit/ounit
router.patch('/updateEmployee/:code/ounit/:ounit', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var userToUpdate = req.params.code;
  var newOUnit = req.params.ounit;
  collection.findOneAndUpdate({ 'code': userToUpdate }, { $set: { "ounit": newOUnit } }, function (err) {
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
      "name": "Jose Carlos Fernandez",
      "mail": "jcf@entelgy.com",
      "ounit": "2"
    },
    {
      "code": "2",
      "name": "Manuel Pérez Vena",
      "mail": "mpv@entelgy.com",
      "ounit": "2"
    },
    {
      "code": "3",
      "name": "Maria Jesús Corrillo",
      "mail": "mjc@entelgy.com",
      "ounit": "1"
    },
    {
      "code": "4",
      "name": "Almudena Duero",
      "mail": "ad@entelgy.com",
      "ounit": "1"
    },
    {
      "code": "5",
      "name": "Rafael Montañez",
      "mail": "rm@entelgy.com",
      "ounit": "1"
    },
    {
      "code": "6",
      "name": "Sergio Ramirez",
      "mail": "sr@entelgy.com",
      "ounit": "5"
    },
    {
      "code": "7",
      "name": "Alfonso Sanchez",
      "mail": "as@entelgy.com",
      "ounit": "5"
    },
    {
      "code": "8",
      "name": "Yolanda Soltero",
      "mail": "ys@entelgy.com",
      "ounit": "3"
    },
    {
      "code": "9",
      "name": "Alvaro Noviciado",
      "mail": "an@entelgy.com",
      "ounit": "7"
    },
    {
      "code": "10",
      "name": "Trinidad Pueblo",
      "mail": "tp@entelgy.com",
      "ounit": "7"
    },
    {
      "code": "11",
      "name": "Ivan de la Sierra",
      "mail": "idls@entelgy.com",
      "ounit": "6"
    },
    {
      "code": "12",
      "name": "Antonio Alfarero",
      "mail": "aa@entelgy.com",
      "ounit": "6"
    },
    {
      "code": "13",
      "name": "Fernando Duque",
      "mail": "fd@entelgy.com",
      "ounit": ""
    },
    {
      "code": "14",
      "name": "Luis Pared",
      "mail": "lp@entelgy.com",
      "ounit": ""
    },
    {
      "code": "15",
      "name": "Maria de los Ángeles Frasco",
      "mail": "maf@entelgy.com",
      "ounit": "3"
    },
    {
      "code": "16",
      "name": "Rosa Cinesal",
      "mail": "rs@entelgy.com",
      "ounit": "3"
    },
    {
      "code": "17",
      "name": "Javier Orilla",
      "mail": "jo@entelgy.com",
      "ounit": "7"
    },
    {
      "code": "18",
      "name": "Manuel Fajardo",
      "mail": "mf@entelgy.com",
      "ounit": "7"
    },
    {
      "code": "19",
      "name": "Nieves Pichu",
      "mail": "np@entelgy.com",
      "ounit": "6"
    },
    {
      "code": "20",
      "name": "Marcos Balseros",
      "mail": "mb@entelgy.com",
      "ounit": "6"
    },
    {
      "code": "21",
      "name": "Alejandro Hades",
      "mail": "ah@entelgy.com",
      "ounit": "2"
    },
    {
      "code": "22",
      "name": "Carlos Pego",
      "mail": "cp@entelgy.com",
      "ounit": "2"
    },
    {
      "code": "23",
      "name": "Ana Ferrero",
      "mail": "af@entelgy.com",
      "ounit": "1"
    },
    {
      "code": "24",
      "name": "Oscar Montoro",
      "mail": "om@entelgy.com",
      "ounit": "1"
    },
    {
      "code": "25",
      "name": "Ernesto Diaz Isai",
      "mail": "edi@entelgy.com",
      "ounit": "1"
    },
    {
      "code": "26",
      "name": "Oscar Cristobal",
      "mail": "oc@entelgy.com",
      "ounit": "5"
    },
    {
      "code": "27",
      "name": "Alberto Farra",
      "mail": "af@entelgy.com",
      "ounit": "5"
    },
    {
      "code": "28",
      "name": "Daniel Guerrero",
      "mail": "dg@entelgy.com",
      "ounit": "5"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
