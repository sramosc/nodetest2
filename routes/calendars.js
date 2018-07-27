var express = require('express');
var router = express.Router();

// GET calendars list
router.get('/listCalendars', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
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
router.get('/listCalendarTypes', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  collection.distinct('type', function (e, docs) {
    res.json(docs);
  });
});

// GET calendar
router.get('/getCalendar/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  var docToFind = req.params.id;
  collection.findOne({ 'id': docToFind }, {}, function (e, docs) {
    res.json(docs);
  });
});

// POST addCalendar.
router.post('/addCalendar', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE delCalendar
router.delete('/delCalendar/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  var docToDelete = req.params.id;
  collection.remove({ 'id': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateCalendar
router.put('/updateCalendar/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  var docToUpdate = req.params.id;
  collection.update({ 'id': docToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// GET resetCollectionCalendars
router.get('/resetCollectionCalendars', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  collection.remove({});
  collection.insert([
    {
      'id': '1',
      'type': 'Festivos nacionales',
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
      'type': 'Festivos Comunidad Madrid',
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
      'type': 'Festivos nacionales',
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
      'type': 'Festivos Pais Vasco',
      'year': '2017',
      'days': [
        {
          'date': '2017-10-02',
          'comment': 'dia 2 de octubre'
        },
        {
          'date': '2017-10-03',
          'comment': 'dia 3 de octubre'
        },
        {
          'date': '2017-10-04',
          'comment': 'dia 4 de octubre'
        }
      ]
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
