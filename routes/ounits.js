var express = require('express');
var router = express.Router();

// GET activities lines list
/*router.get('/list', function (req, res) {
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
});*/

router.get('/selection', function (req,res){
  let docs  = [
    {
      id: 1,
      name: 'HIVERIA 04 MLA'
    },
    {
      id: 2,
      name: 'MANUAL ARCHITECTURE'
    },
    {
      id: 3,
      name: 'OGT-A2M-RIA',
    },
    {
      id: 4,
      name: 'B&M AREA IT',
    },
    {
      id: 5,
      name: 'OFICINA DE PROYECTOS',
    },
    {
      id: 6,
      name: 'SOFTWARE LIBRE',
    },
    {
      id: 7,
      name: 'JANDERS KLANDERS',
    }]
  
    let result = {
      options: docs,
    }
    res.json(result)
  })

  router.get('/selectionTypes', function (req,res){
    let docs  = [
      {
        id: 1,
        name: 'tipo1'
      },
      {
        id: 2,
        name: 'tipo2'
      },
      {
        id: 3,
        name: 'tipo3',
      },
      {
        id: 4,
        name: 'tipo4',
      }]
    
      let result = {
        options: docs,
      }
      res.json(result)
    })

router.get('/list', function (req,res){
  let docs  = [
  {
    id: 1,
    manager:{
      name:'Perico'
    },
    name: 'HIVERIA 04 MLA',
    description: 'descripcion 1',
    oUnitType:{
      name:'ounit de tipo 1'
    },
    dept: "1000/1000/ES0100",
    noticeToManagerHoliday: true,
    noticeToManagerExpenditure: false,
    noticeToManagerWorkReport: true,
    parent: {
      id:0,
      name:''
    }
    
  },
  {
    id: 2,
    manager:{
      name:'Manolo'
    },
    name: 'MANUAL ARCHITECTURE',
    description: '',
    oUnitType:{
      name:'ounit de tipo 2'
    },
        dept: "2000/2000/ES0200",
    noticeToManagerHoliday: false,
    noticeToManagerExpenditure: true,
    noticeToManagerWorkReport: true,
    parent: {
      id:1,
      name:'HIVERIA 04 MLA'
    }
  },
  {
    id: 3,
    manager:{
      name:'Bartolo'
    },
    name: 'OGT-A2M-RIA',
    description: '',
    oUnitType:{
      name:'ounit de tipo 3'
    },
    dept: "3000/3000/ES0300",
    noticeToManagerHoliday: true,
    noticeToManagerExpenditure: false,
    noticeToManagerWorkReport: false,
    parent: {
      id:1,
      name:'HIVERIA 04 MLA'
    }
  },
  {
    id: 4,
    manager:{
      name:'Cipriano'
    },
    name: 'B&M AREA IT',
    description: '',
    oUnitType:{
      name:'ounit de tipo 2'
    },
    dept: "5000/5000/ES0500",
    noticeToManagerHoliday: false,
    noticeToManagerExpenditure: true,
    noticeToManagerWorkReport: true,
    parent: {
      id:2,
      name:'MANUAL ARCHITECTURE'
    }
  },
  {
    id: 5,
    manager:{
      name:'Fulano'
    },
    name: 'OFICINA DE PROYECTOS',
    description: '',
    oUnitType:{
      name:'ounit de tipo 2'
    },
    dept: "4000/4000/ES0400",
    noticeToManagerHoliday: true,
    noticeToManagerExpenditure: false,
    noticeToManagerWorkReport: true,
    parent: {
      id:3,
      name:'OGT-A2M-RIA'
    }
  },
  {
    id: 6,
    manager:{
      name:'Mengano'
    },
    name: 'SOFTWARE LIBRE',
    description: '',
    oUnitType:{
      name:'ounit de tipo 1'
    },
    dept: "3400/4000/ES0300",
    noticeToManagerHoliday: true,
    noticeToManagerExpenditure: true,
    noticeToManagerWorkReport: true,
    parent: {
      id:3,
      name:'OGT-A2M-RIA'
    }
  },
  {
    id: 7,
    manager:{
      name:'Zutano'
    },
    name: 'JANDERS KLANDERS',
    description: '',
    oUnitType:{
      name:'ounit de tipo 1'
    },
    dept: "4000/2343/ES0400",
    noticeToManagerHoliday: true,
    noticeToManagerExpenditure: false,
    noticeToManagerWorkReport: true,
    parent: {
      id:6,
      name:'SOFTWARE LIBRE'
    }
  }]

  let result = {
    ounits: docs,
    totalRecords: "7"
  }
  res.json(result)
})


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

