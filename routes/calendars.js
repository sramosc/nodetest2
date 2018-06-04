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

// GET calendar
router.get('/getCalendar/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('calendars');
  var docToFind = req.params.id;
  collection.find({ 'anio': docToFind }, {}, function (e, docs) {
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
  collection.remove({ 'anio': docToDelete }, function (err) {
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
      'name': 'Nvidad',
      'anio': '2018',
      'tipo': 'Laboral'
    },
    {
      'name': 'Semana Santa',
      'anio': '2017',
      'tipo': 'Festivo'
    }
  ]);
});

module.exports = router;
