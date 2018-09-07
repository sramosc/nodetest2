var express = require('express');
var router = express.Router();

// GET activities list
router.get('/listActivities', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

// List employees by activity
// devuelve el listado de los empleados que hayan estado vinculados a una actividad determinada
router.get('/listEmployeesInActivity/:activityId', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  var docToFind = req.params.activityId;
  collection.find({ 'activityId': docToFind }, { 'team.employeeId': 1 }, function (e, docs) {
    res.json(docs);
  });
});

// List employees by ounits
// devuelve el listado de los empleados que hayan estado vinculados a una unidad organizativa determinada y hayan realizado actividades en ella
router.get('/listEmployeesInOUnit/:oUnitId', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  var docToFind = req.params.oUnitId;
  collection.find({ 'ounit': docToFind }, { 'team.employeeId': 1 }, function (e, docs) {
    res.json(docs);
  });
});

// List employees activities by year

// GET resetCollectionActivities
router.get('/resetCollectionActivities', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  collection.remove({});
  collection.insert([
    {
      "activityId": "1",
      "activityName": "ANALISIS DE PROCESOS",
      "activityCode": "00250037",
      "budget": "747.692,00",
      "efectiveHours": "1.120,00",
      "expenses": "0,00",
      "production": "48.146,84",
      "margin": "100%",
      "invoiced": "34.325,86",
      "initialCurrentWork": "0,00",
      "currentWork": "13.820,98",
      "pending": "713.366,14",
      "cumulativeDataYear": "2018",
      "activityLineId":"1",
      "activityTypeId":"1",
      "startDate":"2018-01-08",
      "endDate":"2018-12-31",
      "comRespId":"1",
      "opRespId":"2",
      "dBooking":"true",
      "incomeTypeId":"1",
      "invoiceTypeId":"1",
      "invoiceCompanyId":"1",
      "anCompanyId":"1",
      "clientId":"1",
      "plannedHours": "0,00",
      "finanCost": "0,00",
      "plannedCost": "0,00",
      "mBSale": "2.455,00",
      "mBFinan": "0,00%",
      "fhn": "1,00",
      "fhf": "1,00",
      "fhnf": "1,00",
      "fhgd": "1,00",
      "fhgfd": "1,00",
      "fhga": "1,00",
      "fhgfa": "1.00",
      "fhc": "1,00",
      "expensesAllowedId": "1",
      "deleted":"false",
      "team": [
        {
          "employeeId": "21",
          "employeeIntervals": [
            {
              "startDate": "2018-01-15",
              "endDate": "",
              "roleId": "1"
            }
          ]
        },
        {
          "employeeId": "22",
          "employeeIntervals": [
            {
              "startDate": "2018-01-16",
              "endDate": "",
              "roleId": "2"
            }
          ]
        },
        {
          "employeeId": "2",
          "employeeIntervals": [
            {
              "startDate": "2018-01-08",
              "endDate": "",
              "roleId": "3"
            }
          ]
        },
        {
          "employeeId": "1",
          "employeeIntervals": [
            {
              "startDate": "2018-02-01",
              "endDate": "2018-02-10",
              "roleId": "3"
            }
          ]
        },
        {
          "groupId":"1"
        }
      ]
    },
    {
      "activity_id": "2",
      "activity_name": "actividad 2",
      "activity_code": "RTY456",
      "activity_start": "2017-01-01T00:00:00.000Z",
      "activity_end": "2018-01-01T00:00:00.000Z",
      "ounit": "1",
      "employees": [
        {
          "employee_id": "23",
          "employee_intervals": [
            {
              "start_date": "2017-01-15T00:00:00.000Z",
              "end_date": "",
              "employee_role": "op_manager"
            }
          ]
        },
        {
          "employee_id": "24",
          "employee_intervals": [
            {
              "start_date": "2017-01-15T00:00:00.000Z",
              "end_date": "",
              "employee_role": "cm_manager"
            }
          ]
        },
        {
          "employee_id": "3",
          "employee_intervals": [
            {
              "start_date": "2017-01-15T00:00:00.000Z",
              "end_date": "",
              "employee_role": "developer"
            }
          ]
        },
        {
          "employee_id": "4",
          "employee_intervals": [
            {
              "start_date": "2017-01-01T00:00:00.000Z",
              "end_date": "2017-02-01T00:00:00.000Z",
              "employee_role": "developer"
            }
          ]
        }
      ]
    },
    {
      "activity_id": "3",
      "activity_name": "actividad 3",
      "activity_code": "001122",
      "activity_start": "2017-01-01T00:00:00.000Z",
      "activity_end": "",
      "ounit": "1",
      "employees": [
        {
          "employee_id": "23",
          "employee_intervals": [
            {
              "start_date": "2017-01-15T00:00:00.000Z",
              "end_date": "",
              "employee_role": "op_manager"
            }
          ]
        },
        {
          "employee_id": "25",
          "employee_intervals": [
            {
              "start_date": "2017-01-15T00:00:00.000Z",
              "end_date": "",
              "employee_role": "cm_manager"
            }
          ]
        },
        {
          "employee_id": "3",
          "employee_intervals": [
            {
              "start_date": "2017-01-15T00:00:00.000Z",
              "end_date": "",
              "employee_role": "developer"
            }
          ]
        },
        {
          "employee_id": "5",
          "employee_intervals": [
            {
              "start_date": "2017-01-01T00:00:00.000Z",
              "end_date": "2017-02-01T00:00:00.000Z",
              "employee_role": "developer"
            },
            {
              "start_date": "2017-02-01T00:00:00.000Z",
              "employee_role": "analyst"
            }
          ]
        }
      ]
    },
    {
      "activity_id": "4",
      "activity_name": "actividad 4",
      "activity_code": "001133",
      "activity_start": "2016-01-01T00:00:00.000Z",
      "activity_end": "2018-01-01T00:00:00.000Z",
      "ounit": "5",
      "employees": [
        {
          "employee_id": "26",
          "employee_intervals": [
            {
              "start_date": "2016-01-15T00:00:00.000Z",
              "end_date": "2018-01-01T00:00:00.000Z",
              "employee_role": "op_manager"
            }
          ]
        },
        {
          "employee_id": "27",
          "employee_intervals": [
            {
              "start_date": "2016-01-15T00:00:00.000Z",
              "end_date": "2018-01-01T00:00:00.000Z",
              "employee_role": "cm_manager"
            }
          ]
        },
        {
          "employee_id": "6",
          "employee_intervals": [
            {
              "start_date": "2016-01-15T00:00:00.000Z",
              "end_date": "2018-01-01T00:00:00.000Z",
              "employee_role": "developer"
            }
          ]
        },
        {
          "employee_id": "7",
          "employee_intervals": [
            {
              "start_date": "2017-01-01T00:00:00.000Z",
              "end_date": "2018-01-01T00:00:00.000Z",
              "employee_role": "developer"
            }
          ]
        }
      ]
    },
    {
      "activity_id": "5",
      "activity_name": "actividad 5",
      "activity_code": "098765",
      "activity_start": "2015-01-01T00:00:00.000Z",
      "activity_end": "",
      "ounit": "3",
      "employees": [
        {
          "employee_id": "15",
          "employee_intervals": [
            {
              "start_date": "2015-01-15T00:00:00.000Z",
              "end_date": "",
              "employee_role": "op_manager"
            }
          ]
        },
        {
          "employee_id": "16",
          "employee_intervals": [
            {
              "start_date": "2015-01-15T00:00:00.000Z",
              "end_date": "",
              "employee_role": "cm_manager"
            }
          ]
        },
        {
          "employee_id": "8",
          "employee_intervals": [
            {
              "start_date": "2016-01-15T00:00:00.000Z",
              "end_date": "",
              "employee_role": "developer"
            }
          ]
        }
      ]
    },
    {
      "activity_id": "6",
      "activity_name": "actividad 6",
      "activity_code": "023412",
      "activity_start": "2015-01-01T00:00:00.000Z",
      "activity_end": "2016-01-01T00:00:00.000Z",
      "ounit": "7",
      "employees": [
        {
          "employee_id": "17",
          "employee_intervals": [
            {
              "start_date": "2015-01-01T00:00:00.000Z",
              "end_date": "2016-01-01T00:00:00.000Z",
              "employee_role": "op_manager"
            }
          ]
        },
        {
          "employee_id": "18",
          "employee_intervals": [
            {
              "start_date": "2015-01-01T00:00:00.000Z",
              "end_date": "2016-01-01T00:00:00.000Z",
              "employee_role": "cm_manager"
            }
          ]
        },
        {
          "employee_id": "9",
          "employee_intervals": [
            {
              "start_date": "2015-01-01T00:00:00.000Z",
              "end_date": "2016-01-01T00:00:00.000Z",
              "employee_role": "developer"
            }
          ]
        },
        {
          "employee_id": "10",
          "employee_intervals": [
            {
              "start_date": "2015-01-01T00:00:00.000Z",
              "end_date": "2016-01-01T00:00:00.000Z",
              "employee_role": "developer"
            }
          ]
        }
      ]
    },
    {
      "activity_id": "7",
      "activity_name": "actividad 7",
      "activity_code": "GF4545",
      "activity_start": "2018-01-01T00:00:00.000Z",
      "activity_end": "",
      "ounit": "7",
      "employees": [
        {
          "employee_id": "19",
          "employee_intervals": [
            {
              "start_date": "2018-01-01T00:00:00.000Z",
              "end_date": "",
              "employee_role": "op_manager"
            }
          ]
        },
        {
          "employee_id": "20",
          "employee_intervals": [
            {
              "start_date": "2018-01-01T00:00:00.000Z",
              "end_date": "",
              "employee_role": "cm_manager"
            }
          ]
        },
        {
          "employee_id": "11",
          "employee_intervals": [
            {
              "start_date": "2018-01-01T00:00:00.000Z",
              "end_date": "",
              "employee_role": "developer"
            }
          ]
        },
        {
          "employee_id": "12",
          "employee_intervals": [
            {
              "start_date": "2018-01-01T00:00:00.000Z",
              "end_date": "",
              "employee_role": "developer"
            }
          ]
        }
      ]
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
