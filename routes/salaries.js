var express = require('express');
var router = express.Router();

// GET salaries
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('salaries');

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
      "type": 1,
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
          salaries: docs,
        }
        res.json(result)
      }
    })
});

// GET resetCollectionSalaries
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('salaries');
  collection.remove({});
  collection.insert([
    {
      "id": 1,
      "userId": 79000002374,
      "yearId": 2017,
      "month": "ENERO",
      "type": "NORMAL",
    },
    {
      "id": 2,
      "userId": 79000002374,
      "yearId": 2017,
      "month": "FEBRERO",
      "type": "NORMAL",
    },
    {
      "id": 3,
      "userId": 79000002374,
      "yearId": 2017,
      "month": "MARZO",
      "type": "NORMAL",
    },
    {
      "id": 4,
      "userId": 79000002374,
      "yearId": 2017,
      "month": "ABRIL",
      "type": "NORMAL",
    },
    {
      "id": 5,
      "userId": 79000002374,
      "yearId": 2017,
      "month": "MAYO",
      "type": "NORMAL",
    },
    {
      "id": 6,
      "userId": 79000002374,
      "yearId": 2017,
      "month": "JUNIO",
      "type": "NORMAL",
    },
    {
      "id": 7,
      "userId": 79000002374,
      "yearId": 2017,
      "month": "JULIO",
      "type": "NORMAL",
    },
    {
      "id": 8,
      "userId": 79000002374,
      "yearId": 2017,
      "month": "AGOSTO",
      "type": "NORMAL",
    },
    {
      "id": 9,
      "userId": 79000002374,
      "yearId": 2017,
      "month": "SEPTIEMBRE",
      "type": "NORMAL",
    },
    {
      "id": 10,
      "userId": 79000002374,
      "yearId": 2017,
      "month": "OCTUBRE",
      "type": "NORMAL",
    },
    {
      "id": 11,
      "userId": 79000002374,
      "yearId": 2017,
      "month": "NOVIEMBRE",
      "type": "NORMAL",
    },
    {
      "id": 12,
      "userId": 79000002374,
      "yearId": 2017,
      "month": "DICIEMBRE",
      "type": "NORMAL",
    },
    {
      "id": 13,
      "userId": 79000002374,
      "yearId": 2017,
      "month": "JULIO",
      "type": "EXTRA",
    },
    {
      "id": 14,
      "userId": 79000002374,
      "yearId": 2017,
      "month": "DICIEMBRE",
      "type": "EXTRA",
    },
    {
      "id": 15,
      "userId": 79000002374,
      "yearId": 2018,
      "month": "ENERO",
      "type": "NORMAL",
    },
    {
      "id": 16,
      "userId": 79000002374,
      "yearId": 2018,
      "month": "FEBRERO",
      "type": "NORMAL",
    },
    {
      "id": 17,
      "userId": 79000002374,
      "yearId": 2018,
      "month": "MARZO",
      "type": "NORMAL",
    },
    {
      "id": 18,
      "userId": 79000002374,
      "yearId": 2018,
      "month": "ABRIL",
      "type": "NORMAL",
    },
    {
      "id": 19,
      "userId": 79000002374,
      "yearId": 2018,
      "month": "MAYO",
      "type": "NORMAL",
    },
    {
      "id": 20,
      "userId": 79000002374,
      "yearId": 2018,
      "month": "JUNIO",
      "type": "NORMAL",
    },
    {
      "id": 21,
      "userId": 79000002374,
      "yearId": 2018,
      "month": "JULIO",
      "type": "NORMAL",
    },
    {
      "id": 22,
      "userId": 79000002374,
      "yearId": 2018,
      "month": "AGOSTO",
      "type": "NORMAL",
    },
    {
      "id": 23,
      "userId": 79000002374,
      "yearId": 2018,
      "month": "SEPTIEMBRE",
      "type": "NORMAL",
    },
    {
      "id": 24,
      "userId": 79000002374,
      "yearId": 2018,
      "month": "OCTUBRE",
      "type": "NORMAL",
    },
    {
      "id": 25,
      "userId": 79000002374,
      "yearId": 2018,
      "month": "NOVIEMBRE",
      "type": "NORMAL",
    },
    {
      "id": 26,
      "userId": 79000002374,
      "yearId": 2018,
      "month": "DICIEMBRE",
      "type": "NORMAL",
    },
    {
      "id": 27,
      "userId": 79000002374,
      "yearId": 2018,
      "month": "JULIO",
      "type": "EXTRA",
    },
    {
      "id": 28,
      "userId": 79000002374,
      "yearId": 2018,
      "month": "DICIEMBRE",
      "type": "EXTRA",
    },
    {
      "id": 29,
      "userId": 79000002374,
      "yearId": 2019,
      "month": "OCTUBRE",
      "type": "NORMAL",
    },
    {
      "id": 30,
      "userId": 79000002374,
      "yearId": 2019,
      "month": "NOVIEMBRE",
      "type": "NORMAL",
    },
    {
      "id": 31,
      "userId": 79000005678,
      "yearId": 2018,
      "month": "DICIEMBRE",
      "type": "NORMAL",
    },
    {
      "id": 32,
      "userId": 79000005678,
      "yearId": 2018,
      "month": "JULIO",
      "type": "EXTRA",
    },
    {
      "id": 33,
      "userId": 79000005678,
      "yearId": 2017,
      "month": "DICIEMBRE",
      "type": "EXTRA",
    }

  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: salaries collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
