var express = require('express');
var router = express.Router();

// GET activities list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  let totalRecords = 0

  collection.count({}).then((count) => {
    totalRecords = count
  })

  let pipeline = []

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
    if ('orgUnitId' in req.query) {
      matchStage['businessOrgUnitId'] = req.query.orgUnitId
      matchExists = true
    }

    if ('clientId' in req.query) {
      matchStage['clientId'] = req.query.clientId
      matchExists = true
    }

    if ('activitySubTypeId' in req.query) {
      matchStage['activitySubtypeId'] = req.query.activitySubTypeId
      matchExists = true
    }

    if ('status' in req.query) {
      matchStage['status'] = req.query.status
      matchExists = true
    }

    if ('registry' in req.query) {
      matchStage['registry'] = req.query.registry
      matchExists = true
    }

    if (matchExists) {
      console.log(matchStage)
      collection.count({ matchStage }).then((count) => {
        totalRecords = count
        console.log(totalRecords)
        console.log(count)
      })
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
    pipeline.push({ $match: matchStage })

    pipeline.push({ $sort: sortStage })

    // skip and limit stage
    if (('pageNumber' in req.query) && ('pageSize' in req.query)) {

      pipeline.push({ $skip: (req.query.pageNumber - 1) * req.query.pageSize })
      pipeline.push({ $limit: parseInt(req.query.pageSize) })
    }



  }
  pipeline.push({ $project: { "_id": 0, "id": 1, "name": 1, "code": 1, "startDate": 1 } })
  console.log(pipeline)
  collection.aggregate(pipeline
    , {}, function (e, docs) {
      if (e != null) {
        res.json(e)
      } else {
        let result = {
          activities: docs,
          totalRecords: totalRecords
        }
        res.json(result)
      }
    })

});

// GET activities selection
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');

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

// GET activities list
router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  var docToFind = req.params.id;
  console.log(docToFind)
  collection.aggregate([
    {
      $match: { "id": Number(docToFind) }
    },

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
        from: "orgsUnits",
        localField: "commertialOrgUnitId",
        foreignField: "id",
        as: "commertialOrgUnit"
      }
    },
    { $unwind: "$commertialOrgUnit" },
    {
      $lookup: {
        from: "orgsUnits",
        localField: "businessOrgUnitId",
        foreignField: "id",
        as: "businessOrgUnit"
      }
    },
    { $unwind: "$businessOrgUnit" },
    {
      $lookup: {
        from: "activityExpensesPermissionTypes",
        localField: "expensesPermissionId",
        foreignField: "activityExpensesPermissionTypeId",
        as: "expensesPermission"
      }
    },
    { $unwind: "$expensesPermission" },
    {
      $lookup: {
        from: "activityInvoicingTypes",
        localField: "invoicingTypeId",
        foreignField: "activityInvoicingTypeId",
        as: "invoicingType"
      }
    },
    { $unwind: "$invoicingType" },
    {
      $lookup: {
        from: "activityIncomeTypes",
        localField: "incomeTypeId",
        foreignField: "activityIncomeTypeId",
        as: "incomeType"
      }
    },
    { $unwind: "$incomeType" },
    {
      $project: {
        "_id": 0,
        "id": 1,
        "name": 1,
        "code": 1,
        "budget": 1,
        "efectiveHours": 1,
        "expenses": 1,
        "production": 1,
        "margin": 1,
        "invoiced": 1,
        "initialCurrentWork": 1,
        "currentWork": 1,
        "pending": 1,
        "cumulativeDatayear": 1,
        "plannedHours": 1,
        "finanCost": 1,
        "plannedCost": 1,
        "mBSale": 1,
        "mBFinan": 1,
        "startDate": 1,
        "endDate": 1,
        "activityLine.id":"$activityLine.activityLineId",
        "activityLine.name":"$activityLine.name",
        
        "invoiceCompany.id": "$invoiceCompany.companyId",
        "invoiceCompany.name": "$invoiceCompany.companyName",

        "anCompany.id": "$anCompany.companyId",        
        "anCompany.name": "$anCompany.companyName",        
                        
        "client.id": "$client.clientId",
        "client.name": "$client.clientName",
        
        "activitySubtype.id": "$activitySubtype.activitySubtypeId",
        "activitySubtype.name": "$activitySubtype.name",
        
        "businessOrgUnit.id": "$businessOrgUnit.id",
        "businessOrgUnit.name": "$businessOrgUnit.name",
        "opDept": "$businessOrgUnit.erpId",
        
        "commertialOrgUnit.id": "$commertialOrgUnit.id",
        "commertialOrgUnit.name": "$commertialOrgUnit.name",
        "comDept": "$commertialOrgUnit.erpId",
        
        "expensesPermission.id": "$expensesPermission.activityExpensesPermissionTypeId",
        "expensesPermission.name": "$expensesPermission.name",

        
        "invoicingType.id": "$invoicingType.activityInvoicingTypeId",
        "invoicingType.name": "$invoicingType.name",

        
        "incomeType.id": "$incomeType.activityIncomeTypeId",
        "incomeType.name": "$incomeType.name",

        "doubleBooking": 1,
        "nightHourFactor": 1,
        "holidayHourFactor": 1,
        "watchHourFactor": 1,
        "nightHolidayHourFactor": 1,
        "watchHolidayHourFactor": 1,
        "interventionInWatchHourFactor": 1,
        "interventionInHolidayWatchHourFactor": 1,
        "extraHourFactor": 1,
        "status": 1,
        "registry": 1,
        "team": 1
      }
    } 
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      let result = {
        activity: docs[0]
      }
      res.json(result)
    }
  })
});

