var express = require('express');
var router = express.Router();

// GET activities list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  let totalRecords = 0

  collection.count({}).then((count) => {
    totalRecords = count
  })

  let pipeline = []

  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
    console.log('sin query params')
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
    if ('orgUnitId' in req.query) {
      matchStage['businessOrgUnitId'] = req.query.orgUnitId
      matchExists = true
    }

    if ('clientId' in req.query) {
      matchStage['clientId'] = req.query.clientId
      matchExists = true
    }

    if ('activitySubTypeId' in req.query) {
      matchStage['activitySubtypeId'] = req.query.activitySubTypeId
      matchExists = true
    }

    if ('status' in req.query) {
      matchStage['status'] = req.query.status
      matchExists = true
    }

    if ('registry' in req.query) {
      matchStage['registry'] = req.query.registry
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
  pipeline.push({ $project: { '_id': 0, 'id': 1, 'name': 1, 'code': 1, 'startedOn': 1 } })
  console.log(pipeline)
  collection.aggregate(pipeline
    , {}, function (e, docs) {
      if (e != null) {
        res.json(e)
      } else {
        let result = {
          activities: docs,
          totalRecords: totalRecords
        }
        res.json(result)
      }
    })

});

// GET activities selection
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');

  collection.aggregate([
    {
      $project: {
        '_id': 0,
        'id': 1,
        'name': 1
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

// GET activities list
router.get('/get/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  var docToFind = req.params.id;

  collection.aggregate([
    {
      $match: { 'id': Number(docToFind) }
    },

    {
      $lookup: {
        from: 'companies',
        localField: 'invoiceCompanyId',
        foreignField: 'companyId',
        as: 'invoiceCompany'
      }
    },
    { $unwind: '$invoiceCompany' },
    {
      $lookup: {
        from: 'companies',
        localField: 'anCompanyId',
        foreignField: 'companyId',
        as: 'anCompany'
      }
    },
    { $unwind: '$anCompany' },
    {
      $lookup: {
        from: 'clients',
        localField: 'clientId',
        foreignField: 'clientId',
        as: 'customer'
      }
    },
    { $unwind: '$customer' },
    {
      $lookup: {
        from: 'activityLines',
        localField: 'activityLineId',
        foreignField: 'activityLineId',
        as: 'activityLine'
      }
    },
    { $unwind: '$activityLine' },
    {
      $lookup: {
        from: 'activitySubtypes',
        localField: 'activitySubtypeId',
        foreignField: 'activitySubtypeId',
        as: 'activitySubtype'
      }
    },
    { $unwind: '$activitySubtype' },
    {
      $lookup: {
        from: 'orgsUnits',
        localField: 'commertialOrgUnitId',
        foreignField: 'id',
        as: 'commertialOrgUnit'
      }
    },
    { $unwind: '$commertialOrgUnit' },
    {
      $lookup: {
        from: 'orgsUnits',
        localField: 'businessOrgUnitId',
        foreignField: 'id',
        as: 'businessOrgUnit'
      }
    },
    { $unwind: '$businessOrgUnit' },
    {
      $lookup: {
        from: 'activityExpensesPermissionTypes',
        localField: 'expensesPermissionId',
        foreignField: 'activityExpensesPermissionTypeId',
        as: 'activityExpensePermissionType'
      }
    },
    { $unwind: '$activityExpensePermissionType' },
    {
      $lookup: {
        from: 'activityInvoicingTypes',
        localField: 'invoicingTypeId',
        foreignField: 'activityInvoicingTypeId',
        as: 'activityInvoicingType'
      }
    },
    { $unwind: '$activityInvoicingType' },
    {
      $lookup: {
        from: 'activityIncomeTypes',
        localField: 'incomeTypeId',
        foreignField: 'activityIncomeTypeId',
        as: 'activityIncomeType'
      }
    },
    { $unwind: '$activityIncomeType' },
    {
      $addFields: {
        version: 1 ,        
      }
    },
    {
      $project: {
        '_id': 0,
        'id': 1,
        'version':1,
        'status': 1,
        'registry': 1,
        // CAMPOS DE CABECERA
        // nombre
        'headerData.name':'$name',                        
        // codigo
        'headerData.code':'$code', 
        // contratado
        'headerData.amountContracted': '$budget',
        // horas efectivas incurridas
        'headerData.efectiveHours': '$efectiveHours',
        // costes
        'headerData.costs': '$expenses',
        // produccion
        'headerData.production': '$production',
        // margen
        'headerData.margin': '$margin',
        // facturado
        'headerData.invoiced': '$invoiced',
        // Obra en curso inicial
        'headerData.initialCurrentWork': '$initialCurrentWork',
        // Obra en curso
        'headerData.currentWork': '$currentWork',
        // Pendiente sobre contratación
        'headerData.pendingOverContracted': '$pending',
        // Año sobre el que se emiten los datos
        'headerData.cumulativeDatayear': '$cumulativeDataYear',
        //---------------------------------------------------------
        // CAMPOS DE DATOS GENERALES
        // Linea de actividad
        'generalData.activityLine.id': '$activityLine.activityLineId',
        'generalData.activityLine.name': '$activityLine.name',
        // Subtipo de actividad
        'generalData.activitySubtype.id': '$activitySubtype.activitySubtypeId',
        'generalData.activitySubtype.name': '$activitySubtype.name',
        // Unidad Operativa de negocio
        'generalData.businessOrgUnit.id': '$businessOrgUnit.id',
        'generalData.businessOrgUnit.name': '$businessOrgUnit.name',
        'generalData.businessOrgUnit.erpId': '$businessOrgUnit.erpId',
        // Unidad Operativa de comercio
        'generalData.commertialOrgUnit.id': '$commertialOrgUnit.id',
        'generalData.commertialOrgUnit.name': '$commertialOrgUnit.name',
        'generalData.commertialOrgUnit.erpId': '$commertialOrgUnit.erpId',
        // Cliente
        'generalData.customer.id': '$customer.clientId',
        'generalData.customer.name': '$customer.clientName',
        // Tipo de facturación
        'generalData.activityInvoicingType.id': '$activityInvoicingType.activityInvoicingTypeId',
        'generalData.activityInvoicingType.name': '$activityInvoicingType.name',
        // Tipo de ingreso
        'generalData.activityIncomeType.id': '$activityIncomeType.activityIncomeTypeId',
        'generalData.activityIncomeType.name': '$activityIncomeType.name',
        // Empresa de facturación
        'generalData.invoiceEnterprise.id': '$invoiceCompany.companyId',
        'generalData.invoiceEnterprise.name': '$invoiceCompany.companyName',
        // Empresa analítica
        'generalData.analyticalEnterprise.id': '$anCompany.companyId',
        'generalData.analyticalEnterprise.name': '$anCompany.companyName',
        // Permitir cargar gastos
        'generalData.activityExpensePermissionType.id': '$activityExpensePermissionType.activityExpensesPermissionTypeId',
        'generalData.activityExpensePermissionType.name': '$activityExpensePermissionType.name',
        // Fecha de inicio
        'generalData.startedOn': '$startedOn',
        // Fecha de fin
        'generalData.finishedOn': '$finishedOn',
        // Horas previstas
        'generalData.plannedHours': '$plannedHours',
        // M.B. Venta
        'generalData.grossSalesMargin':'$mBSale',
        // M.B. Fin
        'generalData.grossFinancialMargin':'$mBFinan',
        // Coste finan. planif.
        'generalData.financialCost':'$finanCost',
        // Coste previsto
        'generalData.plannedCost':'$plannedCost',
        // Dobre booking
        'generalData.doubleBooking': '$doubleBooking',
        // Factor de horas nocturnas
        'generalData.nightHourFactor': '$nightHourFactor',
        // Factor de horas festivas
        'generalData.holidayHourFactor': '$holidayHourFactor',
        // Factor de horas de guardia
        'generalData.watchHourFactor': '$watchHourFactor',
        // Factor de horas nocturno-festivas
        'generalData.nightHolidayHourFactor': '$nightHolidayHourFactor',
        // Factor de guardia en festivo
        'generalData.watchHolidayHourFactor': '$watchHolidayHourFactor',
        // Factor de actuación en guardia
        'generalData.interventionInWatchHourFactor': '$interventionInWatchHourFactor',
        // Factor de actuación em guardia festova
        'generalData.interventionInHolidayWatchHourFactor': '$interventionInHolidayWatchHourFactor',
        // Factor de hora controlada
        'generalData.extraHourFactor': '$extraHourFactor',
        // Visible
        'generalData.visible':'$visible',
        //---------------------------------------------------------
        // CAMPOS DE DATOS DE EQUIPO
        'teamData.participationsData': '$team',
        'teamData.showEffectiveHours' : '$showEffectiveHours',
        //---------------------------------------------------------
        // CAMPOS DE DATOS DE DESCRIPCION
        'descriptionData.description':'$description',
        //---------------------------------------------------------
        // CAMPOS DE DATOS OBSERVACIONES
        'observationsData.observations':'$observations',
        //---------------------------------------------------------
        // CAMPOS DE DATOS DE I+D+i
        'rdisData':'$rdi',
        //--------------------------------------------------------- 

      }
    }
  ], {}, function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      let result = {
        activity: docs[0]
      }
      res.json(result)
    }
  })
});

// DELETE del ACTIVITIES (id = id)
router.delete('/del/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  var docToDelete = Number(req.params.id);
  collection.remove({ 'id': docToDelete }, function (err) {
    res.send((err === null) ? { msg: 'La actividad ha sido borrada con éxito' } : { msg: 'error: ' + err });
  });
});

