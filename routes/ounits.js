var express = require('express');
var router = express.Router();

// GET activities lines list
router.get('/listOUnits', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  collection.aggregate([
    {
      $project: {
        "_id": 0,
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

// GET activities lines para combo modal
router.get('/listOUnitsModal', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": "$oUnitId",
        "name": "$oUnitName"
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

// GET employee
router.get('/getOUnit/:oUnitId', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  var docToFind = req.params.oUnitId;
  collection.findOne({ 'oUnitId': docToFind }, {}, function (e, docs) {
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
      description: '',
      oUnitTypeId: '1',
      dept: "1000/1000/ES0100",
      noticeToManagerHoliday: "true",
      noticeToManagerExpenditure: "false",
      noticeToManagerWorkReport: "true",
      parentId: '#'
    },
    {
      oUnitId: '2',
      responsibleId: '12',
      oUnitName: 'DIGITAL ARCHITECTURE',
      description: '',
      oUnitTypeId: '2',
      dept: "2000/2000/ES0200",
      noticeToManagerHoliday: "false",
      noticeToManagerExpenditure: "true",
      noticeToManagerWorkReport: "true",
      parentId: '1'
    },
    {
      oUnitId: '3',
      responsibleId: '23',
      oUnitName: 'SOA-BPM-RIA',
      description: '',
      oUnitTypeId: '3',
      dept: "3000/3000/ES0300",
      noticeToManagerHoliday: "true",
      noticeToManagerExpenditure: "false",
      noticeToManagerWorkReport: "false",
      parentId: '1'
    },
    {
      oUnitId: '4',
      responsibleId: '24',
      oUnitName: 'C&F AREA IT',
      description: '',
      oUnitTypeId: '2',
      dept: "5000/5000/ES0500",
      noticeToManagerHoliday: "false",
      noticeToManagerExpenditure: "true",
      noticeToManagerWorkReport: "true",
      parentId: '2'
    },
    {
      oUnitId: '5',
      responsibleId: '25',
      oUnitName: 'OFICINA DE PROYECTOS',
      description: '',
      oUnitTypeId: '2',
      dept: "4000/4000/ES0400",
      noticeToManagerHoliday: "true",
      noticeToManagerExpenditure: "false",
      noticeToManagerWorkReport: "true",
      parentId: '3'
    },
    {
      oUnitId: '6',
      responsibleId: '26',
      oUnitName: 'SOFTWARE LIBRE',
      description: '',
      oUnitTypeId: '1',
      dept: "3400/4000/ES0300",
      noticeToManagerHoliday: "true",
      noticeToManagerExpenditure: "true",
      noticeToManagerWorkReport: "true",
      parentId: '3'
    },
    {
      oUnitId: '7',
      responsibleId: '27',
      oUnitName: 'WOLTERS KLUWER',
      description: '',
      oUnitTypeId: '1',
      dept: "4000/2343/ES0400",
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
