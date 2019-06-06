var express = require('express');
var router = express.Router();

// GET enterprises list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('enterprises');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET enterprises Modal list
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('enterprises');
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


// GET enterprise (enterpriseId = id)
router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('enterprises');
  var docToFind = req.params.id;
  collection.find({ 'id': Number(docToFind) }, {}, function (e, docs) {
    res.json(docs);
  });
});

// POST add enterprise.
router.post('/add', function (req, res) {
  var db = req.db;
  var collection = db.get('enterprises');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE del Enterprise (enterpriseId = id)
router.delete('/del/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('enterprises');
  var docToDelete = req.params.id;
  collection.remove({ 'enterpriseId': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateEnterprise (enterpriseId = id)
router.put('/update/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('enterprises');
  var docToUpdate = req.params.id;
  collection.update({ 'enterpriseId': docToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// GET resetCollectionEnterprises
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('enterprises');
  collection.remove({});
  collection.insert([
    {
      "id": 1,
      "name": "NTL CONSULTING S.A"
    },
    {
      "id": 2,
      "name": "NTL QWER S.A"
    },
    {
      "id": 3,
      "name": "NTL DIGITAL"
    },
    {
      "id": 4,
      "name": "NTL S.A."
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: enterprises collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
