var express = require('express');
var router = express.Router();

// GET employees list
router.get('/listEmployees', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  collection.aggregate([
    {
      $project: {
        "_id": 0,
      }
    },
    { $sort: { _id: 1 } }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      res.json(docs)
    }
  })
});

// GET employees para combo modal
router.get('/listEmployeesModal', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": "$employeeId",
        "name": "$employeeName"
      }
    }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      res.json(docs)
    }
  })
});

// GET employee
router.get('/getEmployee/:employeeId', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var docToFind = req.params.employeeId;
  collection.find({ 'employeeId': docToFind }, {}, function (e, docs) {
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
router.delete('/delEmployee/:employeeId', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var userToDelete = req.params.employeeId;
  collection.remove({ 'employeeId': userToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateEmployee
router.put('/updateEmployee/:employeeId', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var userToUpdate = req.params.employeeId;
  collection.update({ 'employeeId': userToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PATCH updateEmployee/:employeeId/oUnitId/:oUnitId
router.patch('/updateEmployee/:employeeId/oUnitId/:oUnitId', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var userToUpdate = req.params.employeeId;
  var newoUnitId = req.params.oUnitId;
  collection.findOneAndUpdate({ 'employeeId': userToUpdate }, { $set: { "oUnitId": newoUnitId } }, function (err) {
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
      "employeeId": "1",
      "employeeName": "Jose Carlos Fernandez",
      "mail": "jcf@entelgy.com",
      "oUnitId": "2"
    },
    {
      "employeeId": "2",
      "employeeName": "Manuel Pérez Vena",
      "mail": "mpv@entelgy.com",
      "oUnitId": "2"
    },
    {
      "employeeId": "3",
      "employeeName": "Maria Jesús Corrillo",
      "mail": "mjc@entelgy.com",
      "oUnitId": "1"
    },
    {
      "employeeId": "4",
      "employeeName": "Almudena Duero",
      "mail": "ad@entelgy.com",
      "oUnitId": "1"
    },
    {
      "employeeId": "5",
      "employeeName": "Rafael Montañez",
      "mail": "rm@entelgy.com",
      "oUnitId": "1"
    },
    {
      "employeeId": "6",
      "employeeName": "Sergio Ramirez",
      "mail": "sr@entelgy.com",
      "oUnitId": "5"
    },
    {
      "employeeId": "7",
      "employeeName": "Alfonso Sanchez",
      "mail": "as@entelgy.com",
      "oUnitId": "5"
    },
    {
      "employeeId": "8",
      "employeeName": "Yolanda Soltero",
      "mail": "ys@entelgy.com",
      "oUnitId": "3"
    },
    {
      "employeeId": "9",
      "employeeName": "Alvaro Noviciado",
      "mail": "an@entelgy.com",
      "oUnitId": "7"
    },
    {
      "employeeId": "10",
      "employeeName": "Trinidad Pueblo",
      "mail": "tp@entelgy.com",
      "oUnitId": "7"
    },
    {
      "employeeId": "11",
      "employeeName": "Ivan de la Sierra",
      "mail": "idls@entelgy.com",
      "oUnitId": "6"
    },
    {
      "employeeId": "12",
      "employeeName": "Antonio Alfarero",
      "mail": "aa@entelgy.com",
      "oUnitId": "6"
    },
    {
      "employeeId": "13",
      "employeeName": "Fernando Duque",
      "mail": "fd@entelgy.com",
      "oUnitId": ""
    },
    {
      "employeeId": "14",
      "employeeName": "Luis Pared",
      "mail": "lp@entelgy.com",
      "oUnitId": ""
    },
    {
      "employeeId": "15",
      "employeeName": "Maria de los Ángeles Frasco",
      "mail": "maf@entelgy.com",
      "oUnitId": "3"
    },
    {
      "employeeId": "16",
      "employeeName": "Rosa Cinesal",
      "mail": "rs@entelgy.com",
      "oUnitId": "3"
    },
    {
      "employeeId": "17",
      "employeeName": "Javier Orilla",
      "mail": "jo@entelgy.com",
      "oUnitId": "7"
    },
    {
      "employeeId": "18",
      "employeeName": "Manuel Fajardo",
      "mail": "mf@entelgy.com",
      "oUnitId": "7"
    },
    {
      "employeeId": "19",
      "employeeName": "Nieves Pichu",
      "mail": "np@entelgy.com",
      "oUnitId": "6"
    },
    {
      "employeeId": "20",
      "employeeName": "Marcos Balseros",
      "mail": "mb@entelgy.com",
      "oUnitId": "6"
    },
    {
      "employeeId": "21",
      "employeeName": "Alejandro Hades",
      "mail": "ah@entelgy.com",
      "oUnitId": "2"
    },
    {
      "employeeId": "22",
      "employeeName": "Carlos Pego",
      "mail": "cp@entelgy.com",
      "oUnitId": "2"
    },
    {
      "employeeId": "23",
      "employeeName": "Ana Ferrero",
      "mail": "af@entelgy.com",
      "oUnitId": "1"
    },
    {
      "employeeId": "24",
      "employeeName": "Oscar Montoro",
      "mail": "om@entelgy.com",
      "oUnitId": "1"
    },
    {
      "employeeId": "25",
      "employeeName": "Ernesto Diaz Isai",
      "mail": "edi@entelgy.com",
      "oUnitId": "1"
    },
    {
      "employeeId": "26",
      "employeeName": "Oscar Cristobal",
      "mail": "oc@entelgy.com",
      "oUnitId": "5"
    },
    {
      "employeeId": "27",
      "employeeName": "Alberto Farra",
      "mail": "af@entelgy.com",
      "oUnitId": "5"
    },
    {
      "employeeId": "28",
      "employeeName": "Daniel Guerrero",
      "mail": "dg@entelgy.com",
      "oUnitId": "5"
    },
    {
      "employeeId": "29",
      "employeeName": "Ruben Olmos",
      "mail": "ro@entelgy.com",
      "oUnitId": "5"
    },
    {
      "employeeId": "30",
      "employeeName": "Daniel Quesadilla",
      "mail": "dq@entelgy.com",
      "oUnitId": "5"
    },
    {
      "employeeId": "31",
      "employeeName": "Javier Carmena",
      "mail": "jc@entelgy.com",
      "oUnitId": "5"
    },
    {
      "employeeId": "32",
      "employeeName": "Raul Valorallanos",
      "mail": "rv@entelgy.com",
      "oUnitId": "6"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: employees collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
