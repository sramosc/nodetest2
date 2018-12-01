var express = require('express');
var router = express.Router();

// GET employeeGroups list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('employeeGroups');
  collection.find({}, '-_id', function (e, docs) {
    let result = {
      groups: docs,
      totalRecords: 12
    }
    res.json(result);
  });
});

// GET employeeGroups Modal list
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('employeeGroups');

  collection.aggregate([
    {
      $project: {
        "_id": 0,
        "id": "$id",
        "name": 1
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

// GET resetCollectionAccounts
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('employeeGroups');
  collection.remove({});
  collection.insert([
    {
      "id": 1,
      "name": "EMPLEADOS",
      "description": "GRUPO GENERICO DE EMPLEADOS"
    },
    {
      "id": 2,
      "name": "DIRECTORES_RRHH",
      "description": "DIRECTORES DE RECURSOS HUMANOS"
    },
    {
      "id": 3,
      "name": "TECNICOS_RRHH",
      "description": "TECNICOS DE RECURSOS HUMANOS"
    },
    {
      "id": 4,
      "name": "PREVENTAS",
      "description": "GRUPO GENERICO DE PREVENTAS"
    },
    {
      "id": 5,
      "name": "JEFES_PROYECTO",
      "description": "GRUPO GENERICO DE JEFES DE PROYECTO"
    },
    {
      "id": 6,
      "name": "FINANCIERO",
      "description": "GRUPO GENERICO DE FINANCIERO"
    },
    {
      "id": 7,
      "name": "ADMINISTRADORES",
      "description": "GRUPO GENERICO DE ADMINISTRADORES"
    },
    {
      "id": 8,
      "name": "DIRECTORES",
      "description": "GRUPO GENERICO DE DIRECTORES"
    },
    {
      "id": 9,
      "name": "GERENTES",
      "description": "GRUPO GENERICO DE GERENTES"
    },
    {
      "id": 10,
      "name": "DIRECTORES_GENERALES",
      "description": "GRUPO GENERICO DE DIRECTORES GENERALES"
    },
    {
      "id": 11,
      "name": "DIRECTORES_NEGOCIO",
      "description": "GRUPO GENERICO DE DIRECTORES DE NEGOCIO"
    },
    {
      "id": 12,
      "name": "SECRETARIAS",
      "description": "GRUPO GENERICO DE SECRETARIAS"
    },
    {
      "id": 13,
      "name": "TECNICOS_SISTEMAS",
      "description": "GRUPO GENERICO DE TECNICOS DE SISTEMAS"
    },
    {
      "id": 14,
      "name": "GERENTES_SISTEMAS",
      "description": "GRUPO GENERICO DE GERENTES DE SISTEMAS"
    },
    {
      "id": 15,
      "name": "JEFES_EQUIPO",
      "description": "GRUPO GENERICO DE JEFES DE EQUIPO"
    },
    {
      "id": 16,
      "name": "CONSEJEROS",
      "description": "GRUPO GENERICO DE CONSEJEROS"
    },

    {
      "id": 17,
      "name": "CONSEJERO_DELEGADO",
      "description": "CONSEJERO DELEGADO"
    },
    {
      "id": 18,
      "name": "FINANCIERO_ALTAS",
      "description": "FINANCIERO ALTAS"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: employeeGroups collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
