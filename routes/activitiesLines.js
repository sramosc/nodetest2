var express = require('express');
var router = express.Router();

// GET activities lines list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('activityLines');
  collection.aggregate([
    {
      $project: {
        "_id": 0,
      }
    },
    { $sort: { _id: 1 } }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      res.json(docs)
    }
  })
});

// GET activities lines para combo modal
router.get('/selection2', function (req, res) {
  var db = req.db;
  var collection = db.get('activityLines');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": "$activityLineId",
        "name": 1
      }
    },
    { $sort: { id: 1 } }

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

// GET employees selection v.2
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('activityLines');
  let recordsPipeline = []
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
      recordsPipeline = pipeline.slice()
      recordsPipeline.push({ $skip: (req.query.pageNumber - 1) * req.query.pageSize })
      recordsPipeline.push({ $limit: parseInt(req.query.pageSize) })
    }
  }

  countPipeline = pipeline.slice()
  countPipeline.push({ $count: 'count' })

  let pipeline2 = [
    {
      $facet: {
        records: recordsPipeline,
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
          options: docs[0].records,
          totalRecords: docs[0].totalRecords[0].count
        }
        res.json(result)
      }
    })
});


// GET resetCollectionActivities
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('activityLines');
  collection.remove({});
  collection.insert([
    {
      "name": "SERVICIOS TÉCNICOS PROFESIONALES",
      "description": "SERVICIOS TÉCNICOS PROFESIONALES",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000000",
      "id": 1
    },
    {
      "name": "SERVICIOS GESTIONADOS & BPO",
      "description": "SERVICIOS GESTIONADOS & BPO",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000021",
      "id": 2
    },
    {
      "name": "SOFTWARE & MOBILITY",
      "description": "SOFTWARE & MOBILITY",
      "plannedRawProfitMargin": "40.0",
      "accountGroup": "705000003",
      "id": 3
    },
    {
      "name": "CAU / HELPDESK",
      "description": "CAU / HELPDESK",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000001",
      "id": 4
    },
    {
      "name": "SOA - BPM - RIA",
      "description": "SOA - BPM - RIA",
      "plannedRawProfitMargin": "40.0",
      "accountGroup": "705000015",
      "id": 5
    },
    {
      "name": "IT GOVERNANCE",
      "description": "IT GOVERNANCE",
      "plannedRawProfitMargin": "40.0",
      "accountGroup": "705000019",
      "id": 6
    },
    {
      "name": "FOSS / FREE & OPEN SOURCE SOFTWARE",
      "description": "FOSS / FREE & OPEN SOURCE SOFTWARE",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000005",
      "id": 7
    },
    {
      "name": "SECURITY & RM",
      "description": "SECURITY & RM",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000014",
      "id": 8
    },
    {
      "name": "GESTION DEL CAMBIO & FORMACION",
      "description": "GESTION DEL CAMBIO & FORMACION",
      "plannedRawProfitMargin": "45.0",
      "accountGroup": "705000002",
      "id": 9
    },
    {
      "name": "PRODUCTOS",
      "description": "PRODUCTOS",
      "plannedRawProfitMargin": "20.0",
      "accountGroup": "700000002",
      "id": 10
    },
    {
      "name": "OTROS",
      "description": "OTROS",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000020",
      "id": 11
    },
    {
      "name": "ECM",
      "description": "ECM",
      "plannedRawProfitMargin": "40.0",
      "accountGroup": "705000023",
      "id": 12
    },
    {
      "name": "VISUALMENTE",
      "description": "VISUALMENTE",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000009",
      "id": 13
    },
    {
      "name": "DATACENTER 3.0",
      "description": "DATACENTER 3.0",
      "plannedRawProfitMargin": "35.0",
      "accountGroup": "705000017",
      "id": 14
    },
    {
      "name": "GESTION DE REDES",
      "description": "GESTION DE REDES",
      "plannedRawProfitMargin": "35.0",
      "accountGroup": "705000018",
      "id": 15
    },
    {
      "name": "BI & ANALYTICS",
      "description": "BI & ANALYTICS",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000022",
      "id": 16
    },
    {
      "name": "ERP",
      "description": "ERP",
      "plannedRawProfitMargin": "40.0",
      "accountGroup": "705000024",
      "id": 17
    },
    {
      "name": "KONY",
      "description": "KONY",
      "plannedRawProfitMargin": "40.0",
      "accountGroup": "705000025",
      "id": 18
    },
    {
      "name": "AM&PE",
      "description": "AM&PE",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000026",
      "id": 19
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: activitiyLines collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