// GET ounit
router.get('/get/:id', function (req, res) {
  /*var db = req.db;
  var collection = db.get('ounits');
  var docToFind = req.params.id;
  collection.findOne({ 'id': docToFind }, {}, function (e, docs) {
    res.json(docs);
  });
  {
    "bankAccount": {
        "id": 1,
        "name": "BANCO POPULAR",
        "number": "ES6621000418401234567891",
        "ledgerAccount": "57200001",
        "enterprise": {
            "id": 1
        },
        "version": "1"
    }
}

  
  */
  let docs  = 
    {
      id: 1,
      manager:{
        id:1
      },
      name: 'HIVERIA 04 MLA',
      description: 'descripcion 1',
      oUnitType:{
        id:2
      },
      dept: "1000/1000/ES0100",
      noticeToManagerHoliday: true,
      noticeToManagerExpenditure: false,
      noticeToManagerWorkReport: true,
      parent: {
        id:0,        
      }
    }
    let result = {
      oUnit: docs,
      version: 3
    }
    res.json(result)
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
      id: 1,
      managerId: 1,
      name: 'HIVERIA 04 MLA',
      description: '',
      oUnitTypeId: 1,
      dept: "1000/1000/ES0100",
      noticeToManagerHoliday: true,
      noticeToManagerExpenditure: false,
      noticeToManagerWorkReport: true,
      parentId: 0
    },
    {
      id: 2,
      managerId: 12,
      name: 'MANUAL ARCHITECTURE',
      description: '',
      oUnitTypeId: 2,
      dept: "2000/2000/ES0200",
      noticeToManagerHoliday: false,
      noticeToManagerExpenditure: true,
      noticeToManagerWorkReport: true,
      parentId: 1
    },
    {
      id: 3,
      managerId: 23,
      name: 'OGT-A2M-RIA',
      description: '',
      oUnitTypeId: 3,
      dept: "3000/3000/ES0300",
      noticeToManagerHoliday: true,
      noticeToManagerExpenditure: false,
      noticeToManagerWorkReport: false,
      parentId: 1
    },
    {
      id: 4,
      managerId: 24,
      name: 'B&M AREA IT',
      description: '',
      oUnitTypeId: 2,
      dept: "5000/5000/ES0500",
      noticeToManagerHoliday: false,
      noticeToManagerExpenditure: true,
      noticeToManagerWorkReport: true,
      parentId: 2
    },
    {
      id: 5,
      managerId: 25,
      name: 'OFICINA DE PROYECTOS',
      description: '',
      oUnitTypeId: 2,
      dept: "4000/4000/ES0400",
      noticeToManagerHoliday: true,
      noticeToManagerExpenditure: false,
      noticeToManagerWorkReport: true,
      parentId: 3
    },
    {
      id: 6,
      managerId: 26,
      name: 'SOFTWARE LIBRE',
      description: '',
      oUnitTypeId: 1,
      dept: "3400/4000/ES0300",
      noticeToManagerHoliday: true,
      noticeToManagerExpenditure: true,
      noticeToManagerWorkReport: true,
      parentId: 3
    },
    {
      id: 7,
      managerId: 27,
      name: 'JANDERS KLANDERS',
      description: '',
      oUnitTypeId: 1,
      dept: "4000/2343/ES0400",
      noticeToManagerHoliday: true,
      noticeToManagerExpenditure: false,
      noticeToManagerWorkReport: true,
      parentId: 6
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: ounits collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
