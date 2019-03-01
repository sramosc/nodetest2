var express = require('express');
var router = express.Router();

// GET vacations list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('workreports');
  let totalRecords = 0

  collection.count({}).then((count) => {
    totalRecords = count
  })

  collection.aggregate([

    {
      $lookup: {
        from: "calendarYears",
        localField: "yearId",
        foreignField: "id",
        as: "year"
      }
    },
    {
      $unwind: {
        path: "$year",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
      $lookup: {
        from: "calendarMonths",
        localField: "monthId",
        foreignField: "id",
        as: "month"
      }
    },
    {
      $unwind: {
        path: "$month",
        "preserveNullAndEmptyArrays": true
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
      $project: {
        _id: 0,
        id: 1,
        "year.id": 1,
        "year.name": 1,
        "month.id": 1,
        "month.name":1,
        "employee.id": 1,
        "employee.name": 1
      },
    },

  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      let result = {
        workReports: docs,
        totalRecords: totalRecords
      }
      res.json(result)
    }
  })
});


// GET resetCollectionVacations
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('workreports');
  collection.remove({});
  collection.insert([
    {
      id: 1,
      employeeId: 1,
      yearId: 2018,
      monthId: 1,
      activities: [1, 2, 3]
    },
    {
      id: 2,
      employeeId: 1,
      yearId: 2018,
      monthId: 2,
      activities: [2]
    },
    {
      id: 3,
      employeeId: 1,
      yearId: 2018,
      monthId: 3,
      activities: [1]
    },
    {
      id: 4,
      employeeId: 1,
      yearId: 2018,
      monthId: 4,
      activities: [1, 2, 3, 4]
    },
    {
      id: 5,
      employeeId: 1,
      yearId: 2018,
      monthId: 5,
      activities: [2, 5]
    },
    {
      id: 6,
      employeeId: 1,
      yearId: 2018,
      monthId: 6,
      activities: [5]
    },
    {
      id: 7,
      employeeId: 1,
      yearId: 2018,
      monthId: 7,
      activities: [1]
    },
    {
      id: 8,
      employeeId: 2,
      yearId: 2018,
      monthId: 1,
      activities: [1, 3]
    },
    {
      id: 9,
      employeeId: 2,
      yearId: 2018,
      monthId: 2,
      activities: [1, 4]
    },
    {
      id: 10,
      employeeId: 2,
      yearId: 2018,
      monthId: 3,
      activities: [2, 3]
    },
    {
      id: 11,
      employeeId: 1,
      yearId: 2019,
      monthId: 1,
      activities: [3]
    },
    {
      id: 12,
      employeeId: 1,
      yearId: 2019,
      monthId: 2,
      activities: [3]
    },
    {
      id: 13,
      employeeId: 1,
      yearId: 2019,
      monthId: 3,
      activities: [1]
    },
    {
      id: 14,
      employeeId: 1,
      yearId: 2019,
      monthId: 4,
      activities: [4, 5]
    },
    {
      id: 15,
      employeeId: 2,
      yearId: 2019,
      monthId: 1,
      activities: [2, 4]
    },
    {
      id: 16,
      employeeId: 2,
      yearId: 2019,
      monthId: 2,
      activities: [1, 3]
    },
    {
      id: 17,
      employeeId: 2,
      yearId: 2019,
      monthId: 3,
      activities: [3]
    },
    {
      id: 18,
      employeeId: 2,
      yearId: 2019,
      monthId: 4,
      activities: [1]
    },
    {
      id: 19,
      employeeId: 2,
      yearId: 2019,
      monthId: 5,
      activities: [2]
    },
    {
      id: 20,
      employeeId: 2,
      yearId: 2019,
      monthId: 6,
      activities: [2, 4, 5]
    }

  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: workreports collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
