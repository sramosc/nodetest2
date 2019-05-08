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

  /*
    collection.count({}).then((count) => {
      totalRecords = count
    })
  */
  let pipeline = [
    {
      $lookup: {
        from: "calendarTypes",
        localField: "typeId",
        foreignField: "id",
        as: "type"
      }
    },
    { $unwind: "$type" },
    {
      $lookup: {
        from: "calendarYears",
        localField: "yearId",
        foreignField: "id",
        as: "year"
      }
    },
    { $unwind: "$year" },
    {
      $project: {
        "_id": 0,
        "id": 1,
        "name": 1,
        "year.id": 1,
        "type.id": 1,
        "year.name": 1,
        "type.name": 1,
        // "type.name": { $arrayElemAt: ["$type.name", 0] },
        // "year.name": { $arrayElemAt: ["$year.name", 0] },
      }
    }
  ]

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

    if ('typeId' in req.query) {
      matchStage['type.id'] = Number(req.query.typeId)
      matchExists = true
    }

    if ('yearId' in req.query) {
      matchStage['year.id'] = Number(req.query.yearId)
      matchExists = true
    }

    if (!matchExists) {
      collection.count({}).then((count) => {
        totalRecords = count

      })
    } else {
      totalRecords = 10
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
  console.log("total2:" + totalRecords)
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
router.get('/listcalendaryears', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  collection.distinct('year', function (e, docs) {
    res.json(docs);
  });
});

// GET enterprises Modal list
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": "$enterpriseId",
        "name": "$enterpriseName"
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
  var docToFind = Number(req.params.id);
  var db = req.db;
  var collection = db.get('calendars');

  let pipeline = [
    {
      $match: { "id": docToFind }
    },
    {
      $lookup: {
        from: "calendarTypes",
        localField: "typeId",
        foreignField: "id",
        as: "type"
      }
    },
    { $unwind: "$type" },
    {
      $lookup: {
        from: "calendarYears",
        localField: "yearId",
        foreignField: "id",
        as: "year"
      }
    },
    { $unwind: "$year" },
    {
      $project: {
        "_id": 0,
        "id": 1,
        "name": 1,
        //"type.id": 1,
        "type.id": "$type.id",
        "type.name":"$type.name",
        "year.id": "$year.id",
        "year.name":"$year.name",
      //  "type.name": 1,
        //"year.id": 1,
      //  "year.name": 1,
        "dates": 1
      }
    }
  ]
  collection.aggregate(pipeline
    , {}, function (e, docs) {
      if (e != null) {
        res.json(e)
      } else {
        docs[0].version = 1
        let result = {
          calendar: docs[0],
        }
        res.json(result)
      }
    })
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
  var docToDelete = Number(req.params.id);
  collection.remove({ 'id': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateCalendar
router.put('/update/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  var docToUpdate = Number(req.params.id);
  collection.update({ 'id': docToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: 'El calendario ha sido modificada con éxito' } : { msg: 'error: ' + err });
  });
});

// GET resetCollectionCalendars
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  collection.remove({});
  collection.insert([
    {
      'id': 1,
      'name': 'calendario1',
      'typeId': 1,
      'yearId': 2018,
      'dates': [
        {
          'id':1,
          'date': '2018-01-01',
          'comment': 'dia 1 de enero'
        },
        {
          'id':2,
          'date': '2018-02-01',
          'comment': 'dia 1 de febrero'
        },
        {
          'id':3,
          'date': '2018-03-01',
          'comment': 'dia 1 de marzo'
        }
      ]
    },
    {
      'id': 2,
      'name': 'calendario2',
      'typeId': 4,
      'yearId': 2018,
      'dates': [
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
      'id': 3,
      'name': 'calendario3',
      'typeId': 1,
      'yearId': 2017,
      'dates': [
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
      'id': 4,
      'name': 'calendario4',
      'typeId': 2,
      'yearId': 2016,
      'dates': [
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
      'id': 5,
      'name': 'calendario5',
      'typeId': 3,
      'yearId': 2018,
      'dates': [
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
