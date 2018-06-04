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
      responsable: 'Responsable',
      nombre: 'UNIT1',
      depende: 'Depende',
      descripcion: 'Descripcion',
      tipo: 'Tipo',
      departamento: 'Departamento',
      notifVacs: 'Sí',
      notifGast: 'No',
      notifActi: 'Sí',
      parent: '#'
    },
    {
      id: '2',
      responsable: 'Responsable',
      nombre: 'UNIT2',
      depende: 'Depende',
      descripcion: 'Descripcion',
      tipo: 'Tipo',
      departamento: 'Departamento',
      notifVacs: 'No',
      notifGast: 'Sí',
      notifActi: 'Sí',
      parent: '1'
    },
    {
      id: '3',
      responsable: 'Responsable',
      nombre: 'UNIT3',
      depende: 'Depende',
      descripcion: 'Descripcion',
      tipo: 'Tipo',
      departamento: 'Departamento',
      notifVacs: 'Sí',
      notifGast: 'No',
      notifActi: 'No',
      parent: '1'
    },
    {
      id: '4',
      responsable: 'Responsable',
      nombre: 'UNIT4',
      depende: 'Depende',
      descripcion: 'Descripcion',
      tipo: 'Tipo',
      departamento: 'Departamento',
      notifVacs: 'No',
      notifGast: 'Sí',
      notifActi: 'Sí',
      parent: '2'
    },
    {
      id: '5',
      responsable: 'Responsable',
      nombre: 'UNIT5',
      depende: 'Depende',
      descripcion: 'Descripcion',
      tipo: 'Tipo',
      departamento: 'Departamento',
      notifVacs: 'Sí',
      notifGast: 'No',
      notifActi: 'Sí',
      parent: '3'
    },
    {
      id: '6',
      responsable: 'Responsable',
      nombre: 'UNIT6',
      depende: 'Depende',
      descripcion: 'Descripcion',
      tipo: 'Tipo',
      departamento: 'Departamento',
      notifVacs: 'Sí',
      notifGast: 'Sí',
      notifActi: 'Sí',
      parent: '3'
    },
    {
      id: '7',
      responsable: 'Responsable',
      nombre: 'UNIT7',
      depende: 'Depende',
      descripcion: 'Descripcion',
      tipo: 'Tipo',
      departamento: 'Departamento',
      notifVacs: 'Sí',
      notifGast: 'No',
      notifActi: 'Sí',
      parent: '6'
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
