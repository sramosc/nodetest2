var express = require('express');
var router = express.Router();

// GET activities lines list
router.get('/listActivityLines', function (req, res) {
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
router.get('/listActivityLinesModal', function (req, res) {
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
      res.json(docs)
    }
  })
});


// GET resetCollectionActivities
router.get('/resetCollectionActivityLines', function (req, res) {
  var db = req.db;
  var collection = db.get('activityLines');
  collection.remove({});
  collection.insert([
    {
      "name": "SERVICIOS TÉCNICOS PROFESIONALES",
      "description": "SERVICIOS TÉCNICOS PROFESIONALES",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000000",
      "activityLineId": "1"
    },
    {
      "name": "SERVICIOS GESTIONADOS & BPO",
      "description": "SERVICIOS GESTIONADOS & BPO",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000021",
      "activityLineId": "2"
    },
    {
      "name": "SOFTWARE & MOBILITY",
      "description": "SOFTWARE & MOBILITY",
      "plannedRawProfitMargin": "40.0",
      "accountGroup": "705000003",
      "activityLineId": "3"
    },
    {
      "name": "CAU / HELPDESK",
      "description": "CAU / HELPDESK",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000001",
      "activityLineId": "4"
    },
    {
      "name": "SOA - BPM - RIA",
      "description": "SOA - BPM - RIA",
      "plannedRawProfitMargin": "40.0",
      "accountGroup": "705000015",
      "activityLineId": "5"
    },
    {
      "name": "IT GOVERNANCE",
      "description": "IT GOVERNANCE",
      "plannedRawProfitMargin": "40.0",
      "accountGroup": "705000019",
      "activityLineId": "6"
    },
    {
      "name": "FOSS / FREE & OPEN SOURCE SOFTWARE",
      "description": "FOSS / FREE & OPEN SOURCE SOFTWARE",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000005",
      "activityLineId": "7"
    },
    {
      "name": "SECURITY & RM",
      "description": "SECURITY & RM",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000014",
      "activityLineId": "8"
    },
    {
      "name": "GESTION DEL CAMBIO & FORMACION",
      "description": "GESTION DEL CAMBIO & FORMACION",
      "plannedRawProfitMargin": "45.0",
      "accountGroup": "705000002",
      "activityLineId": "9"
    },
    {
      "name": "PRODUCTOS",
      "description": "PRODUCTOS",
      "plannedRawProfitMargin": "20.0",
      "accountGroup": "700000002",
      "activityLineId": "10"
    },
    {
      "name": "OTROS",
      "description": "OTROS",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000020",
      "activityLineId": "11"
    },
    {
      "name": "ECM",
      "description": "ECM",
      "plannedRawProfitMargin": "40.0",
      "accountGroup": "705000023",
      "activityLineId": "12"
    },
    {
      "name": "VISUALMENTE",
      "description": "VISUALMENTE",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000009",
      "activityLineId": "13"
    },
    {
      "name": "DATACENTER 3.0",
      "description": "DATACENTER 3.0",
      "plannedRawProfitMargin": "35.0",
      "accountGroup": "705000017",
      "activityLineId": "14"
    },
    {
      "name": "GESTION DE REDES",
      "description": "GESTION DE REDES",
      "plannedRawProfitMargin": "35.0",
      "accountGroup": "705000018",
      "activityLineId": "15"
    },
    {
      "name": "BI & ANALYTICS",
      "description": "BI & ANALYTICS",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000022",
      "activityLineId": "16"
    },
    {
      "name": "ERP",
      "description": "ERP",
      "plannedRawProfitMargin": "40.0",
      "accountGroup": "705000024",
      "activityLineId": "17"
    },
    {
      "name": "KONY",
      "description": "KONY",
      "plannedRawProfitMargin": "40.0",
      "accountGroup": "705000025",
      "activityLineId": "18"
    },
    {
      "name": "AM&PE",
      "description": "AM&PE",
      "plannedRawProfitMargin": "30.0",
      "accountGroup": "705000026",
      "activityLineId": "19"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: activitiyLines collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
