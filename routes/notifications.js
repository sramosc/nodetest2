var express = require('express');
var router = express.Router();

// GET notifications list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('notifications');
  let totalRecords = 0

  collection.count({}).then((count) => {
    totalRecords = count
  })

  let pipeline = []
  let countpipeline = []

  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
    console.log("sin query params")
  } else {

    let matchStage = {}
    let sortStage = {}
    let matchExists = false

    // match stage
    if ('dateFrom' in req.query) {

      if ('dateTo' in req.query) {
        matchStage.date = { $gte: req.query.dateFrom, $lte: req.query.dateTo }

      } else {
        matchStage.date = { $gte: req.query.dateFrom }
      }
      matchExists = true
    } else {
      if ('dateTo' in req.query) {
        matchStage.date = { $lte: req.query.dateTo }
        matchExists = true
      }
    }

    if ('typeId' in req.query) {
      matchStage['typeId'] = Number(req.query.typeId)
      matchExists = true
    }

    if ('read' in req.query) {
      matchStage['read'] = (req.query.read == 'true') ? true : false
      matchExists = true
    }

    if (matchExists) {
      console.log(matchStage)
      countpipeline.push({ $match: matchStage })
      collection.aggregate(countpipeline
        , {}, function (e, docs) {
          if (e != null) {
            totalRecords = 0
          } else {
            totalRecords = docs.length
            console.log(totalRecords)
          }
        })

      /*collection.count({ matchStage }).then((count) => {
        totalRecords = count
        console.log(totalRecords)
      })*/
    }


    pipeline.push({ $match: matchStage })

    pipeline.push({
      $lookup: {
        from: "notificationTypes",
        localField: "typeId",
        foreignField: "id",
        as: "type"
      }
    })
    pipeline.push({ $unwind: "$type" })

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
      pipeline.push({ $sort: sortStage })
    }

    // skip and limit stage
    if (('pageNumber' in req.query) && ('pageSize' in req.query)) {

      pipeline.push({ $skip: (req.query.pageNumber - 1) * req.query.pageSize })
      pipeline.push({ $limit: parseInt(req.query.pageSize) })
    }

  }
  pipeline.push(
    {
      $project:
      {
        "_id": 0,
        "id": 1,
        "date": 1,
        "readNotification": "$read",
        "description": 1,
        "typeNotification.name": "$type.name",
        "typeNotification.id": "$type.id",
        "urlNotification":1,
        "erasableNotification":1
      }
    })
  console.log(pipeline)
  collection.aggregate(pipeline
    , {}, function (e, docs) {
      if (e != null) {
        res.json(e)
      } else {
        let result = {
          notifications: docs,
          totalRecords: totalRecords
        }
        res.json(result)
      }
    })

});

router.get('/getnumber', function (req, res) {
  res.json(3)
})

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


// GET reset Collection Notifications
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('notifications');
  collection.remove({});
  collection.insert([
    {
      id: 1,
      typeId: 1,
      date: '2018-03-01',
      read: true,
      erasableNotification: true,
      description: 'El usuario PEPE RUIZ ha enviado su parte de actividad',
      urlNotification: '/employee/workreports'
    },
    {
      id: 2,
      typeId: 2,
      date: '2018-03-04',
      read: false,
      erasableNotification: true,
      description: 'El/la usuario/a JUANA SANCHEZ ha solicitado días de vacaciones',
      urlNotification: '/employee/vacations'
    },
    {
      id: 3,
      typeId: 3,
      date: '2018-11-04',
      read: false,
      erasableNotification: true,
      description: 'Se ha generado una hoja de gastos para la actividad 234',
      urlNotification: ''
    },
    {
      id: 4,
      typeId: 2,
      date: '2018-03-04',
      read: false,
      erasableNotification: true,
      description: 'El/la usuario/a LUCAS MARTINEZ ha solicitado días de vacaciones',
      urlNotification: '/employee/vacations'
    },
    {
      id: 5,
      typeId: 2,
      date: '2018-03-16',
      read: true,
      erasableNotification: true,
      description: 'El/la usuario/a PILAR MARTIN ha rechazado sus vacaciones',
      urlNotification: '/employee/vacations'
    },
    {
      id: 6,
      typeId: 1,
      date: '2017-03-16',
      read: true,
      erasableNotification: true,
      description: 'Se ha aprobado su parte de actividad',
      urlNotification: '/employee/workreports'
    },
    {
      id: 7,
      typeId: 4,
      date: '2018-05-06',
      read: false,
      erasableNotification: true,
      description: 'Ya está disponible su nómina correspondiente a 2018/04',
      urlNotification: '/employee/salaries'
    },
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: activities notification has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
