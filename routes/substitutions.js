var express = require('express');
var router = express.Router();

// GET substitutions list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('substitutions');
  let substitutionsPipeline = []
  let countPipeline = []

  let pipeline = [
    {
      $lookup: {
        from: "employees",
        localField: "employeeSubstituteId",
        foreignField: "id",
        as: "employeeSubstitute"
      }
    },
    {
      $unwind: {
        path: "$employeeSubstitute",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
      $lookup: {
        from: "employees",
        localField: "employeeReplacedId",
        foreignField: "id",
        as: "employeeReplaced"
      }
    },
    {
      $unwind: {
        path: "$employeeReplaced",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
      $project: {
        "_id": 0,
        id: 1,
        "employeeSubstitute.name": 1,
        "employeeSubstitute.id": 1,
        "employeeReplaced.name": 1,
        "employeeReplaced.id": 1,
        startedOn: 1,
        finishedOn: 1,
        checkSubstitution: "$active",
      }
    }]

  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
    console.log("sin query params")
  } else {

    let matchStage = {}
    let sortStage = {}
    let matchExists = false

    // match stage
    if ('id' in req.query) {
      matchStage.id = Number(req.query.id)
      matchExists = true
    }

    if (Number(req.query.employeeSubstituteId)) {
      if ('employeeSubstituteId' in req.query) {
        matchStage['employeeSubstitute.id'] = Number(req.query.employeeSubstituteId)
        matchExists = true
      }
    }

    if (Number(req.query.employeeReplacedId)) {
      if ('employeeReplacedId' in req.query) {
        matchStage['employeeReplaced.id'] = Number(req.query.employeeReplacedId)
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
      substitutionsPipeline = pipeline.slice()
      substitutionsPipeline.push({ $skip: (req.query.pageNumber - 1) * req.query.pageSize })
      substitutionsPipeline.push({ $limit: parseInt(req.query.pageSize) })
    }
  }

  countPipeline = pipeline.slice()
  countPipeline.push({ $count: 'count' })

  console.log(substitutionsPipeline)
  console.log(countPipeline)

  let pipeline2 = [
    {
      $facet: {
        substitutions: substitutionsPipeline,
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
          substitutions: docs[0].substitutions,
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
        name: 1
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
  var docToFind = Number(req.params.id);
  collection.aggregate([
    {
      $match: { 'id': docToFind }
    },
    {
      $lookup: {
        from: "orgsUnits",
        localField: "orgUnitId",
        foreignField: "id",
        as: "orgUnit"
      }
    },
    { $unwind: "$orgUnit" },
    {
      $project: {
        "_id": 0,
        "id": 1,
        "name": 1,
        "code": 1,
        "orgUnit.id": "$orgUnit.id",
        "orgUnit.name": "$orgUnit.name",
      }
    }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      docs[0].version = 1
      let result = {
        employee: docs[0]
      }
      res.json(result)
    }
  })
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
  collection.findOneAndUpdate({ 'id': userToUpdate }, { $set: { orgUnitId: neworgUnitId } }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});


// GET resetCollectionEmployees
// MEJORA: asdasd

router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('substitutions');
  collection.remove({});
  collection.insert([
    {
      id: 1,
      employeeSubstituteId: 3,
      employeeReplacedId: 5,
      startedOn: '2019-01-01',
      finishedOn: '2019-04-06',
      active: true
    },
    {
      id: 2,
      employeeSubstituteId: 4,
      employeeReplacedId: 8,
      startedOn: '2019-01-01',
      finishedOn: '2019-04-06',
      active: false
    },
    {
      id: 3,
      employeeSubstituteId: 5,
      employeeReplacedId: 6,
      startedOn: '2019-01-01',
      active: true
    },
    {
      id: 4,
      employeeSubstituteId: 5,
      employeeReplacedId: 7,
      startedOn: '2019-02-01',
      finishedOn: '2019-07-06',
      active: true
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: substitutions collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