// List employees by activity
// devuelve el listado de los empleados que hayan estado vinculados a una actividad determinada
router.get('/listEmployeesInActivity/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  var docToFind = req.params.id;
  collection.find({ 'id': docToFind }, { 'team.employeeId': 1 }, function (e, docs) {
    res.json(docs);
  });
});

// List employees by orgsUnits
// devuelve el listado de los empleados que hayan estado vinculados a una unidad organizativa determinada y hayan realizado actividades en ella
router.get('/listEmployeesInOrgUnit/:orgUnitId', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  var docToFind = req.params.orgUnitId;
  collection.find({ 'orgUnit': docToFind }, { 'team.employeeId': 1 }, function (e, docs) {
    res.json(docs);
  });
});

// List employees activities by year

// GET reset Collection Activities
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  collection.remove({});
  collection.insert([
    {
      "id": 1,
      "name": "FORMACION \"GPG\"",
      "code": "NF0001",
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
      "invoiceCompanyId": 1,
      "anCompanyId": 1,
      "clientId": 1,
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2010-01-01",
      "endDate": "2020-12-31",
      "activityLineId": 11,
      "activitySubtypeId": 9,
      "commertialOrgUnitId": 1,
      "businessOrgUnitId": 1,
      "expensesPermissionId": 1,
      "invoicingTypeId": 2,
      "incomeTypeId": 1,
      "doubleBooking": "false",
      "registry": "ACTIVE",
      "status": "OPEN",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "interventionInWatchHourFactor": "1",
      "interventionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialorgsUnits": [
        {
          "startDate": "2008-05-28",
          "orgUnitId": 1
        }
      ],
      "historicalBusinessorgsUnits": [
        {
          "startDate": "2008-05-28",
          "orgUnitId": 1
        }
      ],
      "team": [
        {
          "groupId": "EMPLEADOS",
          "roleId": 1,
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
          "employeeId": 1,
          "roleId": 1,
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
          "employeeId": 2,
          "roleId": 1,
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
          "employeeId": 3,
          "roleId": 1,
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
      "id": 2,
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
      "invoiceCompanyId": 1,
      "anCompanyId": 1,
      "clientId": 1,
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2012-09-06",
      "activityLineId": 11,
      "activitySubtypeId": 24,
      "commertialOrgUnitId": 1,
      "businessOrgUnitId": 1,
      "expensesPermissionId": 1,
      "invoicingTypeId": 2,
      "incomeTypeId": 1,
      "doubleBooking": "false",
      "registry": "ACTIVE",
      "status": "OPEN",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "interventionInWatchHourFactor": "1",
      "interventionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialorgsUnits": [
        {
          "startDate": "2008-05-28",
          "orgUnitId": 1
        }
      ],
      "historicalBusinessorgsUnits": [
        {
          "startDate": "2008-05-28",
          "orgUnitId": 1
        }
      ],
      "name": "AUSENCIA NO JUSTIFICADA",
      "code": "NF0002",
      "team": [
        {
          "groupId": "EMPLEADOS",
          "roleId": 1,
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
      "id": 3,
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
      "invoiceCompanyId": 1,
      "anCompanyId": 1,
      "clientId": 1,
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2012-09-04",
      "activityLineId": 11,
      "activitySubtypeId": 24,
      "commertialOrgUnitId": 1,
      "businessOrgUnitId": 1,
      "expensesPermissionId": 1,
      "invoicingTypeId": 2,
      "incomeTypeId": 2,
      "doubleBooking": "false",
      "registry": "ACTIVE",
      "status": "OPEN",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "interventionInWatchHourFactor": "1",
      "interventionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialorgsUnits": [
        {
          "startDate": "2008-05-28",
          "orgUnitId": 1
        }
      ],
      "historicalBusinessorgsUnits": [
        {
          "startDate": "2008-05-28",
          "orgUnitId": 1
        }
      ],
      "name": "AUSENCIA JUSTIFICADA",
      "code": "NF0003",
      "team": [
        {
          "groupId": "EMPLEADOS",
          "roleId": 1,
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
      "id": 4,
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
      "invoiceCompanyId": 1,
      "anCompanyId": 1,
      "clientId": 1,
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2006-04-01",
      "endDate": "2008-12-12",
      "activityLineId": 1,
      "activitySubtypeId": 25,
      "commertialOrgUnitId": 2,
      "businessOrgUnitId": 3,
      "expensesPermissionId": 3,
      "invoicingTypeId": 2,
      "incomeTypeId": 1,
      "doubleBooking": "false",
      "status": "CLOSED",
      "registry": "ACTIVE",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "interventionInWatchHourFactor": "1",
      "interventionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialorgsUnits": [
        {
          "startDate": "2008-06-28",
          "orgUnitId": 2
        }
      ],
      "historicalBusinessorgsUnits": [
        {
          "startDate": "2008-06-28",
          "orgUnitId": 3
        }
      ],
      "name": "POSTVENTA DE DIVERSOS",
      "code": "125001",
      "team": [
        {
          "employeeId": 4,
          "roleId": 1,
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
          "employeeId": 5,
          "roleId": 2,
          "startDate": "2008-10-09",
          "hours": {
            "type1": "false",
            "type2": "false",
            "type4": "false",
            "type8": "false"
          }
        },
        {
          "employeeId": 6,
          "roleId": 1,
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
          "employeeId": 2,
          "roleId": 3,
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
      "id": 5,
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
      "invoiceCompanyId": 1,
      "anCompanyId": 1,
      "clientId": 1,
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2005-11-24",
      "activityLineId": 1,
      "activitySubtypeId": 5,
      "commertialOrgUnitId": 1,
      "businessOrgUnitId": 1,
      "expensesPermissionId": 3,
      "invoicingTypeId": 2,
      "incomeTypeId": 3,
      "doubleBooking": "false",
      "registry": "ACTIVE",
      "status": "OPEN",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "interventionInWatchHourFactor": "1",
      "interventionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialorgsUnits": [
        {
          "startDate": "2008-06-28",
          "orgUnitId": 1
        }
      ],
      "historicalBusinessorgsUnits": [
        {
          "startDate": "2008-06-28",
          "orgUnitId": 1
        }
      ],
      "name": "INTRANET NUEVA",
      "code": "PI0006",
      "team": [
        {
          "employeeId": 6,
          "roleId": 1,
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
          "employeeId": 7,
          "roleId": 1,
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
          "employeeId": 8,
          "roleId": 1,
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
          "employeeId": 9,
          "roleId": 1,
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
          "employeeId": 10,
          "roleId": 1,
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
          "employeeId": 11,
          "roleId": 1,
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
          "employeeId": 12,
          "roleId": 1,
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
          "employeeId": 13,
          "roleId": 1,
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
          "employeeId": 14,
          "roleId": 1,
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
      "id": 6,
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
      "invoiceCompanyId": 1,
      "anCompanyId": 1,
      "clientId": 1,
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2010-01-01",
      "activityLineId": 11,
      "activitySubtypeId": 12,
      "commertialOrgUnitId": 4,
      "businessOrgUnitId": 4,
      "expensesPermissionId": 1,
      "invoicingTypeId": 2,
      "incomeTypeId": 1,
      "doubleBooking": "false",
      "registry": "ACTIVE",
      "status": "OPEN",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "interventionInWatchHourFactor": "1",
      "interventionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialorgsUnits": [
        {
          "startDate": "2008-05-28",
          "orgUnitId": 4
        }
      ],
      "historicalBusinessorgsUnits": [
        {
          "startDate": "2008-05-28",
          "orgUnitId": 4
        }
      ],
      "name": "GESTION / ESTRUCTURA",
      "code": "NF0004",
      "team": [
        {
          "groupId": "EMPLEADOS",
          "roleId": 1,
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
          "employeeId": 15,
          "roleId": 1,
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
          "employeeId": 16,
          "roleId": 1,
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
          "employeeId": 17,
          "roleId": 1,
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
      "id": 7,
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
      "invoiceCompanyId": 1,
      "anCompanyId": 1,
      "clientId": 1,
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2008-06-28",
      "activityLineId": 1,
      "activitySubtypeId": 24,
      "commertialOrgUnitId": 2,
      "businessOrgUnitId": 2,
      "expensesPermissionId": 1,
      "invoicingTypeId": 2,
      "incomeTypeId": 1,
      "doubleBooking": "false",
      "registry": "DELETED",
      "status": "OPEN",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "interventionInWatchHourFactor": "1",
      "interventionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialorgsUnits": [
        {
          "startDate": "2008-05-28",
          "orgUnitId": 2
        }
      ],
      "historicalBusinessorgsUnits": [
        {
          "startDate": "2008-05-28",
          "orgUnitId": 2
        }
      ],
      "name": "VACACIONES",
      "code": "NF0005",
      "team": [
        {
          "groupId": "EMPLEADOS",
          "roleId": 1,
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
      "id": 8,
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
      "invoiceCompanyId": 1,
      "anCompanyId": 1,
      "clientId": 1,
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2008-06-28",
      "activityLineId": 1,
      "activitySubtypeId": 12,
      "commertialOrgUnitId": 2,
      "businessOrgUnitId": 2,
      "expensesPermissionId": 1,
      "invoicingTypeId": 2,
      "incomeTypeId": 1,
      "doubleBooking": "false",
      "registry": "ACTIVE",
      "status": "OPEN",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "interventionInWatchHourFactor": "1",
      "interventionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialorgsUnits": [
        {
          "startDate": "2008-05-28",
          "orgUnitId": 2
        }
      ],
      "historicalBusinessorgsUnits": [
        {
          "startDate": "2008-05-28",
          "orgUnitId": 2
        }
      ],
      "name": "REUNIONES INTERNAS",
      "code": "NF0006",
      "team": [
        {
          "groupId": "EMPLEADOS",
          "roleId": 1,
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
      "id": 9,
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
      "invoiceCompanyId": 1,
      "anCompanyId": 1,
      "clientId": 1,
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2008-06-28",
      "activityLineId": 1,
      "activitySubtypeId": 24,
      "commertialOrgUnitId": 2,
      "businessOrgUnitId": 2,
      "expensesPermissionId": 1,
      "invoicingTypeId": 2,
      "incomeTypeId": 1,
      "doubleBooking": "false",
      "registry": "ACTIVE",
      "status": "CLOSED",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "interventionInWatchHourFactor": "1",
      "interventionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialorgsUnits": [
        {
          "startDate": "2008-05-28",
          "orgUnitId": 2
        }
      ],
      "historicalBusinessorgsUnits": [
        {
          "startDate": "2008-05-28",
          "orgUnitId": 2
        }
      ],
      "name": "VACACIONES DEL AÑO ANTERIOR",
      "code": "NF0008",
      "team": [
        {
          "groupId": "EMPLEADOS",
          "roleId": 1,
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
      "id": 10,
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
      "invoiceCompanyId": 1,
      "anCompanyId": 1,
      "clientId": 1,
      "plannedHours": '0,00',
      "finanCost": '0,00',
      "plannedCost": '0,00',
      "mBSale": '2.455,00',
      "mBFinan": '0,00%',
      "startDate": "2006-05-01",
      "activityLineId": 1,
      "activitySubtypeId": 25,
      "commertialOrgUnitId": 1,
      "businessOrgUnitId": 1,
      "expensesPermissionId": 3,
      "invoicingTypeId": 2,
      "incomeTypeId": 1,
      "doubleBooking": "false",
      "registry": "ACTIVE",
      "status": "OPEN",
      "nightHourFactor": "1",
      "holidayHourFactor": "1",
      "watchHourFactor": "1",
      "nightHolidayHourFactor": "1",
      "watchHolidayHourFactor": "1",
      "interventionInWatchHourFactor": "1",
      "interventionInHolidayWatchHourFactor": "1",
      "extraHourFactor": "1",
      "historicalCommertialorgsUnits": [
        {
          "startDate": "2008-06-28",
          "orgUnitId": 1
        }
      ],
      "historicalBusinessorgsUnits": [
        {
          "startDate": "2008-06-28",
          "orgUnitId": 1
        }
      ],
      "name": "IMPLANTACIÓN ISO 9000",
      "code": "105003",
      "team": []
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: activities collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
