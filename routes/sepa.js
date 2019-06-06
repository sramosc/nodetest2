var express = require('express');
var router = express.Router();

// GET employees list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('sepa');
  var sepaPipeline = []
  var countPipeline = []

  let pipeline = [{
    $lookup: {
      from: "enterprises",
      localField: "enterpriseId",
      foreignField: "id",
      as: "enterprise"
    }
  },
  { $unwind: "$enterprise" },
  {
    $lookup: {
      from: "sepaStatus",
      localField: "statusId",
      foreignField: "id",
      as: "status"
    }
  },
  { $unwind: "$status" },
  {
    $project: {
      "_id": 0,
      "id": 1,
      "description": 1,
      "enterprise.id": "$enterprise.id",
      "enterprise.name": "$enterprise.name",
      "status.id": 1,
      "status.name": 1,
      "sendingDate": 1,
      "generationDate": 1
    }
  }]

  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
    console.log("sin query params")
  } else {

    let matchStage = {}
    let sortStage = {}
    let matchExists = false

    // match stage
    if ('enterpriseId' in req.query) {
      matchStage['enterprise.id'] = Number(req.query.enterpriseId)
      matchExists = true
    }
    if ('statusId' in req.query) {
      matchStage['status.id'] = Number(req.query.statusId)
      matchExists = true
    }

    if ('sendingDate' in req.query) {
      matchStage.sendingDate = {
        $regex: req.query.sendingDate,
        $options: 'i'
      }
      matchExists = true
    }

    if ('generationDate' in req.query) {
      matchStage.generationDate = {
        $regex: req.query.generationDate,
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
      sepaPipeline = pipeline.slice()
      sepaPipeline.push({ $skip: (req.query.pageNumber - 1) * req.query.pageSize })
      sepaPipeline.push({ $limit: parseInt(req.query.pageSize) })
    }
  }

  countPipeline = pipeline.slice()
  countPipeline.push({ $count: 'count' })

  let pipeline2 = [
    {
      $facet: {
        sepaFiles: sepaPipeline,
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
          sepaFiles: docs[0].sepaFiles,
          totalRecords: docs[0].totalRecords[0].count
        }
        res.json(result)
      }
    })
});

router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('sepa');
  var docToFind = Number(req.params.id);
  collection.aggregate([
    {
      $match: { 'id': docToFind }
    },
    {
      $lookup: {
        from: "enterprises",
        localField: "enterpriseId",
        foreignField: "id",
        as: "enterprise"
      }
    },
    { $unwind: "$enterprise" },
    {
      $lookup: {
        from: "sepaStatus",
        localField: "statusId",
        foreignField: "id",
        as: "status"
      }
    },
    { $unwind: "$status" },
    {
      $lookup: {
        from: "bankaccounts",
        localField: "bankAccountId",
        foreignField: "id",
        as: "bankaccount"
      }
    },
    { $unwind: "$bankaccount" },
    {
      $project: {
        "_id": 0,
        "id": 1,
        "description": 1,
        "enterprise.id": "$enterprise.id",
        "enterprise.name": "$enterprise.name",
        "status.id": "$status.id",
        "status.name": "$status.name",
        "iban":"$bankaccount.number",
        "ledgerAccount":"$bankaccount.ledgerAccount",
        "generationDate":1,
        "sendingDate":1
      }
    }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      docs[0].version = 1
      let result = {
        sepa: docs[0]
      }
      res.json(result)
    }
  })
});


router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('sepa');
  collection.remove({});
  collection.insert([
    {
      id: 1,
      description: 'Pago NT IT Mad 20.01.19',
      enterpriseId: 1,
      statusId: 1,
      bankAccountId: 1,
      generationDate: '2019-03-15',
      sendingDate: '2019-03-30',
    },
    {
      id: 2,
      description: 'Pago NT IT Mad 14.02.19',
      enterpriseId: 1,
      statusId: 1
    },
    {
      id: 3,
      description: 'Pago NT IT Mad 2.03.19',
      enterpriseId: 1,
      statusId: 2
    },
    {
      id: 4,
      description: 'Pago ASDASD 1',
      enterpriseId: 2,
      statusId: 1
    },
    {
      id: 5,
      description: 'Pago ASDAS 2',
      enterpriseId: 2,
      statusId: 1
    },
    {
      id: 6,
      description: 'Pago ASDASDA 3',
      enterpriseId: 2,
      statusId: 2
    },
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: sepa collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});


module.exports = router;
