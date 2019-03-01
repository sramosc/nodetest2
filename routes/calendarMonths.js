var express = require('express');
var router = express.Router();

// GET calendar Years list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('calendarMonths');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET calendarYears Modal list
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('calendarMonths');
  collection.find({}, '-_id', function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      let result = {
        options: docs
      }
      res.json(result)
    }
  });
});

// GET reset
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('calendarMonths');
  collection.remove({});
  collection.insert([
    {
      id: 1,
      name: 'Enero'
    },
    {
      id: 2,
      name: 'Febrero'
    },
    {
      id: 3,
      name: 'Marzo'
    },
    {
      id: 4,
      name: 'Abril'
    },
    {
      id: 5,
      name: 'Mayo'
    },
    {
      id: 6,
      name: 'Junio'
    },
    {
      id: 7,
      name: 'Julio'
    },
    {
      id: 8,
      name: 'Agosto'
    },
    {
      id: 9,
      name: 'Septiembre'
    },
    {
      id: 10,
      name: 'Octubre'
    },
    {
      id: 11,
      name: 'Noviembre'
    },
    {
      id: 12,
      name: 'Diciembre'
    }

  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: calendarMonths collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
