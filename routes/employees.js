var express = require('express');
var router = express.Router();

// GET employees list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  let totalRecords = 0
  let employeesPipeline = []
  let countPipeline = []

  let pipeline = [{
    $lookup: {
      from: "orgsUnits",
      localField: "orgUnitId",
      foreignField: "id",
      as: "orgUnit"
    }
  },
  {
    $unwind: {
      path: "$orgUnit",
      "preserveNullAndEmptyArrays": true
    }
  },
  {
    $project: {
      "_id": 0,
      "id": 1,
      "name": 1,
      "orgUnit.id": 1,
      "orgUnit.name": 1,
      "email": 1
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
        if ('orgUnitId' in req.query) {
          matchStage['orgUnit.id'] = Number(req.query.orgUnitId)
          matchExists = true
        }
      }
      else {
        matchStage['orgUnit.id'] = { $exists: false }
        matchExists = true
      }
    }

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
    if (matchExists) {
      pipeline.push({ $match: matchStage })
    }

    pipeline.push({ $sort: sortStage })


    // skip and limit stage
    if (('pageNumber' in req.query) && ('pageSize' in req.query)) {
      employeesPipeline = pipeline.slice()
      employeesPipeline.push({ $skip: (req.query.pageNumber - 1) * req.query.pageSize })
      employeesPipeline.push({ $limit: parseInt(req.query.pageSize) })
    }
  }

  countPipeline = pipeline.slice()
  countPipeline.push({ $count: 'count' })

  let pipeline2 = [
    {
      $facet: {
        employees: employeesPipeline,
        totalRecords: countPipeline
      }
    }
  ]

  console.log(pipeline2)
  collection.aggregate(pipeline2
    , {}, function (e, docs) {
      if (e != null) {
        res.json(e)
      } else {
        let result = {
          employees: docs[0].employees,
          totalRecords: docs[0].totalRecords[0].count
        }
        res.json(result)
      }
    })
});

// GET employees selection v.2
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  let totalRecords = 0
  let employeesPipeline = []
  let countPipeline = []

  let pipeline = [
  {
    $project: {
      "_id": 0,
      "id": 1,
      "name": 1,
    }
  }]

  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
    console.log("sin query params")
  } else {

    let matchStage = {}
    let sortStage = {}
    let matchExists = false

    // match stage
    if ('find' in req.query) {
      matchStage.name = {
        $regex: req.query.find,
        $options: 'i'
      }
      matchExists = true
    }

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
    if (matchExists) {
      pipeline.push({ $match: matchStage })
    }

    pipeline.push({ $sort: sortStage })


    // skip and limit stage
    if (('pageNumber' in req.query) && ('pageSize' in req.query)) {
      employeesPipeline = pipeline.slice()
      employeesPipeline.push({ $skip: (req.query.pageNumber - 1) * req.query.pageSize })
      employeesPipeline.push({ $limit: parseInt(req.query.pageSize) })
    }
  }

  countPipeline = pipeline.slice()
  countPipeline.push({ $count: 'count' })

  let pipeline2 = [
    {
      $facet: {
        employees: employeesPipeline,
        totalRecords: countPipeline
      }
    }
  ]

  console.log(pipeline2)
  collection.aggregate(pipeline2
    , {}, function (e, docs) {
      if (e != null) {
        res.json(e)
      } else {
        let result = {
          options: docs[0].employees,
          totalRecords: docs[0].totalRecords[0].count
        }
        res.json(result)
      }
    })
});

