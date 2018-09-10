var express = require('express');
var router = express.Router();

// GET employeeGroups list
router.get('/listEmployeeGroups', function (req, res) {
  var db = req.db;
  var collection = db.get('employeeGroups');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET resetCollectionAccounts
router.get('/resetCollectionEmployeeGroups', function (req, res) {
  var db = req.db;
  var collection = db.get('employeeGroups');
  collection.remove({});
  collection.insert([
    {
      "employeeGroupId" : "1",
      "name" : "EMPLEADOS",
      "description": "GRUPO GENERICO DE EMPLEADOS"
    },
    {
      "employeeGroupId" : "2",
      "name" : "DIRECTORES_RRHH",
      "description": "DIRECTORES DE RECURSOS HUMANOS"
    },
    {
      "employeeGroupId" : "3",
      "name" : "TECNICOS_RRHH",
      "description": "TECNICOS DE RECURSOS HUMANOS"
    },
    {
      "employeeGroupId" : "4",
      "name" : "PREVENTAS",
      "description": "GRUPO GENERICO DE PREVENTAS"
    },
    {
      "employeeGroupId" : "5",
      "name" : "JEFES_PROYECTO",
      "description": "GRUPO GENERICO DE JEFES DE PROYECTO"
    },
    {
      "employeeGroupId" : "6",
      "name" : "FINANCIERO",
      "description": "GRUPO GENERICO DE FINANCIERO"
    },
    {
      "employeeGroupId" : "7",
      "name" : "ADMINISTRADORES",
      "description": "GRUPO GENERICO DE ADMINISTRADORES"
    },
    {
      "employeeGroupId" : "8",
      "name" : "DIRECTORES",
      "description": "GRUPO GENERICO DE DIRECTORES"
    },
    {
      "employeeGroupId" : "9",
      "name" : "GERENTES",
      "description": "GRUPO GENERICO DE GERENTES"
    },
    {
      "employeeGroupId" : "10",
      "name" : "DIRECTORES_GENERALES",
      "description": "GRUPO GENERICO DE DIRECTORES GENERALES"
    },
    {
      "employeeGroupId" : "11",
      "name" : "DIRECTORES_NEGOCIO",
      "description": "GRUPO GENERICO DE DIRECTORES DE NEGOCIO"
    },
    {
      "employeeGroupId" : "12",
      "name" : "SECRETARIAS",
      "description": "GRUPO GENERICO DE SECRETARIAS"
    },
    {
      "employeeGroupId" : "13",
      "name" : "TECNICOS_SISTEMAS",
      "description": "GRUPO GENERICO DE TECNICOS DE SISTEMAS"
    },
    {
      "employeeGroupId" : "14",
      "name" : "GERENTES_SISTEMAS",
      "description": "GRUPO GENERICO DE GERENTES DE SISTEMAS"
    },
    {
      "employeeGroupId" : "15",
      "name" : "JEFES_EQUIPO",
      "description": "GRUPO GENERICO DE JEFES DE EQUIPO"
    },
    {
      "employeeGroupId" : "16",
      "name" : "CONSEJEROS",
      "description": "GRUPO GENERICO DE CONSEJEROS"
    },

    {
      "employeeGroupId" : "17",
      "name" : "CONSEJERO_DELEGADO",
      "description": "CONSEJERO DELEGADO"
    },
    {
      "employeeGroupId" : "18",
      "name" : "FINANCIERO_ALTAS",
      "description": "FINANCIERO ALTAS"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