// PUT updateActivity (id = id)
router.put('/update/:id', function (req, res) {
  res.send({ msg: 'La actividad ha sido modificada con éxito - MOCK' })  
});

// List employees by activity
// devuelve el listado de los empleados que hayan estado vinculados a una actividad determinada
router.get('/listEmployeesInActivity/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  var docToFind = req.params.id;
  collection.find({ 'id': docToFind }, { 'team.employeeId': 1 }, function (e, docs) {
    res.json(docs);
  });
});

// List employees by orgsUnits
// devuelve el listado de los empleados que hayan estado vinculados a una unidad organizativa determinada y hayan realizado actividades en ella
router.get('/listEmployeesInOrgUnit/:orgUnitId', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  var docToFind = req.params.orgUnitId;
  collection.find({ 'orgUnit': docToFind }, { 'team.employeeId': 1 }, function (e, docs) {
    res.json(docs);
  });
});

// List employees activities by year

// GET reset Collection Activities
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  collection.remove({});
  collection.insert([
    {
      id: 1,
      name: 'FORMACION \'GPG\'',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing, ' +
        'elit lectus convallis class maecenas tempor cum, eros magna tincidunt nullam tempus. ' +
        'Parturient euismod ligula eros velit lobortis, ',
      observations: 'Lorem ipsum dolor sit amet consectetur adipiscing, ' +
        'elit lectus convallis class maecenas tempor cum, eros magna tincidunt nullam tempus. ' +
        'Parturient euismod ligula eros velit lobortis, ',
      code: 'NF0001',
      budget: 747692,
      efectiveHours: 1120,
      expenses: 0,
      production: 48146.84,
      margin: 5.6,
      invoiced: 34325.86,
      initialCurrentWork: 0,
      currentWork: 13820.98,
      pending: 713366.14,
      invoiceCompanyId: 1,
      anCompanyId: 1,
      clientId: 1,
      plannedHours: 0,
      finanCost: 0,
      plannedCost: 0,
      mBSale: 2455,
      mBFinan: 3.8,
      cumulativeDataYear: 2018,
      visible:true,
      startedOn: '2010-01-01',
      finishedOn: '2020-12-31',
      activityLineId: 11,
      activitySubtypeId: 9,
      commertialOrgUnitId: 1,
      businessOrgUnitId: 1,
      expensesPermissionId: 1,
      invoicingTypeId: 2,
      incomeTypeId: 1,
      doubleBooking: true,
      registry: 'ACTIVE',
      status: 'OPEN',
      nightHourFactor: 1,
      holidayHourFactor: 1,
      watchHourFactor: 1,
      nightHolidayHourFactor: 1,
      watchHolidayHourFactor: 1,
      interventionInWatchHourFactor: 1,
      interventionInHolidayWatchHourFactor: 1,
      extraHourFactor: 1,
      showEffectiveHours: true,
      historicalCommertialorgsUnits: [
        {
          startedOn: '2008-05-28',
          orgUnitId: 1
        }
      ],
      historicalBusinessorgsUnits: [
        {
          startedOn: '2008-05-28',
          orgUnitId: 1
        }
      ],
      rdi: [
        {
          id: 1,
          startedOn: '2008-05-28',
          finishedOn: '2008-06-01',
          reason: 'razon razon razon razon razon'
        },
        {
          id: 2,
          startedOn: '2008-05-28',
          reason: 'razonrazonrazonrazonrazon'
        }
      ],
      team: [
        {
          id: 1,
          participant: {
            id: 1,
            name: 'EMPLEADOS',
            group: true
          },
          role: {
            id: 1,
            name: 'TECNICO'
          },
          startedOn: '2008-06-28',
          hoursPermitted: {
            nightHour: false,
            holidayHour: false,
            nightHolidayHour: false,
            watchHour: false,
            watchHolidayHour: false,
            interventionInWatchHour: false,
            interventionInHolidayWatchHour: false,
            extraHour: false
          }
        },
        {
          id: 2,
          participant: {
            id: 1,
            name: 'Jose Carlos Fernandez',
            group: false
          },
          role: {
            id: 1,
            name: 'TECNICO'
          },
          startedOn: '2010-04-26',
          finishedOn: '2018-12-31',
          hoursPermitted: {
            nightHour: true,
            holidayHour: true,
            nightHolidayHour: true,
            watchHour: true,
            watchHolidayHour: false,
            interventionInWatchHour: false,
            interventionInHolidayWatchHour: false,
            extraHour: false
          }
        },
        {
          id: 3,
          participant: {
            id: 2,
            name: 'Manuel Pérez Vena',
            group: false
          },
          role: {
            id: 2,
            name: 'JEFE PROYECTO'
          },
          startedOn: '2010-04-27',
          finishedOn: '2018-12-31',
          hoursPermitted: {
            nightHour: true,
            holidayHour: true,
            nightHolidayHour: true,
            watchHour: true,
            watchHolidayHour: false,
            interventionInWatchHour: true,
            interventionInHolidayWatchHour: false,
            extraHour: true
          }
        },
        {
          id: 4,
          participant: {
            id: 3,
            name: 'Maria Jesús Corrillo',
            group: false
          },
          role: {
            id: 3,
            name: 'D. NEGOCIO'
          },
          startedOn: '2011-01-24',
          finishedOn: '2018-12-31',
          hoursPermitted: {
            nightHour: true,
            holidayHour: false,
            nightHolidayHour: false,
            watchHour: true,
            watchHolidayHour: false,
            interventionInWatchHour: true,
            interventionInHolidayWatchHour: false,
            extraHour: true
          }
        }
      ]
    },
    {
      'id': 2,
      'budget': '747.692,00',
      'efectiveHours': '1.120,00',
      'expenses': '0,00',
      'production': '48.146,84',
      'margin': '100%',
      'invoiced': '34.325,86',
      'initialCurrentWork': '0,00',
      'currentWork': '13.820,98',
      'pending': '713.366,14',
      'cumulativeDatayear': '2018',
      'invoiceCompanyId': 1,
      'anCompanyId': 1,
      'clientId': 1,
      'plannedHours': '0,00',
      'finanCost': '0,00',
      'plannedCost': '0,00',
      'mBSale': '2.455,00',
      'mBFinan': '0,00%',
      'startedOn': '2012-09-06',
      'activityLineId': 11,
      'activitySubtypeId': 24,
      'commertialOrgUnitId': 1,
      'businessOrgUnitId': 1,
      'expensesPermissionId': 1,
      'invoicingTypeId': 2,
      'incomeTypeId': 1,
      'doubleBooking': 'false',
      'registry': 'ACTIVE',
      'status': 'OPEN',
      'nightHourFactor': '1',
      'holidayHourFactor': '1',
      'watchHourFactor': '1',
      'nightHolidayHourFactor': '1',
      'watchHolidayHourFactor': '1',
      'interventionInWatchHourFactor': '1',
      'interventionInHolidayWatchHourFactor': '1',
      'extraHourFactor': '1',
      'historicalCommertialorgsUnits': [
        {
          'startedOn': '2008-05-28',
          'orgUnitId': 1
        }
      ],
      'historicalBusinessorgsUnits': [
        {
          'startedOn': '2008-05-28',
          'orgUnitId': 1
        }
      ],
      'name': 'AUSENCIA NO JUSTIFICADA',
      'code': 'NF0002',
      'team': [
        {
          'groupId': 'EMPLEADOS',
          'roleId': 1,
          'startedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        }
      ]
    },
    {
      'id': 3,
      'budget': '747.692,00',
      'efectiveHours': '1.120,00',
      'expenses': '0,00',
      'production': '48.146,84',
      'margin': '100%',
      'invoiced': '34.325,86',
      'initialCurrentWork': '0,00',
      'currentWork': '13.820,98',
      'pending': '713.366,14',
      'cumulativeDatayear': '2018',
      'invoiceCompanyId': 1,
      'anCompanyId': 1,
      'clientId': 1,
      'plannedHours': '0,00',
      'finanCost': '0,00',
      'plannedCost': '0,00',
      'mBSale': '2.455,00',
      'mBFinan': '0,00%',
      'startedOn': '2012-09-04',
      'activityLineId': 11,
      'activitySubtypeId': 24,
      'commertialOrgUnitId': 1,
      'businessOrgUnitId': 1,
      'expensesPermissionId': 1,
      'invoicingTypeId': 2,
      'incomeTypeId': 2,
      'doubleBooking': 'false',
      'registry': 'ACTIVE',
      'status': 'OPEN',
      'nightHourFactor': '1',
      'holidayHourFactor': '1',
      'watchHourFactor': '1',
      'nightHolidayHourFactor': '1',
      'watchHolidayHourFactor': '1',
      'interventionInWatchHourFactor': '1',
      'interventionInHolidayWatchHourFactor': '1',
      'extraHourFactor': '1',
      'historicalCommertialorgsUnits': [
        {
          'startedOn': '2008-05-28',
          'orgUnitId': 1
        }
      ],
      'historicalBusinessorgsUnits': [
        {
          'startedOn': '2008-05-28',
          'orgUnitId': 1
        }
      ],
      'name': 'AUSENCIA JUSTIFICADA',
      'code': 'NF0003',
      'team': [
        {
          'groupId': 'EMPLEADOS',
          'roleId': 1,
          'startedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        }
      ]
    },
    {
      'id': 4,
      'budget': '747.692,00',
      'efectiveHours': '1.120,00',
      'expenses': '0,00',
      'production': '48.146,84',
      'margin': '100%',
      'invoiced': '34.325,86',
      'initialCurrentWork': '0,00',
      'currentWork': '13.820,98',
      'pending': '713.366,14',
      'cumulativeDatayear': '2018',
      'invoiceCompanyId': 1,
      'anCompanyId': 1,
      'clientId': 1,
      'plannedHours': '0,00',
      'finanCost': '0,00',
      'plannedCost': '0,00',
      'mBSale': '2.455,00',
      'mBFinan': '0,00%',
      'startedOn': '2006-04-01',
      'finishedOn': '2008-12-12',
      'activityLineId': 1,
      'activitySubtypeId': 25,
      'commertialOrgUnitId': 2,
      'businessOrgUnitId': 3,
      'expensesPermissionId': 3,
      'invoicingTypeId': 2,
      'incomeTypeId': 1,
      'doubleBooking': 'false',
      'status': 'CLOSED',
      'registry': 'ACTIVE',
      'nightHourFactor': '1',
      'holidayHourFactor': '1',
      'watchHourFactor': '1',
      'nightHolidayHourFactor': '1',
      'watchHolidayHourFactor': '1',
      'interventionInWatchHourFactor': '1',
      'interventionInHolidayWatchHourFactor': '1',
      'extraHourFactor': '1',
      'historicalCommertialorgsUnits': [
        {
          'startedOn': '2008-06-28',
          'orgUnitId': 2
        }
      ],
      'historicalBusinessorgsUnits': [
        {
          'startedOn': '2008-06-28',
          'orgUnitId': 3
        }
      ],
      'name': 'POSTVENTA DE DIVERSOS',
      'code': '125001',
      'team': [
        {
          'employeeId': 4,
          'roleId': 1,
          'startedOn': '2008-06-28',
          'finishedOn': '2008-12-12',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type4': 'false',
            'type8': 'false'
          }
        },
        {
          'employeeId': 5,
          'roleId': 2,
          'startedOn': '2008-10-09',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type4': 'false',
            'type8': 'false'
          }
        },
        {
          'employeeId': 6,
          'roleId': 1,
          'startedOn': '2008-11-04',
          'finishedOn': '2008-12-12',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type4': 'false',
            'type8': 'false'
          }
        },
        {
          'employeeId': 2,
          'roleId': 3,
          'startedOn': '2008-11-26',
          'finishedOn': '2008-12-12',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type4': 'false',
            'type8': 'false'
          }
        }
      ]
    },
    {
      'id': 5,
      'budget': '747.692,00',
      'efectiveHours': '1.120,00',
      'expenses': '0,00',
      'production': '48.146,84',
      'margin': '100%',
      'invoiced': '34.325,86',
      'initialCurrentWork': '0,00',
      'currentWork': '13.820,98',
      'pending': '713.366,14',
      'cumulativeDatayear': '2018',
      'invoiceCompanyId': 1,
      'anCompanyId': 1,
      'clientId': 1,
      'plannedHours': '0,00',
      'finanCost': '0,00',
      'plannedCost': '0,00',
      'mBSale': '2.455,00',
      'mBFinan': '0,00%',
      'startedOn': '2005-11-24',
      'activityLineId': 1,
      'activitySubtypeId': 5,
      'commertialOrgUnitId': 1,
      'businessOrgUnitId': 1,
      'expensesPermissionId': 3,
      'invoicingTypeId': 2,
      'incomeTypeId': 3,
      'doubleBooking': 'false',
      'registry': 'ACTIVE',
      'status': 'OPEN',
      'nightHourFactor': '1',
      'holidayHourFactor': '1',
      'watchHourFactor': '1',
      'nightHolidayHourFactor': '1',
      'watchHolidayHourFactor': '1',
      'interventionInWatchHourFactor': '1',
      'interventionInHolidayWatchHourFactor': '1',
      'extraHourFactor': '1',
      'historicalCommertialorgsUnits': [
        {
          'startedOn': '2008-06-28',
          'orgUnitId': 1
        }
      ],
      'historicalBusinessorgsUnits': [
        {
          'startedOn': '2008-06-28',
          'orgUnitId': 1
        }
      ],
      'name': 'INTRANET NUEVA',
      'code': 'PI0006',
      'team': [
        {
          'employeeId': 6,
          'roleId': 1,
          'startedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        },
        {
          'employeeId': 7,
          'roleId': 1,
          'startedOn': '2008-06-28',
          'finishedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        },
        {
          'employeeId': 8,
          'roleId': 1,
          'startedOn': '2008-06-28',
          'finishedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        },
        {
          'employeeId': 9,
          'roleId': 1,
          'startedOn': '2008-06-28',
          'finishedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        },
        {
          'employeeId': 10,
          'roleId': 1,
          'startedOn': '2008-06-28',
          'finishedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        },
        {
          'employeeId': 11,
          'roleId': 1,
          'startedOn': '2008-03-03',
          'finishedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        },
        {
          'employeeId': 12,
          'roleId': 1,
          'startedOn': '2008-06-28',
          'finishedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        },
        {
          'employeeId': 13,
          'roleId': 1,
          'startedOn': '2008-10-08',
          'finishedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        },
        {
          'employeeId': 14,
          'roleId': 1,
          'startedOn': '2008-10-15',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        }
      ]
    },
    {
      'id': 6,
      'budget': '747.692,00',
      'efectiveHours': '1.120,00',
      'expenses': '0,00',
      'production': '48.146,84',
      'margin': '100%',
      'invoiced': '34.325,86',
      'initialCurrentWork': '0,00',
      'currentWork': '13.820,98',
      'pending': '713.366,14',
      'cumulativeDatayear': '2018',
      'invoiceCompanyId': 1,
      'anCompanyId': 1,
      'clientId': 1,
      'plannedHours': '0,00',
      'finanCost': '0,00',
      'plannedCost': '0,00',
      'mBSale': '2.455,00',
      'mBFinan': '0,00%',
      'startedOn': '2010-01-01',
      'activityLineId': 11,
      'activitySubtypeId': 12,
      'commertialOrgUnitId': 4,
      'businessOrgUnitId': 4,
      'expensesPermissionId': 1,
      'invoicingTypeId': 2,
      'incomeTypeId': 1,
      'doubleBooking': 'false',
      'registry': 'ACTIVE',
      'status': 'OPEN',
      'nightHourFactor': '1',
      'holidayHourFactor': '1',
      'watchHourFactor': '1',
      'nightHolidayHourFactor': '1',
      'watchHolidayHourFactor': '1',
      'interventionInWatchHourFactor': '1',
      'interventionInHolidayWatchHourFactor': '1',
      'extraHourFactor': '1',
      'historicalCommertialorgsUnits': [
        {
          'startedOn': '2008-05-28',
          'orgUnitId': 4
        }
      ],
      'historicalBusinessorgsUnits': [
        {
          'startedOn': '2008-05-28',
          'orgUnitId': 4
        }
      ],
      'name': 'GESTION / ESTRUCTURA',
      'code': 'NF0004',
      'team': [
        {
          'groupId': 'EMPLEADOS',
          'roleId': 1,
          'startedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        },
        {
          'employeeId': 15,
          'roleId': 1,
          'startedOn': '2010-03-29',
          'finishedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        },
        {
          'employeeId': 16,
          'roleId': 1,
          'startedOn': '2011-09-19',
          'finishedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        },
        {
          'employeeId': 17,
          'roleId': 1,
          'startedOn': '2011-09-19',
          'finishedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        }
      ]
    },
    {
      'id': 7,
      'budget': '747.692,00',
      'efectiveHours': '1.120,00',
      'expenses': '0,00',
      'production': '48.146,84',
      'margin': '100%',
      'invoiced': '34.325,86',
      'initialCurrentWork': '0,00',
      'currentWork': '13.820,98',
      'pending': '713.366,14',
      'cumulativeDatayear': '2018',
      'invoiceCompanyId': 1,
      'anCompanyId': 1,
      'clientId': 1,
      'plannedHours': '0,00',
      'finanCost': '0,00',
      'plannedCost': '0,00',
      'mBSale': '2.455,00',
      'mBFinan': '0,00%',
      'startedOn': '2008-06-28',
      'activityLineId': 1,
      'activitySubtypeId': 24,
      'commertialOrgUnitId': 2,
      'businessOrgUnitId': 2,
      'expensesPermissionId': 1,
      'invoicingTypeId': 2,
      'incomeTypeId': 1,
      'doubleBooking': 'false',
      'registry': 'DELETED',
      'status': 'OPEN',
      'nightHourFactor': '1',
      'holidayHourFactor': '1',
      'watchHourFactor': '1',
      'nightHolidayHourFactor': '1',
      'watchHolidayHourFactor': '1',
      'interventionInWatchHourFactor': '1',
      'interventionInHolidayWatchHourFactor': '1',
      'extraHourFactor': '1',
      'historicalCommertialorgsUnits': [
        {
          'startedOn': '2008-05-28',
          'orgUnitId': 2
        }
      ],
      'historicalBusinessorgsUnits': [
        {
          'startedOn': '2008-05-28',
          'orgUnitId': 2
        }
      ],
      'name': 'VACACIONES',
      'code': 'NF0005',
      'team': [
        {
          'groupId': 'EMPLEADOS',
          'roleId': 1,
          'startedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        }
      ]
    },
    {
      'id': 8,
      'budget': '747.692,00',
      'efectiveHours': '1.120,00',
      'expenses': '0,00',
      'production': '48.146,84',
      'margin': '100%',
      'invoiced': '34.325,86',
      'initialCurrentWork': '0,00',
      'currentWork': '13.820,98',
      'pending': '713.366,14',
      'cumulativeDatayear': '2018',
      'invoiceCompanyId': 1,
      'anCompanyId': 1,
      'clientId': 1,
      'plannedHours': '0,00',
      'finanCost': '0,00',
      'plannedCost': '0,00',
      'mBSale': '2.455,00',
      'mBFinan': '0,00%',
      'startedOn': '2008-06-28',
      'activityLineId': 1,
      'activitySubtypeId': 12,
      'commertialOrgUnitId': 2,
      'businessOrgUnitId': 2,
      'expensesPermissionId': 1,
      'invoicingTypeId': 2,
      'incomeTypeId': 1,
      'doubleBooking': 'false',
      'registry': 'ACTIVE',
      'status': 'OPEN',
      'nightHourFactor': '1',
      'holidayHourFactor': '1',
      'watchHourFactor': '1',
      'nightHolidayHourFactor': '1',
      'watchHolidayHourFactor': '1',
      'interventionInWatchHourFactor': '1',
      'interventionInHolidayWatchHourFactor': '1',
      'extraHourFactor': '1',
      'historicalCommertialorgsUnits': [
        {
          'startedOn': '2008-05-28',
          'orgUnitId': 2
        }
      ],
      'historicalBusinessorgsUnits': [
        {
          'startedOn': '2008-05-28',
          'orgUnitId': 2
        }
      ],
      'name': 'REUNIONES INTERNAS',
      'code': 'NF0006',
      'team': [
        {
          'groupId': 'EMPLEADOS',
          'roleId': 1,
          'startedOn': '2008-06-28',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        }
      ]
    },
    {
      'id': 9,
      'budget': '747.692,00',
      'efectiveHours': '1.120,00',
      'expenses': '0,00',
      'production': '48.146,84',
      'margin': '100%',
      'invoiced': '34.325,86',
      'initialCurrentWork': '0,00',
      'currentWork': '13.820,98',
      'pending': '713.366,14',
      'cumulativeDatayear': '2018',
      'invoiceCompanyId': 1,
      'anCompanyId': 1,
      'clientId': 1,
      'plannedHours': '0,00',
      'finanCost': '0,00',
      'plannedCost': '0,00',
      'mBSale': '2.455,00',
      'mBFinan': '0,00%',
      'startedOn': '2008-06-28',
      'activityLineId': 1,
      'activitySubtypeId': 24,
      'commertialOrgUnitId': 2,
      'businessOrgUnitId': 2,
      'expensesPermissionId': 1,
      'invoicingTypeId': 2,
      'incomeTypeId': 1,
      'doubleBooking': 'false',
      'registry': 'ACTIVE',
      'status': 'CLOSED',
      'nightHourFactor': '1',
      'holidayHourFactor': '1',
      'watchHourFactor': '1',
      'nightHolidayHourFactor': '1',
      'watchHolidayHourFactor': '1',
      'interventionInWatchHourFactor': '1',
      'interventionInHolidayWatchHourFactor': '1',
      'extraHourFactor': '1',
      'historicalCommertialorgsUnits': [
        {
          'startedOn': '2008-05-28',
          'orgUnitId': 2
        }
      ],
      'historicalBusinessorgsUnits': [
        {
          'startedOn': '2008-05-28',
          'orgUnitId': 2
        }
      ],
      'name': 'VACACIONES DEL AÑO ANTERIOR',
      'code': 'NF0008',
      'team': [
        {
          'groupId': 'EMPLEADOS',
          'roleId': 1,
          'startedOn': '2009-03-13',
          'hours': {
            'type1': 'false',
            'type2': 'false',
            'type3': 'false',
            'type4': 'false',
            'type5': 'false',
            'type6': 'false',
            'type7': 'false',
            'type8': 'false'
          }
        }
      ]
    },
    {
      'id': 10,
      'budget': '747.692,00',
      'efectiveHours': '1.120,00',
      'expenses': '0,00',
      'production': '48.146,84',
      'margin': '100%',
      'invoiced': '34.325,86',
      'initialCurrentWork': '0,00',
      'currentWork': '13.820,98',
      'pending': '713.366,14',
      'cumulativeDatayear': '2018',
      'invoiceCompanyId': 1,
      'anCompanyId': 1,
      'clientId': 1,
      'plannedHours': '0,00',
      'finanCost': '0,00',
      'plannedCost': '0,00',
      'mBSale': '2.455,00',
      'mBFinan': '0,00%',
      'startedOn': '2006-05-01',
      'activityLineId': 1,
      'activitySubtypeId': 25,
      'commertialOrgUnitId': 1,
      'businessOrgUnitId': 1,
      'expensesPermissionId': 3,
      'invoicingTypeId': 2,
      'incomeTypeId': 1,
      'doubleBooking': 'false',
      'registry': 'ACTIVE',
      'status': 'OPEN',
      'nightHourFactor': '1',
      'holidayHourFactor': '1',
      'watchHourFactor': '1',
      'nightHolidayHourFactor': '1',
      'watchHolidayHourFactor': '1',
      'interventionInWatchHourFactor': '1',
      'interventionInHolidayWatchHourFactor': '1',
      'extraHourFactor': '1',
      'historicalCommertialorgsUnits': [
        {
          'startedOn': '2008-06-28',
          'orgUnitId': 1
        }
      ],
      'historicalBusinessorgsUnits': [
        {
          'startedOn': '2008-06-28',
          'orgUnitId': 1
        }
      ],
      'name': 'IMPLANTACIÓN ISO 9000',
      'code': '105003',
      'team': []
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: activities collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
