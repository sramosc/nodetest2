var express = require('express');
var router = express.Router();

// GET activities lines list
router.get('/list', function (req, res) {
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
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": "$id",
        "name": "$name",
        "dept": 1
      }
    }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      let result = {
        options: docs
      }
      res.json(result)      
    }
  })
});

// GET employee
router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  var docToFind = req.params.id;
  collection.findOne({ 'id': docToFind }, {}, function (e, docs) {
    res.json(docs);
  });
});

// POST addEmployee.
router.post('/add', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE delEmployee
router.delete('/del/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  var docToDelete = req.params.id;
  collection.remove({ 'id': docToDelete }, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// PUT updateEmployee
router.put('/update/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  var docToUpdate = req.params.id;
  collection.update({ 'id': docToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: '' } : { msg: 'error: ' + err });
  });
});

// GET ounits Filter list
router.get('/listOUnitsFilter', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  collection.find({}, { fields: { id: 1, name: 1 } }, function (e, docs) {
    res.json(docs);
  });
});

// GET resetCollectionEmployees
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('ounits');
  collection.remove({});
  collection.insert([
    {
      id: '1',
      managerId: '1',
      name: 'HIVERIA 04 MLA',
      description: '',
      oUnitTypeId: '1',
      dept: "1000/1000/ES0100",
      noticeToManagerHoliday: "true",
      noticeToManagerExpenditure: "false",
      noticeToManagerWorkReport: "true",
      parentId: '#'
    },
    {
      id: '2',
      managerId: '12',
      name: 'MANUAL ARCHITECTURE',
      description: '',
      oUnitTypeId: '2',
      dept: "2000/2000/ES0200",
      noticeToManagerHoliday: "false",
      noticeToManagerExpenditure: "true",
      noticeToManagerWorkReport: "true",
      parentId: '1'
    },
    {
      id: '3',
      managerId: '23',
      name: 'OGT-A2M-RIA',
      description: '',
      oUnitTypeId: '3',
      dept: "3000/3000/ES0300",
      noticeToManagerHoliday: "true",
      noticeToManagerExpenditure: "false",
      noticeToManagerWorkReport: "false",
      parentId: '1'
    },
    {
      id: '4',
      managerId: '24',
      name: 'B&M AREA IT',
      description: '',
      oUnitTypeId: '2',
      dept: "5000/5000/ES0500",
      noticeToManagerHoliday: "false",
      noticeToManagerExpenditure: "true",
      noticeToManagerWorkReport: "true",
      parentId: '2'
    },
    {
      id: '5',
      managerId: '25',
      name: 'OFICINA DE PROYECTOS',
      description: '',
      oUnitTypeId: '2',
      dept: "4000/4000/ES0400",
      noticeToManagerHoliday: "true",
      noticeToManagerExpenditure: "false",
      noticeToManagerWorkReport: "true",
      parentId: '3'
    },
    {
      id: '6',
      managerId: '26',
      name: 'SOFTWARE LIBRE',
      description: '',
      oUnitTypeId: '1',
      dept: "3400/4000/ES0300",
      noticeToManagerHoliday: "true",
      noticeToManagerExpenditure: "true",
      noticeToManagerWorkReport: "true",
      parentId: '3'
    },
    {
      id: '7',
      managerId: '27',
      name: 'JANDERS KLANDERS',
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
