var express = require('express');
var router = express.Router();

// GET bank accounts list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('bankaccounts');
  let totalRecords = 0


  /* collection.count({}).then((count) => {
     totalRecords = count
   })*/

  let pipeline = [{
    $lookup: {
      from: "enterprises",
      localField: "enterpriseId",
      foreignField: "enterpriseId",
      as: "enterprise"
    }
  },
  {
    $project: {
      "_id": 0,
      "id": 1,
      "name": 1,
      "number": 1,
      "enterprise.id": "$enterpriseId",
      "enterprise.name": { $arrayElemAt: ["$enterprise.enterpriseName", 0] },
      "ledgerAccount": 1
    }
  },
  { $unwind: "$enterprise" }
  ]

  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
    console.log("sin query params")
  } else {

    let matchStage = {}
    let sortStage = {}
    let matchExists = false

    // match stage
    if ('name' in req.query) {
      matchStage.name = {
        $regex: req.query.name,
        $options: 'i'
      }
      matchExists = true
    }
    if ('enterpriseId' in req.query) {
      matchStage['enterprise.id'] = Number(req.query.enterpriseId)
      matchExists = true
    }

    if (matchExists) {
      console.log(matchStage)
      collection.count({ matchStage }).then((count) => {
        totalRecords = count
        console.log(totalRecords)
        console.log(count)
      })
    }


    // sort stage
    if ('pageSort' in req.query) {
      let field = req.query.pageSort
      let orderAsc = true
      if (req.query.pageSort.indexOf('-')) {
        orderAsc = false
      }
      field = field.replace('-', '')
      if (orderAsc) {
        sortStage[field] = -1
      } else {
        sortStage[field] = 1
      }
    }
    pipeline.push({ $match: matchStage })
    pipeline.push({ $sort: sortStage })

    // skip and limit stage
    if (('pageNumber' in req.query) && ('pageSize' in req.query)) {

      pipeline.push({ $skip: (req.query.pageNumber - 1) * req.query.pageSize })
      pipeline.push({ $limit: parseInt(req.query.pageSize) })
    }
  }

  console.log(pipeline)
  collection.aggregate(pipeline
    , {}, function (e, docs) {
      if (e != null) {
        res.json(e)
      } else {
        let result = {
          banksAccounts: docs,
          totalRecords: totalRecords
        }
        res.json(result)
      }
    })
});

// GET selection
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('bankaccounts');
  let totalRecords = 0
  let bankAccountPipeline = []
  let countPipeline = []
  let pipeline = []

  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
    console.log("sin query params")
  } else {

    let matchStage = {}
    let sortStage = {}
    let matchExists = false

    // match stage
    if ('find' in req.query) {
      matchStage.name = {
        $regex: req.query.find,
        $options: 'i'
      }
      matchExists = true
    }

    if ('enterpriseId' in req.query) {
      matchStage['enterpriseId'] = Number(req.query.enterpriseId)
      matchExists = true
    }

    // sort stage
    if ('pageSort' in req.query) {
      let field = req.query.pageSort
      let orderAsc = true
      if (req.query.pageSort.indexOf('-')) {
        orderAsc = false
      }
      field = field.replace('-', '')
      if (orderAsc) {
        sortStage[field] = -1
      } else {
        sortStage[field] = 1
      }
    }
    if (matchExists) {
      pipeline.push({ $match: matchStage })
    }
    pipeline.push({ $project: { "_id": 0, "id": 1, "name": 1, } })
    pipeline.push({ $sort: sortStage })


    // skip and limit stage
    if (('pageNumber' in req.query) && ('pageSize' in req.query)) {
      bankAccountPipeline = pipeline.slice()
      bankAccountPipeline.push({ $skip: (req.query.pageNumber - 1) * req.query.pageSize })
      bankAccountPipeline.push({ $limit: parseInt(req.query.pageSize) })
    }
  }

  countPipeline = pipeline.slice()
  countPipeline.push({ $count: 'count' })

  let pipeline2 = [
    {
      $facet: {
        bankAccounts: bankAccountPipeline,
        totalRecords: countPipeline
      }
    }
  ]

  console.log(pipeline2)
  collection.aggregate(pipeline2
    , {}, function (e, docs) {
      if (e != null) {
        res.json(e)
      } else {
        let result = {
          options: docs[0].bankAccounts,
          totalRecords: docs[0].totalRecords[0].count
        }
        res.json(result)
      }
    })
});

