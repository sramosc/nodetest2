var express = require('express');
var router = express.Router();

router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('orgsUnits');
  collection.find({}, { fields: { id: 1, name: 1,erpId:1, _id: 0 } }, function (e, docs) {
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

router.get('/list2', function (req, res) {
  return res.json({ "totalRecords": 2, "orgsUnits": [{ "id": 53, "name": "entelgy desc" }, { "id": 54, "name": "digital desc", "pathToTop": [{ "id": 53 }], "orgUnitParent": { "id": 53 } }] })
});


//orgUnit
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('orgsUnits');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": 1,
        "name": 1,
        "orgUnitParent.id": "$orgUnitParentId"
      }
    }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      let result = {
        orgsUnits: docs
      }
      res.json(result)
    }
  })
});

// GET orgUnit
router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('orgsUnits');
  var docToFind = Number(req.params.id);

  collection.aggregate([
    {
      $match: { 'id': docToFind }
    },
    {
      $lookup: {
        from: "employees",
        localField: "managerId",
        foreignField: "id",
        as: "manager"
      }
    },
    { $unwind: "$manager" },
    {
      $lookup: {
        from: "orgsUnits",
        localField: "orgUnitParentId",
        foreignField: "id",
        as: "orgUnitParent"
      }
    },
    {
      $unwind: {
        path: "$orgUnitParent",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
      $lookup: {
        from: "orgsUnitsTypes",
        localField: "orgUnitTypeId",
        foreignField: "id",
        as: "orgUnitType"
      }
    },
    { $unwind: "$orgUnitType" },
    {
      $project: {
        "_id": 0,
        "id": 1,
        "manager.id": 1,
        "manager.name": 1,
        "name": 1,
        "description": 1,
        "orgUnitType.id": 1,
        "orgUnitType.name": 1,
        "erpId": 1,
        "noticeToManagerHolidays": 1,
        "noticeToManagerExpenditures": 1,
        "noticeToManagerWorkReports": 1,
        "orgUnitParent.id": 1,
        "orgUnitParent.name": 1
      }
    }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      docs[0].version = 1
      let result = {
        orgUnit: docs[0]
      }
      res.json(result)
    }
  })
});

// POST addEmployee.
router.post('/add', function (req, res) {
  var db = req.db;
  var collection = db.get('orgsUnits');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE delEmployee
router.delete('/del/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('orgsUnits');
  var docToDelete = req.params.id;
  collection.remove({ 'id': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateEmployee
router.put('/update/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('orgsUnits');
  var docToUpdate = req.params.id;
  collection.update({ 'id': docToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});


// GET reset orgsUnits
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('orgsUnits');
  collection.remove({});
  collection.insert([
    {
      id: 1,
      managerId: 1,
      name: 'HIVERIA 04 MLA',
      description: '',
      orgUnitTypeId: 1,
      erpId: "100000/100000/ES010000",
      noticeToManagerHolidays: true,
      noticeToManagerExpenditures: false,
      noticeToManagerWorkReports: true,
      orgUnitParentId: 0
    },
    {
      id: 2,
      managerId: 12,
      name: 'MANUAL ARCHITECTURE',
      description: '',
      orgUnitTypeId: 2,
      erpId: "200000/200000/ES020000",
      noticeToManagerHolidays: false,
      noticeToManagerExpenditures: true,
      noticeToManagerWorkReports: true,
      orgUnitParentId: 1
    },
    {
      id: 3,
      managerId: 23,
      name: 'OGT-A2M-RIA',
      description: '',
      orgUnitTypeId: 3,
      erpId: "300000/300000/ES030000",
      noticeToManagerHolidays: true,
      noticeToManagerExpenditures: false,
      noticeToManagerWorkReports: false,
      orgUnitParentId: 1
    },
    {
      id: 4,
      managerId: 24,
      name: 'B&M AREA IT',
      description: '',
      orgUnitTypeId: 2,
      erpId: "500000/500000/ES050000",
      noticeToManagerHolidays: false,
      noticeToManagerExpenditures: true,
      noticeToManagerWorkReports: true,
      orgUnitParentId: 2
    },
    {
      id: 5,
      managerId: 25,
      name: 'OFICINA DE PROYECTOS',
      description: '',
      orgUnitTypeId: 2,
      erpId: "400000/400000/ES040000",
      noticeToManagerHolidays: true,
      noticeToManagerExpenditures: false,
      noticeToManagerWorkReports: true,
      orgUnitParentId: 3
    },
    {
      id: 6,
      managerId: 26,
      name: 'SOFTWARE LIBRE',
      description: '',
      orgUnitTypeId: 1,
      erpId: "340000/400000/ES030000",
      noticeToManagerHolidays: true,
      noticeToManagerExpenditures: true,
      noticeToManagerWorkReports: true,
      orgUnitParentId: 3
    },
    {
      id: 7,
      managerId: 27,
      name: 'JANDERS KLANDERS',
      description: '',
      orgUnitTypeId: 1,
      erpId: "400000/230043/ES040000",
      noticeToManagerHolidays: true,
      noticeToManagerExpenditures: false,
      noticeToManagerWorkReports: true,
      orgUnitParentId: 6
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: orgsUnits collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
