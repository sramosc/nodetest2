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
  collection.distinct('calendarType', function (e, docs) {
    res.json(docs);
  });
});

// GET calendar
router.get('/getCalendar/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  var docToFind = req.params.id;
  collection.findOne({ 'calendarId': docToFind }, {}, function (e, docs) {
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
  collection.remove({ 'calendarId': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateCalendar
router.put('/updateCalendar/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  var docToUpdate = req.params.id;
  collection.update({ 'calendarId': docToUpdate }, req.body, function (err) {
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
      'calendarId': '1',
      'calendarType': 'Festivos nacionales',
      'year': '2018',
      'days': [
        {
          'date': '01/01/2018',
          'comment': 'dia 1 de enero'
        },
        {
          'date': '01/02/2018',
          'comment': 'dia 1 de febrero'
        },
        {
          'date': '01/03/2018',
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
          'date': '02/01/2018',
          'comment': 'dia 2 de enero'
        },
        {
          'date': '02/02/2018',
          'comment': 'dia 2 de febrero'
        },
        {
          'date': '02/03/2018',
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
          'date': '02/01/2017',
          'comment': 'dia 2 de enero'
        },
        {
          'date': '02/02/2017',
          'comment': 'dia 2 de febrero'
        },
        {
          'date': '02/03/2017',
          'comment': 'dia 2 de marzo'
        }
      ]
    },
    {
      'calendarId': '4',
      'calendarType': 'Festivos Pais Vasco',
      'year': '2017',
      'days': [
        {
          'date': '02/10/2017',
          'comment': 'dia 2 de octubre'
        },
        {
          'date': '03/10/2017',
          'comment': 'dia 3 de octubre'
        },
        {
          'date': '04/10/2017',
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
