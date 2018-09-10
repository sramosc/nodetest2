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
router.get('/getOUnit/:oUnitId', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  var docToFind = req.params.oUnitId;
  collection.find({ 'oUnitId': docToFind }, {}, function (e, docs) {
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
router.delete('/delOUnit/:oUnitId', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  var docToDelete = req.params.oUnitId;
  collection.remove({ 'oUnitId': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateEmployee
router.put('/updateOUnit/:oUnitId', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  var docToUpdate = req.params.oUnitId;
  collection.update({ 'oUnitId': docToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// GET ounits Filter list
router.get('/listOUnitsFilter', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  collection.find({}, { fields: { oUnitId: 1, oUnitName: 1 } }, function (e, docs) {
    res.json(docs);
  });
});

// GET resetCollectionEmployees
router.get('/resetCollectionOUnits', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  collection.remove({});
  collection.insert([
    {
      oUnitId: '1',
      responsibleId: '1',
      oUnitName: 'IBERIA 04 MLA',
      description: 'texto descriptivo unidad organizativa 1',
      oUnitTypeId: '1',
      deptId: '1',
      noticeToManagerHoliday: "true",
      noticeToManagerExpenditure: "false",
      noticeToManagerWorkReport: "true",
      parentId: '#'
    },
    {
      oUnitId: '2',
      responsibleId: 'Responsable',
      oUnitName: 'DIGITAL ARCHITECTURE',
      description: 'texto descriptivo unidad organizativa 2',
      oUnitTypeId: '2',
      deptId: '2',
      noticeToManagerHoliday: "false",
      noticeToManagerExpenditure: "true",
      noticeToManagerWorkReport: "true",
      parentId: '1'
    },
    {
      oUnitId: '3',
      responsibleId: 'Responsable',
      oUnitName: 'UNIT3',
      description: 'texto descriptivo unidad organizativa 3',
      oUnitTypeId: '3',
      deptId: '2',
      noticeToManagerHoliday: "true",
      noticeToManagerExpenditure: "false",
      noticeToManagerWorkReport: "false",
      parentId: '1'
    },
    {
      oUnitId: '4',
      responsibleId: 'Responsable',
      oUnitName: 'UNIT4',
      description: 'texto descriptivo unidad organizativa 4',
      oUnitTypeId: '2',
      deptId: '3',
      noticeToManagerHoliday: "false",
      noticeToManagerExpenditure: "true",
      noticeToManagerWorkReport: "true",
      parentId: '2'
    },
    {
      oUnitId: '5',
      responsibleId: 'Responsable',
      oUnitName: 'UNIT5',
      description: 'texto descriptivo unidad organizativa 5',
      oUnitTypeId: '2',
      deptId: '4',
      noticeToManagerHoliday: "true",
      noticeToManagerExpenditure: "false",
      noticeToManagerWorkReport: "true",
      parentId: '3'
    },
    {
      oUnitId: '6',
      responsibleId: 'Responsable',
      oUnitName: 'UNIT6',
      description: 'texto descriptivo unidad organizativa 6',
      oUnitTypeId: '1',
      deptId: '5',
      noticeToManagerHoliday: "true",
      noticeToManagerExpenditure: "true",
      noticeToManagerWorkReport: "true",
      parentId: '3'
    },
    {
      oUnitId: '7',
      responsibleId: 'Responsable',
      oUnitName: 'UNIT7',
      description: 'texto descriptivo unidad organizativa 7',
      oUnitTypeId: '1',
      deptId: '2',
      noticeToManagerHoliday: "true",
      noticeToManagerExpenditure: "false",
      noticeToManagerWorkReport: "true",
      parentId: '6'
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: ounits collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
