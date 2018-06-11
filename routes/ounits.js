var express = require('express');
var router = express.Router();

// GET ounits list
router.get('/listOUnits', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

// GET employee
router.get('/getOUnit/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  var docToFind = req.params.id;
  collection.find({ 'id': docToFind }, {}, function (e, docs) {
    res.json(docs);
  });
});

// POST addEmployee.
router.post('/addOUnit', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE delEmployee
router.delete('/delOUnit/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  var docToDelete = req.params.id;
  collection.remove({ 'id': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateEmployee
router.put('/updateOUnit/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  var docToUpdate = req.params.id;
  collection.update({ 'id': docToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// GET resetCollectionEmployees
router.get('/resetCollectionOUnits', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  collection.remove({});
  collection.insert([
    {
      id: '1',
      manager: 'Responsable',
      name: 'UNIT1',
      depends: 'Depende',
      description: 'Descripcion',
      type: 'Tipo',
      department: 'Departamento',
      holidaysNotification: true,
      expensesNotification: false,
      activityNotification: true,
      parent: '#'
    },
    {
      id: '2',
      manager: 'Responsable',
      name: 'UNIT2',
      depends: 'Depende',
      description: 'Descripcion',
      type: 'Tipo',
      department: 'Departamento',
      holidaysNotification: false,
      expensesNotification: true,
      activityNotification: true,
      parent: '1'
    },
    {
      id: '3',
      manager: 'Responsable',
      name: 'UNIT3',
      depends: 'Depende',
      description: 'Descripcion',
      type: 'Tipo',
      department: 'Departamento',
      holidaysNotification: true,
      expensesNotification: false,
      activityNotification: false,
      parent: '1'
    },
    {
      id: '4',
      manager: 'Responsable',
      name: 'UNIT4',
      depends: 'Depende',
      description: 'Descripcion',
      type: 'Tipo',
      department: 'Departamento',
      holidaysNotification: false,
      expensesNotification: true,
      activityNotification: true,
      parent: '2'
    },
    {
      id: '5',
      manager: 'Responsable',
      name: 'UNIT5',
      depends: 'Depende',
      description: 'Descripcion',
      type: 'Tipo',
      department: 'Departamento',
      holidaysNotification: true,
      expensesNotification: false,
      activityNotification: true,
      parent: '3'
    },
    {
      id: '6',
      manager: 'Responsable',
      name: 'UNIT6',
      depends: 'Depende',
      description: 'Descripcion',
      type: 'Tipo',
      department: 'Departamento',
      holidaysNotification: true,
      expensesNotification: true,
      activityNotification: true,
      parent: '3'
    },
    {
      id: '7',
      manager: 'Responsable',
      name: 'UNIT7',
      depends: 'Depende',
      description: 'Descripcion',
      type: 'Tipo',
      department: 'Departamento',
      holidaysNotification: true,
      expensesNotification: false,
      activityNotification: true,
      parent: '6'
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
