var express = require('express');
var router = express.Router();

// GET activities list
router.get('/listActivities', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  /*collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});*/
  collection.aggregate([
    {
      $lookup: {
        from: "companies",
        localField: "invoiceCompanyId",
        foreignField: "companyId",
        as: "invoiceCompany"
      }
    },
    { $unwind: "$invoiceCompany" },
    {
      $lookup: {
        from: "companies",
        localField: "anCompanyId",
        foreignField: "companyId",
        as: "anCompany"
      }
    },
    { $unwind: "$anCompany" },
    {
      $lookup: {
        from: "clients",
        localField: "clientId",
        foreignField: "clientId",
        as: "client"
      }
    },
    { $unwind: "$client" },
    {
      $lookup: {
        from: "activityLines",
        localField: "activityLineId",
        foreignField: "activityLineId",
        as: "activityLine"
      }
    },
    { $unwind: "$activityLine" },
    {
      $lookup: {
        from: "activitySubtypes",
        localField: "activitySubtypeId",
        foreignField: "activitySubtypeId",
        as: "activitySubtype"
      }
    },
    { $unwind: "$activitySubtype" },
    {
      $lookup: {
        from: "ounits",
        localField: "commertialOunitId",
        foreignField: "oUnitId",
        as: "commertialOunit"
      }
    },
    { $unwind: "$commertialOunit" },

    {
      $lookup: {
        from: "ounits",
        localField: "businessOunitId",
        foreignField: "oUnitId",
        as: "businessOunit"
      }
    },
    { $unwind: "$businessOunit" },
    /* {
       $lookup: {
         from: "expensespermissiontypes",
         localField: "clientId",
         foreignField: "clientId",
         as: "client"
       }
     },
     {
       $lookup: {
         from: "invoicingtypes",
         localField: "clientId",
         foreignField: "clientId",
         as: "client"
       }
     },
     {
       $lookup: {
         from: "incometypes",
         localField: "clientId",
         foreignField: "clientId",
         as: "client"
       }
     },
     {
       $lookup: {
         from: "clients",
         localField: "clientId",
         foreignField: "clientId",
         as: "client"
       }
     },*/
    {
      $project: {
        "_id": 0,
        "activityId": 1,
        "activityName": 1,
        "activityCode": 1,
        "startDate": 1,
        "endDate": 1,
        "activityLineId": 1,
        "activityLine": "$activityLine.name",
        "invoiceCompanyId": 1,
        "invoiceCompany": "$invoiceCompany.companyName",
        "anCompanyId": 1,
        "anCompany": "$anCompany.companyName",
        "clientId": 1,
        "client": "$client.clientName",
        "activitySubtypeId": 1,
        "activitySubtype": "$activitySubtype.name",
        "businessOunitId": 1,
        "businessOunit": 1,
        "commertialOunitId": 1,
        "commertialOunit": 1
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
      "activityName": "FORMACION \"GPG\"",
      "activityCode": "NF0001",
      "budget": '747.692,00',
      "efectiveHours": '1.120,00',
      "expenses": '0,00',
      "production": '48.146,84',
      "margin": '100%',
      "invoiced": '34.325,86',
      "initialCurrentWork": '0,00',
      "currentWork": '13.820,98',
      "pending": '713.366,14',
      "cumulativeDatayear": '2018',
      "invoiceCompanyId": '1',
      "anCompanyId": '1',
      "clientId": '1',
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2010-01-01",
      "endDate": "2020-12-31",
      "activityLineId": "11",
      "activitySubtypeId": "9",
      "commertialOunitId": "1",
      "businessOunitId": "1",
      "expensesPermissionsId": "1",
      "invoicingTypeId": "2",
      "incomeTypeId": "1",
      "doubleBooking": "false",
      "visible": "true",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "intervectionInWatchHourFactor": "1",
      "intervectionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialOunits": [
        {
          "startDate": "2008-05-28",
          "ounitId": "1"
        }
      ],
      "historicalBusinessOunits": [
        {
          "startDate": "2008-05-28",
          "ounitId": "1"
        }
      ],
      "team": [
        {
          "groupId": "EMPLEADOS",
          "roleId": "1",
          "startDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "1",
          "roleId": "1",
          "startDate": "2010-04-26",
          "endDate": "2018-12-31",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "2",
          "roleId": "1",
          "startDate": "2010-04-27",
          "endDate": "2018-12-31",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "3",
          "roleId": "1",
          "startDate": "2011-01-24",
          "endDate": "2018-12-31",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        }
      ]
    },
    {
      "activityId": "2",
      "budget": '747.692,00',
      "efectiveHours": '1.120,00',
      "expenses": '0,00',
      "production": '48.146,84',
      "margin": '100%',
      "invoiced": '34.325,86',
      "initialCurrentWork": '0,00',
      "currentWork": '13.820,98',
      "pending": '713.366,14',
      "cumulativeDatayear": '2018',
      "invoiceCompanyId": '1',
      "anCompanyId": '1',
      "clientId": '1',
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2012-09-06",
      "activityLineId": "11",
      "activitySubtypeId": "24",
      "commertialOunitId": "1",
      "businessOunitId": "1",
      "expensesPermissionsId": "1",
      "invoicingTypeId": "2",
      "incomeTypeId": "1",
      "doubleBooking": "false",
      "visible": "true",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "intervectionInWatchHourFactor": "1",
      "intervectionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialOunits": [
        {
          "startDate": "2008-05-28",
          "ounitId": "1"
        }
      ],
      "historicalBusinessOunits": [
        {
          "startDate": "2008-05-28",
          "ounitId": "1"
        }
      ],
      "activityName": "AUSENCIA NO JUSTIFICADA",
      "activityCode": "NF0002",
      "team": [
        {
          "groupId": "EMPLEADOS",
          "roleId": "1",
          "startDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        }
      ]
    },
    {
      "activityId": "3",
      "budget": '747.692,00',
      "efectiveHours": '1.120,00',
      "expenses": '0,00',
      "production": '48.146,84',
      "margin": '100%',
      "invoiced": '34.325,86',
      "initialCurrentWork": '0,00',
      "currentWork": '13.820,98',
      "pending": '713.366,14',
      "cumulativeDatayear": '2018',
      "invoiceCompanyId": '1',
      "anCompanyId": '1',
      "clientId": '1',
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2012-09-04",
      "activityLineId": "11",
      "activitySubtypeId": "24",
      "commertialOunitId": "1",
      "businessOunitId": "1",
      "expensesPermissionsId": "1",
      "invoicingTypeId": "2",
      "incomeTypeId": "2",
      "doubleBooking": "false",
      "visible": "true",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "intervectionInWatchHourFactor": "1",
      "intervectionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialOunits": [
        {
          "startDate": "2008-05-28",
          "ounitId": "1"
        }
      ],
      "historicalBusinessOunits": [
        {
          "startDate": "2008-05-28",
          "ounitId": "1"
        }
      ],
      "activityName": "AUSENCIA JUSTIFICADA",
      "activityCode": "NF0003",
      "team": [
        {
          "groupId": "EMPLEADOS",
          "roleId": "1",
          "startDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        }
      ]
    },
    {
      "activityId": "4",
      "budget": '747.692,00',
      "efectiveHours": '1.120,00',
      "expenses": '0,00',
      "production": '48.146,84',
      "margin": '100%',
      "invoiced": '34.325,86',
      "initialCurrentWork": '0,00',
      "currentWork": '13.820,98',
      "pending": '713.366,14',
      "cumulativeDatayear": '2018',
      "invoiceCompanyId": '1',
      "anCompanyId": '1',
      "clientId": '1',
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2006-04-01",
      "endDate": "2008-12-12",
      "activityLineId": "1",
      "activitySubtypeId": "25",
      "commertialOunitId": "2",
      "businessOunitId": "3",
      "expensesPermissionsId": "3",
      "invoicingTypeId": "2",
      "incomeTypeId": "1",
      "doubleBooking": "false",
      "visible": "true",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "intervectionInWatchHourFactor": "1",
      "intervectionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialOunits": [
        {
          "startDate": "2008-06-28",
          "ounitId": "2"
        }
      ],
      "historicalBusinessOunits": [
        {
          "startDate": "2008-06-28",
          "ounitId": "3"
        }
      ],
      "activityName": "POSTVENTA DE DIVERSOS",
      "activityCode": "125001",
      "team": [
        {
          "employeeId": "4",
          "roleId": "1",
          "startDate": "2008-06-28",
          "endDate": "2008-12-12",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type4": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "5",
          "roleId": "2",
          "startDate": "2008-10-09",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type4": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "6",
          "roleId": "1",
          "startDate": "2008-11-04",
          "endDate": "2008-12-12",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type4": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "2",
          "roleId": "3",
          "startDate": "2008-11-26",
          "endDate": "2008-12-12",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type4": "false",
            "type8": "false"
          }
        }
      ]
    },
    {
      "activityId": "5",
      "budget": '747.692,00',
      "efectiveHours": '1.120,00',
      "expenses": '0,00',
      "production": '48.146,84',
      "margin": '100%',
      "invoiced": '34.325,86',
      "initialCurrentWork": '0,00',
      "currentWork": '13.820,98',
      "pending": '713.366,14',
      "cumulativeDatayear": '2018',
      "invoiceCompanyId": '1',
      "anCompanyId": '1',
      "clientId": '1',
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2005-11-24",
      "activityLineId": "1",
      "activitySubtypeId": "5",
      "commertialOunitId": "1",
      "businessOunitId": "1",
      "expensesPermissionsId": "3",
      "invoicingTypeId": "2",
      "incomeTypeId": "3",
      "doubleBooking": "false",
      "visible": "true",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "intervectionInWatchHourFactor": "1",
      "intervectionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialOunits": [
        {
          "startDate": "2008-06-28",
          "ounitId": "1"
        }
      ],
      "historicalBusinessOunits": [
        {
          "startDate": "2008-06-28",
          "ounitId": "1"
        }
      ],
      "activityName": "INTRANET NUEVA",
      "activityCode": "PI0006",
      "team": [
        {
          "employeeId": "6",
          "roleId": "1",
          "startDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "7",
          "roleId": "1",
          "startDate": "2008-06-28",
          "endDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "8",
          "roleId": "1",
          "startDate": "2008-06-28",
          "endDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "9",
          "roleId": "1",
          "startDate": "2008-06-28",
          "endDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "10",
          "roleId": "1",
          "startDate": "2008-06-28",
          "endDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "11",
          "roleId": "1",
          "startDate": "2008-03-03",
          "endDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "12",
          "roleId": "1",
          "startDate": "2008-06-28",
          "endDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "13",
          "roleId": "1",
          "startDate": "2008-10-08",
          "endDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "14",
          "roleId": "1",
          "startDate": "2008-10-15",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        }
      ]
    },
    {
      "activityId": "6",
      "budget": '747.692,00',
      "efectiveHours": '1.120,00',
      "expenses": '0,00',
      "production": '48.146,84',
      "margin": '100%',
      "invoiced": '34.325,86',
      "initialCurrentWork": '0,00',
      "currentWork": '13.820,98',
      "pending": '713.366,14',
      "cumulativeDatayear": '2018',
      "invoiceCompanyId": '1',
      "anCompanyId": '1',
      "clientId": '1',
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2010-01-01",
      "activityLineId": "11",
      "activitySubtypeId": "12",
      "commertialOunitId": "4",
      "businessOunitId": "4",
      "expensesPermissionsId": "1",
      "invoicingTypeId": "2",
      "incomeTypeId": "1",
      "doubleBooking": "false",
      "visible": "true",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "intervectionInWatchHourFactor": "1",
      "intervectionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialOunits": [
        {
          "startDate": "2008-05-28",
          "ounitId": "4"
        }
      ],
      "historicalBusinessOunits": [
        {
          "startDate": "2008-05-28",
          "ounitId": "4"
        }
      ],
      "activityName": "GESTION / ESTRUCTURA",
      "activityCode": "NF0004",
      "team": [
        {
          "groupId": "EMPLEADOS",
          "roleId": "1",
          "startDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "15",
          "roleId": "1",
          "startDate": "2010-03-29",
          "endDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "16",
          "roleId": "1",
          "startDate": "2011-09-19",
          "endDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": "17",
          "roleId": "1",
          "startDate": "2011-09-19",
          "endDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        }
      ]
    },
    {
      "activityId": "7",
      "budget": '747.692,00',
      "efectiveHours": '1.120,00',
      "expenses": '0,00',
      "production": '48.146,84',
      "margin": '100%',
      "invoiced": '34.325,86',
      "initialCurrentWork": '0,00',
      "currentWork": '13.820,98',
      "pending": '713.366,14',
      "cumulativeDatayear": '2018',
      "invoiceCompanyId": '1',
      "anCompanyId": '1',
      "clientId": '1',
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2008-06-28",
      "activityLineId": "1",
      "activitySubtypeId": "24",
      "commertialOunitId": "2",
      "businessOunitId": "2",
      "expensesPermissionsId": "1",
      "invoicingTypeId": "2",
      "incomeTypeId": "1",
      "doubleBooking": "false",
      "visible": "true",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "intervectionInWatchHourFactor": "1",
      "intervectionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialOunits": [
        {
          "startDate": "2008-05-28",
          "ounitId": "2"
        }
      ],
      "historicalBusinessOunits": [
        {
          "startDate": "2008-05-28",
          "ounitId": "2"
        }
      ],
      "activityName": "VACACIONES",
      "activityCode": "NF0005",
      "team": [
        {
          "groupId": "EMPLEADOS",
          "roleId": "1",
          "startDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        }
      ]
    },
    {
      "activityId": "8",
      "budget": '747.692,00',
      "efectiveHours": '1.120,00',
      "expenses": '0,00',
      "production": '48.146,84',
      "margin": '100%',
      "invoiced": '34.325,86',
      "initialCurrentWork": '0,00',
      "currentWork": '13.820,98',
      "pending": '713.366,14',
      "cumulativeDatayear": '2018',
      "invoiceCompanyId": '1',
      "anCompanyId": '1',
      "clientId": '1',
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2008-06-28",
      "activityLineId": "1",
      "activitySubtypeId": "12",
      "commertialOunitId": "2",
      "businessOunitId": "2",
      "expensesPermissionsId": "1",
      "invoicingTypeId": "2",
      "incomeTypeId": "1",
      "doubleBooking": "false",
      "visible": "true",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "intervectionInWatchHourFactor": "1",
      "intervectionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialOunits": [
        {
          "startDate": "2008-05-28",
          "ounitId": "2"
        }
      ],
      "historicalBusinessOunits": [
        {
          "startDate": "2008-05-28",
          "ounitId": "2"
        }
      ],
      "activityName": "REUNIONES INTERNAS",
      "activityCode": "NF0006",
      "team": [
        {
          "groupId": "EMPLEADOS",
          "roleId": "1",
          "startDate": "2008-06-28",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        }
      ]
    },
    {
      "activityId": "9",
      "budget": '747.692,00',
      "efectiveHours": '1.120,00',
      "expenses": '0,00',
      "production": '48.146,84',
      "margin": '100%',
      "invoiced": '34.325,86',
      "initialCurrentWork": '0,00',
      "currentWork": '13.820,98',
      "pending": '713.366,14',
      "cumulativeDatayear": '2018',
      "invoiceCompanyId": '1',
      "anCompanyId": '1',
      "clientId": '1',
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2008-06-28",
      "activityLineId": "1",
      "activitySubtypeId": "24",
      "commertialOunitId": "2",
      "businessOunitId": "2",
      "expensesPermissionsId": "1",
      "invoicingTypeId": "2",
      "incomeTypeId": "1",
      "doubleBooking": "false",
      "visible": "true",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "intervectionInWatchHourFactor": "1",
      "intervectionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialOunits": [
        {
          "startDate": "2008-05-28",
          "ounitId": "2"
        }
      ],
      "historicalBusinessOunits": [
        {
          "startDate": "2008-05-28",
          "ounitId": "2"
        }
      ],
      "activityName": "VACACIONES DEL AÑO ANTERIOR",
      "activityCode": "NF0008",
      "team": [
        {
          "groupId": "EMPLEADOS",
          "roleId": "1",
          "startDate": "2009-03-13",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type3": "false",
            "type4": "false",
            "type5": "false",
            "type6": "false",
            "type7": "false",
            "type8": "false"
          }
        }
      ]
    },
    {
      "activityId": "10",
      "budget": '747.692,00',
      "efectiveHours": '1.120,00',
      "expenses": '0,00',
      "production": '48.146,84',
      "margin": '100%',
      "invoiced": '34.325,86',
      "initialCurrentWork": '0,00',
      "currentWork": '13.820,98',
      "pending": '713.366,14',
      "cumulativeDatayear": '2018',
      "invoiceCompanyId": '1',
      "anCompanyId": '1',
      "clientId": '1',
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2006-05-01",
      "activityLineId": "1",
      "activitySubtypeId": "25",
      "commertialOunitId": "1",
      "businessOunitId": "1",
      "expensesPermissionsId": "3",
      "invoicingTypeId": "2",
      "incomeTypeId": "1",
      "doubleBooking": "false",
      "visible": "true",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "intervectionInWatchHourFactor": "1",
      "intervectionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialOunits": [
        {
          "startDate": "2008-06-28",
          "ounitId": "1"
        }
      ],
      "historicalBusinessOunits": [
        {
          "startDate": "2008-06-28",
          "ounitId": "1"
        }
      ],
      "activityName": "IMPLANTACIÓN ISO 9000",
      "activityCode": "105003",
      "team": []
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: activities collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
