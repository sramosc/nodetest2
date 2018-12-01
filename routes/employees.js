var express = require('express');
var router = express.Router();

// GET employees list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  let totalRecords = 0

  let pipeline = [{
    $lookup: {
      from: "ounits",
      localField: "oUnitId",
      foreignField: "id",
      as: "ounit"
    }
  },
  {
    $unwind: {
      path: "$ounit",
      "preserveNullAndEmptyArrays": true
    }
  },
  {
    $project: {
      "_id": 0,
      "id": 1,
      "name": 1,
      "ounit.id": 1,
      "ounit.name": 1,
      "mail": 1
    }
  }]

  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
    console.log("sin query params")
  } else {

    let matchStage = {}
    let sortStage = {}
    let matchExists = false

    // match stage
    if ('name' in req.query) {
      matchStage.name = {
        $regex: req.query.name,
        $options: 'i'
      }
      matchExists = true
    }
    if ('assigned' in req.query) {
      if (Number(req.query.assigned) === 1) {
        if ('oUnitId' in req.query) {
          matchStage['ounit.id'] = Number(req.query.oUnitId)
          matchExists = true
        }
      }
      else {
        matchStage['ounit.id'] = {$exists: false}
        matchExists = true
      }
    }
    collection.find(matchStage, '-_id', function (e, docs) {
      totalRecords = docs.length
    })

    // sort stage
    if ('pageSort' in req.query) {
      let field = req.query.pageSort
      let orderAsc = true
      if (req.query.pageSort.indexOf('-')) {
        orderAsc = false
      }
      field = field.replace('-', '')
      if (orderAsc) {
        sortStage[field] = -1
      } else {
        sortStage[field] = 1
      }
    }
    pipeline.push({ $match: matchStage })
    pipeline.push({ $sort: sortStage })

    // skip and limit stage
    if (('pageNumber' in req.query) && ('pageSize' in req.query)) {

      pipeline.push({ $skip: (req.query.pageNumber - 1) * req.query.pageSize })
      pipeline.push({ $limit: parseInt(req.query.pageSize) })
    }
  }

  console.log(pipeline)
  collection.aggregate(pipeline
    , {}, function (e, docs) {
      if (e != null) {
        res.json(e)
      } else {
        let result = {
          employees: docs,
          totalRecords: totalRecords
        }
        res.json(result)
      }
    })
});

// GET employees para combo modal
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": 1,
        "name": 1
      }
    }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      let result = {
        options: docs
      }
      res.json(result)
    }
  })
});

// GET employee
router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var docToFind = req.params.id;
  collection.find({ 'id': docToFind }, {}, function (e, docs) {
    res.json(docs);
  });
});