// GET employees para combo modal
router.get('/selectionv1', function (req, res) {
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

// PATCH updateEmployee/:id/orgUnitId/:orgUnitId
router.patch('/update/:id/orgUnitId/:orgUnitId', function (req, res) {
  var db = req.db;
  var collection = db.get('employees');
  var userToUpdate = req.params.id;
  var neworgUnitId = req.params.orgUnitId;
  collection.findOneAndUpdate({ 'id': userToUpdate }, { $set: { "orgUnitId": neworgUnitId } }, function (err) {
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
      "email": "jcf@entelgy.com",
      "orgUnitId": 2
    },
    {
      "id": 2,
      "name": "Manuel Pérez Vena",
      "email": "mpv@entelgy.com",
      "orgUnitId": 2
    },
    {
      "id": 3,
      "name": "Maria Jesús Corrillo",
      "email": "mjc@entelgy.com",
      "orgUnitId": 1
    },
    {
      "id": 4,
      "name": "Almudena Duero",
      "email": "ad@entelgy.com",
      "orgUnitId": 1
    },
    {
      "id": 5,
      "name": "Rafael Montañez",
      "email": "rm@entelgy.com",
      "orgUnitId": 1
    },
    {
      "id": 6,
      "name": "Sergio Ramirez",
      "email": "sr@entelgy.com",
      "orgUnitId": 5
    },
    {
      "id": 7,
      "name": "Alfonso Sanchez",
      "email": "as@entelgy.com",
      "orgUnitId": 5
    },
    {
      "id": 8,
      "name": "Yolanda Soltero",
      "email": "ys@entelgy.com",
      "orgUnitId": 3
    },
    {
      "id": 9,
      "name": "Alvaro Noviciado",
      "email": "an@entelgy.com",
      "orgUnitId": 7
    },
    {
      "id": 10,
      "name": "Trinidad Pueblo",
      "email": "tp@entelgy.com",
      "orgUnitId": 7
    },
    {
      "id": 11,
      "name": "Ivan de la Sierra",
      "email": "idls@entelgy.com",
      "orgUnitId": -1
    },
    {
      "id": 12,
      "name": "Antonio Alfarero",
      "email": "aa@entelgy.com",
      "orgUnitId": 6
    },
    {
      "id": 13,
      "name": "Fernando Duque",
      "email": "fd@entelgy.com",
      "orgUnitId": -1
    },
    {
      "id": 14,
      "name": "Luis Pared",
      "email": "lp@entelgy.com",
      "orgUnitId": -1
    },
    {
      "id": 15,
      "name": "Maria de los Ángeles Frasco",
      "email": "maf@entelgy.com",
      "orgUnitId": 3
    },
    {
      "id": 16,
      "name": "Rosa Cinesal",
      "email": "rs@entelgy.com",
      "orgUnitId": 3
    },
    {
      "id": 17,
      "name": "Javier Orilla",
      "email": "jo@entelgy.com",
      "orgUnitId": 7
    },
    {
      "id": 18,
      "name": "Manuel Fajardo",
      "email": "mf@entelgy.com",
      "orgUnitId": 7
    },
    {
      "id": 19,
      "name": "Nieves Pichu",
      "email": "np@entelgy.com",
      "orgUnitId": 6
    },
    {
      "id": 20,
      "name": "Marcos Balseros",
      "email": "mb@entelgy.com",
      "orgUnitId": 6
    },
    {
      "id": 21,
      "name": "Alejandro Hades",
      "email": "ah@entelgy.com",
      "orgUnitId": 2
    },
    {
      "id": 22,
      "name": "Carlos Pego",
      "email": "cp@entelgy.com",
      "orgUnitId": 2
    },
    {
      "id": 23,
      "name": "Ana Ferrero",
      "email": "af@entelgy.com",
      "orgUnitId": 1
    },
    {
      "id": 24,
      "name": "Oscar Montoro",
      "email": "om@entelgy.com",
      "orgUnitId": 1
    },
    {
      "id": 25,
      "name": "Ernesto Diaz Isai",
      "email": "edi@entelgy.com",
      "orgUnitId": 1
    },
    {
      "id": 26,
      "name": "Oscar Cristobal",
      "email": "oc@entelgy.com",
      "orgUnitId": 5
    },
    {
      "id": 27,
      "name": "Alberto Farra",
      "email": "af@entelgy.com",
      "orgUnitId": 5
    },
    {
      "id": 28,
      "name": "Daniel Guerrero",
      "email": "dg@entelgy.com",
      "orgUnitId": 5
    },
    {
      "id": 29,
      "name": "Ruben Olmos",
      "email": "ro@entelgy.com",
      "orgUnitId": 5
    },
    {
      "id": 30,
      "name": "Daniel Quesadilla",
      "email": "dq@entelgy.com",
      "orgUnitId": 5
    },
    {
      "id": 31,
      "name": "Javier Carmena",
      "email": "jc@entelgy.com",
      "orgUnitId": 5
    },
    {
      "id": 32,
      "name": "Raul Valorallanos",
      "email": "rv@entelgy.com",
      "orgUnitId": 6
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: employees collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
