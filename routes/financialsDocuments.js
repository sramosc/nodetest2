var express = require('express');
var router = express.Router();

// GET salaries
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('financialsDocuments');

  let pipeline = [{
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
    $project: {
      "_id": 0,
      "id": 1,
      "month": 1,
      "year.id": 1,
      "year.name": 1,
      "documentType": 1,
      "userId": 1
    }
  }]

  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
    console.log("sin query params")
  } else {

    let matchStage = {}
    let matchExists = false

    // match stage
    if ('userId' in req.query) {
        matchStage['userId'] = Number(req.query.userId)
        matchExists = true
    }

    if ('yearId' in req.query) {
      matchStage['year.id'] = Number(req.query.yearId)
      matchExists = true
    }

    collection.find(matchStage, '-_id', function (e, docs) {
      totalRecords = docs.length
    })


    pipeline.push({ $match: matchStage })
  }

  console.log(pipeline)
  collection.aggregate(pipeline
    , {}, function (e, docs) {
      if (e != null) {
        res.json(e)
      } else {
        let result = {
          financialsDocuments: docs,
        }
        res.json(result)
      }
    })
});

// GET resetCollectionSalaries
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('financialsDocuments');
  collection.remove({});
  collection.insert([
    {
      "id": 1,
      "userId": 79000002374,
      "yearId": 2017,
      "month": 1,
      "documentType": "NORMAL",
    },
    {
      "id": 2,
      "userId": 79000002374,
      "yearId": 2017,
      "month": 2,
      "documentType": "NORMAL",
    },
    {
      "id": 3,
      "userId": 79000002374,
      "yearId": 2017,
      "month": 3,
      "documentType": "NORMAL",
    },
    {
      "id": 4,
      "userId": 79000002374,
      "yearId": 2017,
      "month": 4,
      "documentType": "NORMAL",
    },
    {
      "id": 5,
      "userId": 79000002374,
      "yearId": 2017,
      "month": 5,
      "documentType": "NORMAL",
    },
    {
      "id": 6,
      "userId": 79000002374,
      "yearId": 2017,
      "month": 6,
      "documentType": "NORMAL",
    },
    {
      "id": 7,
      "userId": 79000002374,
      "yearId": 2017,
      "month": 7,
      "documentType": "NORMAL",
    },
    {
      "id": 8,
      "userId": 79000002374,
      "yearId": 2017,
      "month": 8,
      "documentType": "NORMAL",
    },
    {
      "id": 9,
      "userId": 79000002374,
      "yearId": 2017,
      "month": 9,
      "documentType": "NORMAL",
    },
    {
      "id": 10,
      "userId": 79000002374,
      "yearId": 2017,
      "month": 10,
      "documentType": "NORMAL",
    },
    {
      "id": 11,
      "userId": 79000002374,
      "yearId": 2017,
      "month": 11,
      "documentType": "NORMAL",
    },
    {
      "id": 12,
      "userId": 79000002374,
      "yearId": 2017,
      "month": 12,
      "documentType": "NORMAL",
    },
    {
      "id": 13,
      "userId": 79000002374,
      "yearId": 2017,
      "month": 7,
      "documentType": "EXTRA",
    },
    {
      "id": 14,
      "userId": 79000002374,
      "yearId": 2017,
      "month": 12,
      "documentType": "EXTRA",
    },
    {
      "id": 15,
      "userId": 79000002374,
      "yearId": 2018,
      "month": 1,
      "documentType": "NORMAL",
    },
    {
      "id": 16,
      "userId": 79000002374,
      "yearId": 2018,
      "month": 2,
      "documentType": "NORMAL",
    },
    {
      "id": 17,
      "userId": 79000002374,
      "yearId": 2018,
      "month": 3,
      "documentType": "NORMAL",
    },
    {
      "id": 18,
      "userId": 79000002374,
      "yearId": 2018,
      "month": 4,
      "documentType": "NORMAL",
    },
    {
      "id": 19,
      "userId": 79000002374,
      "yearId": 2018,
      "month": 5,
      "documentType": "NORMAL",
    },
    {
      "id": 20,
      "userId": 79000002374,
      "yearId": 2018,
      "month": 6,
      "documentType": "NORMAL",
    },
    {
      "id": 21,
      "userId": 79000002374,
      "yearId": 2018,
      "month": 7,
      "documentType": "NORMAL",
    },
    {
      "id": 22,
      "userId": 79000002374,
      "yearId": 2018,
      "month": 8,
      "documentType": "NORMAL",
    },
    {
      "id": 23,
      "userId": 79000002374,
      "yearId": 2018,
      "month": 9,
      "documentType": "NORMAL",
    },
    {
      "id": 24,
      "userId": 79000002374,
      "yearId": 2018,
      "month": 10,
      "documentType": "NORMAL",
    },
    {
      "id": 25,
      "userId": 79000002374,
      "yearId": 2018,
      "month": 11,
      "documentType": "NORMAL",
    },
    {
      "id": 26,
      "userId": 79000002374,
      "yearId": 2018,
      "month": 12,
      "documentType": "NORMAL",
    },
    {
      "id": 27,
      "userId": 79000002374,
      "yearId": 2018,
      "month": 7,
      "documentType": "EXTRA",
    },
    {
      "id": 28,
      "userId": 79000002374,
      "yearId": 2018,
      "month": 12,
      "documentType": "EXTRA",
    },
    {
      "id": 29,
      "userId": 79000002374,
      "yearId": 2019,
      "month": 10,
      "documentType": "NORMAL",
    },
    {
      "id": 30,
      "userId": 79000002374,
      "yearId": 2019,
      "month": 11,
      "documentType": "NORMAL",
    },
    {
      "id": 31,
      "userId": 79000005678,
      "yearId": 2018,
      "month": 12,
      "documentType": "NORMAL",
    },
    {
      "id": 32,
      "userId": 79000005678,
      "yearId": 2018,
      "month": 7,
      "documentType": "EXTRA",
    },
    {
      "id": 33,
      "userId": 79000005678,
      "yearId": 2017,
      "month": 12,
      "documentType": "EXTRA",
    }

  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: financialsDocuments collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
