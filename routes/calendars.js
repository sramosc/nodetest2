var express = require('express');
var router = express.Router();

// GET calendars list
/* router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
}); */

// GET bank calendars list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  let totalRecords = 0


  collection.count({}).then((count) => {
    totalRecords = count
  })

  let pipeline = [
    {
      $lookup: {
        from: "calendarTypes",
        localField: "calendarTypeId",
        foreignField: "id",
        as: "type"
      }
    },
    {
      $project: {
        "_id": 0,
        "id": 1,
        "year": 1,
        "type.id": "$calendarTypeId",
        "type.name": { $arrayElemAt: ["$type.name", 0] },
      }
    },
    { $unwind: "$type" }
  ]

  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
    console.log("sin query params")
  } else {

    let matchStage = {}
    let sortStage = {}
    let matchExists = false

    // match stage
    if ('typeId' in req.query) {
      matchStage['type.id'] = req.query.typeId
      matchExists = true
    }

    if ('year' in req.query) {
      matchStage.year = req.query.year
      matchExists = true
    }

    if (matchExists) {
      collection.count({ matchStage }).then((count) => {
        totalRecords = count
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

  console.log(pipeline)
  collection.aggregate(pipeline
    , {}, function (e, docs) {
      if (e != null) {
        res.json(e)
      } else {
        let result = {
          calendars: docs,
          totalRecords: totalRecords
        }
        res.json(result)
      }
    })
});

// LIST calendar years
router.get('/listCalendarYears', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  collection.distinct('year', function (e, docs) {
    res.json(docs);
  });
});

// LIST calendar types
router.get('/listtypes', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  collection.distinct('type', function (e, docs) {
    res.json(docs);
  });
});

// GET calendar
router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  var docToFind = req.params.id;
  collection.findOne({ 'id': docToFind }, {}, function (e, docs) {
    res.json(docs);
  });
});

// POST addCalendar.
router.post('/add', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE delCalendar
router.delete('/del/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  var docToDelete = req.params.id;
  collection.remove({ 'id': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateCalendar
router.put('/update/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  var docToUpdate = req.params.id;
  collection.update({ 'id': docToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// GET resetCollectionCalendars
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  collection.remove({});
  collection.insert([
    {
      'id': '1',
      'calendarTypeId': '1',
      'year': '2018',
      'days': [
        {
          'date': '2018-01-01',
          'comment': 'dia 1 de enero'
        },
        {
          'date': '2018-02-01',
          'comment': 'dia 1 de febrero'
        },
        {
          'date': '2018-03-01',
          'comment': 'dia 1 de marzo'
        }
      ]
    },
    {
      'id': '2',
      'calendarTypeId': '4',
      'year': '2018',
      'days': [
        {
          'date': '2018-01-02',
          'comment': 'dia 2 de enero'
        },
        {
          'date': '2018-02-02',
          'comment': 'dia 2 de febrero'
        },
        {
          'date': '2018-03-02',
          'comment': 'dia 2 de marzo'
        }
      ]
    },
    {
      'id': '3',
      'calendarTypeId': '1',
      'year': '2017',
      'days': [
        {
          'date': '2017-01-02',
          'comment': 'dia 2 de enero'
        },
        {
          'date': '2017-02-02',
          'comment': 'dia 2 de febrero'
        },
        {
          'date': '2017-03-02',
          'comment': 'dia 2 de marzo'
        }
      ]
    },
    {
      'id': '4',
      'calendarTypeId': '2',
      'year': '2016',
      'days': [
        {
          'date': '2016-10-02',
          'comment': 'dia 2 de octubre'
        },
        {
          'date': '2016-10-03',
          'comment': 'dia 3 de octubre'
        },
        {
          'date': '2016-10-04',
          'comment': 'dia 4 de octubre'
        }
      ]
    },
    {
      'id': '5',
      'calendarTypeId': '3',
      'year': '2018',
      'days': [
        {
          'date': '2018-10-02',
          'comment': 'dia 2 de octubre'
        },
        {
          'date': '2018-10-03',
          'comment': 'dia 3 de octubre'
        },
        {
          'date': '2018-10-04',
          'comment': 'dia 4 de octubre'
        }
      ]
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: calendars collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