// GET bank account (id = id)
router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('bankaccounts');
  var docToFind = Number(req.params.id);
  /*collection.findOne({ 'id': docToFind }, {}, function (e, docs) {
    res.json(docs);
  });*/
  collection.aggregate([
    {
      $match: { 'id': docToFind }
    },
    {
      $lookup: {
        from: "enterprises",
        localField: "enterpriseId",
        foreignField: "enterpriseId",
        as: "enterprise"
      }
    },
    { $unwind: "$enterprise" },
    {
      $project: {
        "_id": 0,
        "id": 1,
        "name": 1,
        "number": 1,
        "enterprise.id": "$enterprise.enterpriseId",
        "enterprise.name": "$enterprise.enterpriseName",
        "ledgerAccount": 1
      }
    },
    { $unwind: "$enterprise" }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      docs[0].version = '1'
      let result = {
        bankAccount: docs[0]
      }
      res.json(result)
    }
  })
});

// POST add bank Account.
router.post('/add', function (req, res) {
  var db = req.db;
  var collection = db.get('bankaccounts');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

// DELETE del Bank Account (id = id)
router.delete('/del/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('bankaccounts');
  var docToDelete = Number(req.params.id);
  collection.remove({ 'id': docToDelete }, function (err) {
    res.send((err === null) ? { msg: 'La cuenta ha sido borrada con éxito' } : { msg: 'error: ' + err });
  });
});

// PUT updateAccount (id = id)
router.put('/update/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('bankaccounts');
  var docToUpdate = Number(req.params.id);
  collection.update({ 'id': docToUpdate }, req.body, function (err) {
    res.send((err === null) ? { msg: 'La cuenta ha sido modificada con éxito' } : { msg: 'error: ' + err });
  });
});

router.get('/reports/pdf', function (req, res) {
  res.download('./public/pdf.pdf')
});

// GET resetCollectionAccounts
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('bankaccounts');
  collection.remove({});
  collection.insert([
    {
      "id": 1,
      "name": "BANCO POPULAR",
      "number": "ES6621000418401234567891",
      "enterpriseId": 1,
      "ledgerAccount": "57200001"
    },
    {
      "id": 2,
      "name": "CAIXA BANK",
      "number": "ES6000491500051234567892",
      "enterpriseId": 1,
      "ledgerAccount": "57200005"
    },
    {
      "id": 3,
      "name": "LA CAIXA",
      "number": "ES9420805801101234567891",
      "enterpriseId": 2,
      "ledgerAccount": "57200002"
    },
    {
      "id": 4,
      "name": "BANCO PEPE",
      "number": "ES9000246912501234567891",
      "enterpriseId": 2,
      "ledgerAccount": "57200003"
    },
    {
      "id": 5,
      "name": "BANCO PACO",
      "number": "ES7100302053091234567895",
      "enterpriseId": 3,
      "ledgerAccount": "57200005"
    },
    {
      "id": 6,
      "name": "BANCO JUAN",
      "number": "ES1000492352082414205416",
      "enterpriseId": 3,
      "ledgerAccount": "57200003"
    },
    {
      "id": 7,
      "name": "BANCO MANOLO",
      "number": "ES1720852066623456789011",
      "enterpriseId": 4,
      "ledgerAccount": "57200001"
    },
    {
      "id": 8,
      "name": "BANCO BARTOLO",
      "number": "ES1720852066623456789011",
      "enterpriseId": 1,
      "ledgerAccount": "57200005"
    },
    {
      "id": 9,
      "name": "BANCO PEPI",
      "number": "ES1720852066623456789011",
      "enterpriseId": 3,
      "ledgerAccount": "57200002"
    },
    {
      "id": 10,
      "name": "BANCO MAMERTO",
      "number": "ES1720852066623456789011",
      "enterpriseId": 2,
      "ledgerAccount": "57200007"
    },
    {
      "id": 11,
      "name": "CAJA DE AHORROS PAULINO",
      "number": "ES1720852066623456789011",
      "enterpriseId": 4,
      "ledgerAccount": "57200001"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: bankaccounts collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
