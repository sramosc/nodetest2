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
        "month.name": 1,
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

router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('workreports');
  /*  var docToFind = req.params.id;
  
    collection.count({}).then((count) => {
      totalRecords = count
    })
  
    collection.aggregate([
  
      {
        $match: { 'id': Number(docToFind) }
      },
  
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
          "month.name": 1,
          "employee.id": 1,
          "employee.name": 1,
          "rows": 1,
          "columns": 1,
          "status": 1
        },
      },
  
    ], {}, function (e, docs) {
      if (e != null) {
        res.json(e)
      } else {
        let workReport = docs[0]
        workReport.version = 1
        let result = {
          workReport: workReport,
        }
        res.json(result)
      }
    })*/
  res.json({
    workReport: {
      year: {
        id: 2019,
        name: '2019'
      },
      month: {
        id: 1,
        name: 'ENERO'
      },
      employee: {
        id: 1,
        name: 'EMPLEADO'
      },
      status: {
        id: 1,
        name: 'APROBADO'
      },
      version: 1,
      days: 31,
      nonWorkingDays: [1,5,6,7,12,13,19,20,26,27],
      activities: [
        {
          id: 1,
          name: 'TOTAL',
          editable: false,
          visible: true,
          childrenAction: 'HIDE',
          children: [2, 6],
          sum: '00:00',
          depth: 0
        }, {
          id: 2,
          name: 'AUSENCIA',
          editable: false,
          visible: true,
          childrenAction: 'HIDE',
          children: [3],
          sum: '00:00',
          depth: 1
        }, {
          id: 3,
          name: 'NF001 - AUSENCIA NO JUSTIFICADA',
          editable: false,
          visible: true,
          childrenAction: 'HIDE',
          children: [4, 5],
          sum: '00:00',
          depth: 2
        }, {
          id: 4,
          name: 'HORAS LABORALES',
          editable: true,
          visible: true,
          childrenAction: 'HIDE',
          children: [],
          day11: '08:00',
          day02: '08:00',
          day03: '08:00',
          day16: '02:00',
          sum:'00:00',
          depth: 3
        }, {
          id: 5,
          name: 'HORAS DE DESARROLLO',
          editable: true,
          visible: true,
          childrenAction: 'HIDE',
          children: [],
          day21: '03:00',
          day22: '01:00',
          day23: '02:00',
          sum: '00:00',
          depth: 3
        }, {
          id: 6,
          name: 'NO FACTURABLE',
          editable: false,
          visible: true,
          childrenAction: 'HIDE',
          children: [7],
          sum: '00:00',
          depth: 1
        }, {
          id: 7,
          name: 'NF003 - FORMACION',
          editable: false,
          visible: true,
          childrenAction: 'HIDE',
          children: [8],
          sum: '00:00',
          depth: 2
        }, {
          id: 8,
          name: 'HORAS LABORALES',
          editable: true,
          visible: true,
          childrenAction: 'HIDE',
          children: [],
          day15: '03:00',
          day22: '02:00',
          day28: '07:00',
          day29: '02:30',
          sum: '00:00',
          depth: 3
        }
      ]
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
      activities: [1, 2, 3],
      status: "APPROVED",
      rows: [
        {
          id: 1,
          name: 'TOTAL',
          expandable: true,
          editable: false,
          children: [2, 3],
          values: []
        },
        {
          id: 2,
          name: 'AUSENCIA',
          expandable: true,
          editable: false,
          children: [4],
          values: []
        },
        {
          id: 3,
          name: 'NO FACTURABLE',
          expandable: true,
          editable: false,
          children: [6],
          values: []
        },
        {
          id: 4,
          name: 'NF002 - AUSENCIA NO JUSTIFICADA',
          expandable: true,
          editable: false,
          children: [5],
          values: []
        },
        {
          id: 5,
          name: 'HORAS LABORABLES',
          expandable: false,
          editable: true,
          children: [],
          values: [
            { day: 1, value: 5 },
            { day: 2, value: 0 },
            { day: 3, value: 2 },
            { day: 4, value: 4 },
            { day: 5, value: 0 },
            { day: 6, value: 0 },
            { day: 7, value: 0 },
            { day: 8, value: 0 },
            { day: 9, value: 0 },
            { day: 10, value: 0 },
            { day: 11, value: 0 },
            { day: 12, value: 0 },
            { day: 13, value: 0 },
            { day: 14, value: 0 },
            { day: 15, value: 0 },
            { day: 16, value: 0 },
            { day: 17, value: 0 },
            { day: 18, value: 0 },
            { day: 19, value: 0 },
            { day: 20, value: 0 },
            { day: 21, value: 0 },
            { day: 22, value: 0 },
            { day: 23, value: 0 },
            { day: 24, value: 0 },
            { day: 25, value: 0 },
            { day: 26, value: 0 },
            { day: 27, value: 0 },
            { day: 28, value: 0 },
            { day: 29, value: 0 },
            { day: 30, value: 0 },
            { day: 31, value: 0 }
          ]
        },
        {
          id: 6,
          name: 'PI006 - INTRANET',
          expandable: true,
          editable: false,
          children: [7],
          values: []
        },
        {
          id: 7,
          name: 'HORAS LABORALES',
          expandable: true,
          editable: false,
          children: [8, 9, 10],
          values: []
        },
        {
          id: 8,
          name: 'HORAS DE DESARROLLO',
          expandable: false,
          editable: true,
          children: [],
          values: [
            { day: 1, value: 0 },
            { day: 2, value: 0 },
            { day: 3, value: 0 },
            { day: 4, value: 0 },
            { day: 5, value: 0 },
            { day: 6, value: 0 },
            { day: 7, value: 0 },
            { day: 8, value: 0 },
            { day: 9, value: 0 },
            { day: 10, value: 0 },
            { day: 11, value: 0 },
            { day: 12, value: 0 },
            { day: 13, value: 1 },
            { day: 14, value: 1 },
            { day: 15, value: 1 },
            { day: 16, value: 1 },
            { day: 17, value: 1 },
            { day: 18, value: 1 },
            { day: 19, value: 1 },
            { day: 20, value: 1 },
            { day: 21, value: 1 },
            { day: 22, value: 1 },
            { day: 23, value: 1 },
            { day: 24, value: 1 },
            { day: 25, value: 0 },
            { day: 26, value: 0 },
            { day: 27, value: 1 },
            { day: 28, value: 1 },
            { day: 29, value: 1 },
            { day: 30, value: 1 },
            { day: 31, value: 1 }
          ]
        },
        {
          id: 9,
          name: 'HORAS DE DOCUMENTACION',
          expandable: false,
          editable: true,
          children: [],
          values: [
            { day: 1, value: 0 },
            { day: 2, value: 0 },
            { day: 3, value: 0 },
            { day: 4, value: 0 },
            { day: 5, value: 0 },
            { day: 6, value: 0 },
            { day: 7, value: 0 },
            { day: 8, value: 0 },
            { day: 9, value: 0 },
            { day: 10, value: 0 },
            { day: 11, value: 0 },
            { day: 12, value: 0 },
            { day: 13, value: 3 },
            { day: 14, value: 3 },
            { day: 15, value: 3 },
            { day: 16, value: 3 },
            { day: 17, value: 3 },
            { day: 18, value: 3 },
            { day: 19, value: 3 },
            { day: 20, value: 3 },
            { day: 21, value: 3 },
            { day: 22, value: 3 },
            { day: 23, value: 3 },
            { day: 24, value: 3 },
            { day: 25, value: 0 },
            { day: 26, value: 0 },
            { day: 27, value: 3 },
            { day: 28, value: 3 },
            { day: 29, value: 3 },
            { day: 30, value: 3 },
            { day: 31, value: 3 }
          ]
        },
        {
          id: 10,
          name: 'HORAS DE ANALISIS',
          expandable: false,
          editable: true,
          children: [],
          values: [
            { day: 1, value: 0 },
            { day: 2, value: 0 },
            { day: 3, value: 0 },
            { day: 4, value: 0 },
            { day: 5, value: 0 },
            { day: 6, value: 0 },
            { day: 7, value: 0 },
            { day: 8, value: 0 },
            { day: 9, value: 0 },
            { day: 10, value: 0 },
            { day: 11, value: 0 },
            { day: 12, value: 0 },
            { day: 13, value: 4 },
            { day: 14, value: 4 },
            { day: 15, value: 4 },
            { day: 16, value: 4 },
            { day: 17, value: 4 },
            { day: 18, value: 4 },
            { day: 19, value: 4 },
            { day: 20, value: 4 },
            { day: 21, value: 4 },
            { day: 22, value: 4 },
            { day: 23, value: 4 },
            { day: 24, value: 4 },
            { day: 25, value: 0 },
            { day: 26, value: 0 },
            { day: 27, value: 4 },
            { day: 28, value: 4 },
            { day: 29, value: 4 },
            { day: 30, value: 4 },
            { day: 31, value: 4 }
          ]
        }
      ]
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