// POST addEmployee.
router.post('/add', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE delEmployee
router.delete('/del/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var userToDelete = req.params.id;
  collection.remove({ 'id': userToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateEmployee
router.put('/update/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var userToUpdate = req.params.id;
  collection.update({ 'id': userToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PATCH updateEmployee/:id/oUnitId/:oUnitId
router.patch('/update/:id/oUnitId/:oUnitId', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var userToUpdate = req.params.id;
  var newoUnitId = req.params.oUnitId;
  collection.findOneAndUpdate({ 'id': userToUpdate }, { $set: { "oUnitId": newoUnitId } }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});


// GET resetCollectionEmployees
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  collection.remove({});
  collection.insert([
    {
      "id": 1,
      "name": "Jose Carlos Fernandez",
      "mail": "jcf@entelgy.com",
      "oUnitId": 2
    },
    {
      "id": 2,
      "name": "Manuel Pérez Vena",
      "mail": "mpv@entelgy.com",
      "oUnitId": 2
    },
    {
      "id": 3,
      "name": "Maria Jesús Corrillo",
      "mail": "mjc@entelgy.com",
      "oUnitId": 1
    },
    {
      "id": 4,
      "name": "Almudena Duero",
      "mail": "ad@entelgy.com",
      "oUnitId": 1
    },
    {
      "id": 5,
      "name": "Rafael Montañez",
      "mail": "rm@entelgy.com",
      "oUnitId": 1
    },
    {
      "id": 6,
      "name": "Sergio Ramirez",
      "mail": "sr@entelgy.com",
      "oUnitId": 5
    },
    {
      "id": 7,
      "name": "Alfonso Sanchez",
      "mail": "as@entelgy.com",
      "oUnitId": 5
    },
    {
      "id": 8,
      "name": "Yolanda Soltero",
      "mail": "ys@entelgy.com",
      "oUnitId": 3
    },
    {
      "id": 9,
      "name": "Alvaro Noviciado",
      "mail": "an@entelgy.com",
      "oUnitId": 7
    },
    {
      "id": 10,
      "name": "Trinidad Pueblo",
      "mail": "tp@entelgy.com",
      "oUnitId": 7
    },
    {
      "id": 11,
      "name": "Ivan de la Sierra",
      "mail": "idls@entelgy.com",
      "oUnitId": -1
    },
    {
      "id": 12,
      "name": "Antonio Alfarero",
      "mail": "aa@entelgy.com",
      "oUnitId": 6
    },
    {
      "id": 13,
      "name": "Fernando Duque",
      "mail": "fd@entelgy.com",
      "oUnitId": -1
    },
    {
      "id": 14,
      "name": "Luis Pared",
      "mail": "lp@entelgy.com",
      "oUnitId": -1
    },
    {
      "id": 15,
      "name": "Maria de los Ángeles Frasco",
      "mail": "maf@entelgy.com",
      "oUnitId": 3
    },
    {
      "id": 16,
      "name": "Rosa Cinesal",
      "mail": "rs@entelgy.com",
      "oUnitId": 3
    },
    {
      "id": 17,
      "name": "Javier Orilla",
      "mail": "jo@entelgy.com",
      "oUnitId": 7
    },
    {
      "id": 18,
      "name": "Manuel Fajardo",
      "mail": "mf@entelgy.com",
      "oUnitId": 7
    },
    {
      "id": 19,
      "name": "Nieves Pichu",
      "mail": "np@entelgy.com",
      "oUnitId": 6
    },
    {
      "id": 20,
      "name": "Marcos Balseros",
      "mail": "mb@entelgy.com",
      "oUnitId": 6
    },
    {
      "id": 21,
      "name": "Alejandro Hades",
      "mail": "ah@entelgy.com",
      "oUnitId": 2
    },
    {
      "id": 22,
      "name": "Carlos Pego",
      "mail": "cp@entelgy.com",
      "oUnitId": 2
    },
    {
      "id": 23,
      "name": "Ana Ferrero",
      "mail": "af@entelgy.com",
      "oUnitId": 1
    },
    {
      "id": 24,
      "name": "Oscar Montoro",
      "mail": "om@entelgy.com",
      "oUnitId": 1
    },
    {
      "id": 25,
      "name": "Ernesto Diaz Isai",
      "mail": "edi@entelgy.com",
      "oUnitId": 1
    },
    {
      "id": 26,
      "name": "Oscar Cristobal",
      "mail": "oc@entelgy.com",
      "oUnitId": 5
    },
    {
      "id": 27,
      "name": "Alberto Farra",
      "mail": "af@entelgy.com",
      "oUnitId": 5
    },
    {
      "id": 28,
      "name": "Daniel Guerrero",
      "mail": "dg@entelgy.com",
      "oUnitId": 5
    },
    {
      "id": 29,
      "name": "Ruben Olmos",
      "mail": "ro@entelgy.com",
      "oUnitId": 5
    },
    {
      "id": 30,
      "name": "Daniel Quesadilla",
      "mail": "dq@entelgy.com",
      "oUnitId": 5
    },
    {
      "id": 31,
      "name": "Javier Carmena",
      "mail": "jc@entelgy.com",
      "oUnitId": 5
    },
    {
      "id": 32,
      "name": "Raul Valorallanos",
      "mail": "rv@entelgy.com",
      "oUnitId": 6
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: employees collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
