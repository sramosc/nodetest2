var express = require('express');
var router = express.Router();

// GET vacations list
router.get('/listVacations', function (req, res) {
  var db = req.db;
  var collection = db.get('vacations');
  collection.aggregate([
    {
      $project: {
        _id: 0,
        "vacation_year": 1,
        "employee_id": 1,
        "total_days": 1
      }
    },
    {
      $lookup: {
        from: "employees",
        localField: "employee_id",
        foreignField: "code",
        as: "employee_data"
      }
    },
    {
      $project: {
        "vacation_year": 1,
        "name": {$arrayElemAt: [ "$employee_data.name", 0 ]},
        "total_days": 1
      }
    }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      res.json(docs)
    }
  })
});

// GET vacation (id = id)
router.get('/getVacation/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('vacations');
  var docToFind = req.params.id;
  collection.findOne({ 'id': docToFind }, {}, function (e, docs) {
    res.json(docs);
  });
});

// GET vacation years list
router.get('/listVacationYears', function (req, res) {
  var db = req.db;
  var collection = db.get('vacations');
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});


// GET resetCollectionVacations
router.get('/resetCollectionVacations', function (req, res) {
  var db = req.db;
  var collection = db.get('vacations');
  collection.remove({});
  collection.insert([
    {
      "vacation_id": "1",
      "vacation_year": "2017",
      "employee_id": "1",
      "total_days": "22",
      "days": [
        {
          "date": "2017-04-23T00:00:00.000Z",
          "comment": "vacacion1",
          "status": "pending"
        },
        {
          "date": "2017-03-15T00:00:00.000Z",
          "comment": "vacacion2",
          "status": "approved"
        },
        {
          "date": "2017-02-01T00:00:00.000Z",
          "comment": "vacacion3",
          "status": "cancelled"
        }
      ]
    },
    {
      "vacation_id": "2",
      "vacation_year": "2018",
      "employee_id": "1",
      "total_days": "22",
      "days": [
        {
          "date": "2018-04-23T00:00:00.000Z",
          "comment": "vacacion1",
          "status": "pending"
        },
        {
          "date": "2018-03-15T00:00:00.000Z",
          "comment": "vacacion2",
          "status": "approved"
        },
        {
          "date": "2018-02-01T00:00:00.000Z",
          "comment": "vacacion3",
          "status": "cancelled"
        }
      ]
    },
    {
      "vacation_id": "3",
      "vacation_year": "2017",
      "employee_id": "2",
      "total_days": "20",
      "days": [
        {
          "date": "2017-02-23T00:00:00.000Z",
          "comment": "vacacion1",
          "status": "approved"
        },
        {
          "date": "2017-02-15T00:00:00.000Z",
          "comment": "vacacion2",
          "status": "approved"
        },
        {
          "date": "2017-02-01T00:00:00.000Z",
          "comment": "vacacion3",
          "status": "cancelled"
        }
      ]
    },
    {
      "vacation_id": "4",
      "vacation_year": "2017",
      "employee_id": "3",
      "total_days": "22",
      "days": [
        {
          "date": "2017-04-23T00:00:00.000Z",
          "comment": "vacacion",
          "status": "pending"
        }
      ]
    },

  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
