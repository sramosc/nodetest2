var express = require('express');
var router = express.Router();

// GET calendars list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  collection.find({}, '-_id', function (e, docs) {
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
  collection.distinct('calendarType', function (e, docs) {
    res.json(docs);
  });
});

// GET calendar
router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  var docToFind = req.params.id;
  collection.findOne({ 'calendarId': docToFind }, {}, function (e, docs) {
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
  collection.remove({ 'calendarId': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateCalendar
router.put('/update/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  var docToUpdate = req.params.id;
  collection.update({ 'calendarId': docToUpdate }, req.body, function (err) {
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
      'calendarId': '1',
      'calendarType': 'Festivos nacionales',
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
      'calendarId': '2',
      'calendarType': 'Festivos Comunidad Madrid',
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
      'calendarId': '3',
      'calendarType': 'Festivos nacionales',
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
      'calendarId': '4',
      'calendarType': 'Festivos Pais Vasco',
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
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: calendars collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
