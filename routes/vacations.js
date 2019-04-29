var express = require('express');
var router = express.Router();

// GET vacations list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('vacations');
  let totalRecords = 0

  collection.count({}).then((count) => {
    totalRecords = count
  })

  collection.aggregate([
    /*{
      $addFields: {
        orgsUnits: {
          $reduce: {
            input: { $setUnion: ["$days.orgsUnits"] },
            initialValue: [],
            in: { $concatArrays: ["$$value", "$$this"] }
          }
        },
        activities: {
          $reduce: {
            input: { $setUnion: ["$days.activities"] },
            initialValue: [],
            in: { $concatArrays: ["$$value", "$$this"] }
          }
        }
      }
    },*/
    {
      $lookup: {
        from: "employees",
        localField: "employeeId",
        foreignField: "id",
        as: "employee"
      }
    },
    { $unwind: "$employee" },
    {
      $project: {
        _id: 0,
        id: 1,
        year: 1,
        "employee.id": "$employee.id",
        "employee.name": "$employee.name",
        "employee.code": "$employee.code",

        totalDays: 1,
        "consumedDays": {
          $size: {
            $filter: {
              input: "$days",
              as: "day",
              cond: { $eq: ["$$day.status", "approved"] }
            }
          }
        },
        //"orgsUnits": 1,
        //"activities": 1
      },
    },
    { $unwind: "$employee" }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      let result = {
        vacations: docs,
        totalRecords: totalRecords
      }
      res.json(result)
    }
  })
});

// GET vacation (id = id)
/*router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('vacations');
  var docToFind = req.params.id;
  collection.findOne({ 'id': docToFind }, {}, function (e, docs) {
    res.json(docs);
  });
});*/

// GET vacation (id = id)
router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('vacations');
  var docToFind = Number(req.params.id);

  collection.aggregate([

    {
      $match: {
        id: docToFind
      }
    },
    {
      $lookup: {
        from: "employees",
        localField: "employeeId",
        foreignField: "id",
        as: "employee"
      }
    },
    { $unwind: "$employee" },
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
        localField: "orgUnitId",
        foreignField: "id",
        as: "orgUnit"
      }
    },
    { $unwind: "$orgUnit" },
    {
      $project: {
        _id: 0,
        id: 1,
        year: 1,
        "employee.id": "$employee.id",
        "employee.name": "$employee.name",
        "employee.code": "$employee.code",
        "manager.id": "$manager.id",
        "manager.name": "$manager.name",
        "orgUnit.id": "$orgUnit.id",
        "orgUnit.name": "$orgUnit.name",
        totalDays: 1,
        "approvedDays": 1,
        "consumedDays": 1,
        "pendingDays": 1,
        "totalAvailableDays": 1,
        "requests": 1,
        vacationDates: "$days",
        "nonWorkingDays": 1,
        version: 1
      }
    }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      let result

      if (docToFind != 100) {
        result = {
          vacation: docs[0],
        }

      } else {
        result = {
          vacation: {
            year: 2019, totalDays: 22, consumedDays: 1, approvedDays: 0, pendingDays: 0, totalAvailableDays: 21,
            employee: { name: "Gerardo Pérez González" },
            manager: { name: "Gerardo Pérez González" },
            vacationDates: [{ comment: "Navidad", date: "2019-12-27", status: "CONSUMED", requestDate: "2018-12-28" }],
            nonWorkingDays: ["2019-02-19", "2019-02-20", "2019-02-17", "2019-02-18", "2019-02-12", "2019-02-13", "2019-02-14", "2019-02-15"],
            version: 1
          }
        }
      }

      res.json(result)
    }
  })
});

// GET vacation years list
router.get('/listVacationYears', function (req, res) {
  var db = req.db;
  var collection = db.get('vacations');
  collection.distinct('year', function (e, docs) {
    res.json(docs);
  });
});

