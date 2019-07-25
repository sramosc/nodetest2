var express = require('express');
var router = express.Router();


// GET employees selection v.2
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('travelAllowance');
  let recordsPipeline = []
  let countPipeline = []

  let pipeline = [
    {
      $project: {
        "_id": 0,
        "id": 1,
        "name": 1,
        "travelAllowanceExempt": 1
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
  var collection = db.get('travelAllowance');
  collection.remove({});
  collection.insert([
    {
      "name": "ESPAÑA CON PERNOCTA",
      "travelAllowanceExempt": 50,
      "id": 1
    },
    {
      "name": "ESPAÑA SIN PERNOCTA",
      "travelAllowanceExempt": 35,
      "id": 2
    },
    {
      "name": "EXTRANJERO CON PERNOCTA",
      "travelAllowanceExempt": 200,
      "id": 3
    },
    {
      "name": "EXTRANJERO SIN PERNOCTA",
      "travelAllowanceExempt": 150,
      "id": 4
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: activitiyLines collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