// GET vacation years list
router.get('/requests/list', function (req, res) {

  docs = {
    totalRecords: 5,
    vacationRequests: [
      {
        id: 1,
        employee: {
          id: 1,
          name: 'EMPLEADO 1'
        },
        vacationDate: '2019/04/06',
        requestDate: '2019/01/05',
        status: {
          id: 1,
          name: 'pending'
        },
        comment: 'Comentario blablablabla blabla'
      },
      {
        id: 2,
        employee: {
          id: 2,
          name: 'EMPLEADO 2'
        },
        vacationDate: '2019/06/23',
        requestDate: '2019/02/06',
        status: {
          id: 1,
          name: 'pending'
        },
        comment: 'Comentario blablablabla blabla'
      },
      {
        id: 3,
        employee: {
          id: 1,
          name: 'EMPLEADO 1'
        },
        vacationDate: '2019/07/16',
        requestDate: '2019/01/05',
        status: {
          id: 2,
          name: 'approved'
        },
        comment: 'Comentario blablablabla blabla'
      },
      {
        id: 4,
        employee: {
          id: 2,
          name: 'EMPLEADO 2'
        },
        vacationDate: '2019/11/17',
        requestDate: '2019/04/23',
        status: {
          id: 3,
          name: 'rejected'
        },
        comment: 'Comentario ble ble bleble'
      },
      {
        id: 5,
        employee: {
          id: 3,
          name: 'EMPLEADO 3'
        },
        vacationDate: '2019/10/11',
        requestDate: '2019/04/06',
        status: {
          id: 2,
          name: 'approved'
        },
        comment: 'Comentario blibliblbilbi'
      },
    ]
  }
  res.json(docs)

});

router.put('/update/:id', function (req, res) {
  res.send({ msg: 'La actividad ha sido modificada con éxito - MOCK' })
});

// GET resetCollectionVacations
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('vacations');
  collection.remove({});
  collection.insert([
    {
      id: 1,
      version: 1,
      year: 2019,
      employeeId: 1,
      managerId: 30,
      orgUnitId: 2,
      totalDays: 22,
      approvedDays: 1,
      consumedDays: 0,
      pendingDays: 1,
      totalAvailableDays: 20,
      days: [
        {
          id: 1,
          date: "2019-04-23",
          comment: "vacacion1",
          requestDate: "2018-01-01",
          status: "PENDING",
          validations: [
            {
              status: "REJECTED",
              employeeCode: "79000001500"
            },
            {
              status: "APPROVED",
              employeeCode: "79000000004"
            },
            {
              status: "APPROVED",
              employeeCode: "79000002374"
            },
            {
              status: "APPROVED",
              employeeCode: "79000000007"
            }
          ]
        },
        {
          id: 2,
          date: "2019-03-15",
          comment: "vacacion2",
          requestDate: "2018-01-01",
          responseDate: "2018-01-05",
          status: "approved",
        },
        {
          id: 3,
          date: "2019-02-01",
          comment: "vacacion3",
          requestDate: "2018-01-07",
          responseDate: "2018-01-09",
          status: "cancelled",
        }
      ],
      nonWorkingDays: [
        "2019-01-01",
        "2019-01-06",
        "2019-05-01",
        "2019-08-15",
        "2019-10-12",
        "2019-11-01",
        "2019-12-06",
        "2019-12-08",
        "2019-12-25"
      ]
    },
    {
      id: 2,
      version: 3,
      year: 2018,
      employeeId: 1,
      totalDays: 22,
      days: [
        {
          date: "2018-01-01",
          comment: "vacacion1",
          status: "pending",
        },
        {
          date: "2018-03-15",
          comment: "vacacion2",
          status: "approved",
        },
        {
          date: "2018-05-01",
          comment: "vacacion3",
          status: "cancelled",
        }
      ]
    },
    {
      id: 7,
      year: 2016,
      employeeId: 2,
      totalDays: 22,
      days: [
        {
          date: "2016-01-15",
          comment: "vacacion1",
          status: "pending",
        },
        {
          date: "2016-01-16",
          comment: "vacacion2",
          status: "approved",
        },
        {
          date: "2016-03-21",
          comment: "vacacion3",
          status: "cancelled",
        }
      ]
    },
    {
      id: 3,
      year: 2017,
      employeeId: 2,
      totalDays: 20,
      days: [
        {
          date: "2017-02-23",
          comment: "vacacion1",
          status: "approved",
        },
        {
          date: "2017-02-15",
          comment: "vacacion2",
          status: "approved",
        },
        {
          date: "2017-02-01",
          comment: "vacacion3",
          status: "cancelled",
        }
      ]
    },
    {
      id: 4,
      year: 2017,
      employeeId: 3,
      totalDays: 22,
      days: [
        {
          date: "2017-04-23",
          comment: "vacacion",
          status: "pending",
        }
      ]
    },
    {
      id: 5,
      year: 2017,
      employeeId: 4,
      totalDays: 22,
      days: [
        {
          date: "2017-04-23",
          comment: "vacacion",
          status: "pending",
        }
      ]
    },
    {
      id: 6,
      year: 2017,
      employeeId: 5,
      totalDays: 22,
      days: [
        {
          date: "2017-01-23",
          comment: "vacacion",
          status: "pending",
        }
      ]
    },


  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: vacations collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
