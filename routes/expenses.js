var express = require('express');
var router = express.Router();

// LIST EXPENSES SHEETS
router.get('/list', function (req, res) {
    var db = req.db;
    var collection = db.get('expenses');

    let pipeline = [


        {
            $lookup: {
                from: "employees",
                localField: "employeeId",
                foreignField: "id",
                as: "employee"
            }
        },
        {
            $unwind: "$employee"
        },
        {
            $lookup: {
                from: "employees",
                localField: "managerId",
                foreignField: "id",
                as: "manager"
            }
        },
        {
            $unwind: "$manager"
        },
        {
            $lookup: {
                from: "enterprises",
                localField: "enterpriseId",
                foreignField: "id",
                as: "enterprise"
            }
        },
        {
            $unwind: "$enterprise"
        },
        {
            $lookup: {
                from: "activities",
                localField: "activityId",
                foreignField: "id",
                as: "activity"
            }
        },
        {
            $unwind: "$activity"
        },
        {
            $lookup: {
                from: "sepaStatus",
                localField: "statusId",
                foreignField: "id",
                as: "status"
            }
        },
        {
            $unwind: "$status"
        },
        {
            $project: {
                "_id": 0,
                "id": 1,
                "employee.id": "$employee.id",
                "employee.name": "$employee.name",
                "employee.code": "$employee.code",
                "manager.id": "$manager.id",
                "manager.name": "$manager.name",
                "manager.code": "$manager.code",
                "status.id": "$status.id",
                "status.name": "$status.name",
                "enterprise.id": "$enterprise.id",
                "enterprise.name": "$enterprise.name",
                "activity.id": "$activity.id",
                "activity.name": "$activity.name",
                "amount": 1,
                "concept": 1,
                "expenditureSheetId": 1,
                "datedOn": 1
            }
        }]

    if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
        console.log("sin query params")
    } else {

        let matchStage = {}
        let matchExists = false

        // match stage
        if ('employeeId' in req.query) {
            matchStage['employee.id'] = Number(req.query.employeeId)
            matchExists = true
        }

        if ('managerId' in req.query) {
            matchStage['manager.id'] = Number(req.query.managerId)
            matchExists = true
        }

        if ('enterpriseId' in req.query) {
            matchStage['enterprise.id'] = Number(req.query.enterpriseId)
            matchExists = true
        }

        if ('activityId' in req.query) {
            matchStage['activity.id'] = Number(req.query.activityId)
            matchExists = true
        }

        collection.find(matchStage, '-_id', function (e, docs) {
            totalRecords = docs.length
        })


        pipeline.push({ $match: matchStage })
    }

    console.log(pipeline)
    collection.aggregate(pipeline
        , {}, function (e, docs) {
            if (e != null) {
                res.json(e)
            } else {
                let result = {
                    expenses: docs,
                }
                res.json(result)
            }
        })
});

// GET expense
router.get('/get/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('expenses');
    var docToFind = Number(req.params.id);
    collection.aggregate([
        {
            $match: { 'id': docToFind }
        },
        {
            $lookup: {
                from: "employees",
                localField: "employeeId",
                foreignField: "id",
                as: "employee"
            }
        },
        {
            $unwind: "$employee"
        },
        {
            $lookup: {
                from: "employees",
                localField: "managerId",
                foreignField: "id",
                as: "manager"
            }
        },
        {
            $unwind: "$manager"
        },
        {
            $lookup: {
                from: "enterprises",
                localField: "enterpriseId",
                foreignField: "id",
                as: "enterprise"
            }
        },
        {
            $unwind: "$enterprise"
        },
        {
            $lookup: {
                from: "activities",
                localField: "activityId",
                foreignField: "id",
                as: "activity"
            }
        },
        {
            $unwind: "$activity"
        },
        {
            $lookup: {
                from: "sepaStatus",
                localField: "statusId",
                foreignField: "id",
                as: "status"
            }
        },
        {
            $unwind: "$status"
        },
        {
            $lookup: {
                from: "costTravelAllowanceTypes",
                localField: "costTravelAllowanceTypeId",
                foreignField: "id",
                as: "costTravelAllowanceType"
            }
        },
        {
            $unwind: "$costTravelAllowanceType"
        },
        {
            $project: {
                "_id": 0,
                "id": 1,
                "employee.id": "$employee.id",
                "employee.name": "$employee.name",
                "employee.code": "$employee.code",
                "manager.id": "$manager.id",
                "manager.name": "$manager.name",
                "manager.code": "$manager.code",
                "state.id": "$status.id",
                "state.name": "$status.name",
                "enterprise.id": "$enterprise.id",
                "enterprise.name": "$enterprise.name",
                "activity.id": "$activity.id",
                "activity.name": "$activity.name",
                "amount": 1,
                "concept": 1,
                "expenditureSheetId": 1,
                "datedOn": 1,
                "kms": 1,
                "kmsDirectFactor": 1,
                "kmsPayrollFactor": 1,
                "kmsPayRollSSFactor": 1,
                "tickets": 1,
                "lodging": 1,
                "representation": 1,
                "iva": 1,
                "costTravelAllowanceAmount": 1,
                "costTravelAllowanceType.id": "$costTravelAllowanceType.id",
                "costTravelAllowanceType.name": "$costTravelAllowanceType.name",
                "costTravelAllowanceMaxExempt": "$costTravelAllowanceType.costTravelAllowanceMaxExempt",
                "comments": 1,
                "reject": 1
            }
        }
    ], {}, function (e, docs) {
        if (e != null) {
            res.json(e)
        } else {
            docs[0].version = 1
            let result = {
                expense: docs[0]
            }
            res.json(result)
        }
    })
});

// GET resetCollectionSalaries
router.get('/reset', function (req, res) {
    var db = req.db;
    var collection = db.get('expenses');
    collection.remove({});
    collection.insert([
        {
            id: 1,
            datedOn: '2019-03-01',
            activityId: 1,
            statusId: 1,
            employeeId: 1,
            managerId: 2,
            enterpriseId: 1,
            amount: 10,
            concept: 'Gastos varios',
            expenditureSheetId: 1,
            kms: 10,
            kmsDirectFactor: 0.19,
            kmsPayrollFactor: 0.19,
            kmsPayRollSSFactor: 0,
            tickets: 0,
            lodging: 2,
            representation: 0,
            iva: 0,
            costTravelAllowanceAmount: 1,
            costTravelAllowanceTypeId: 1,
            comments: 'comentario tal y cual',
        },
        {
            id: 2,
            datedOn: '2019-04-01',
            activityId: 2,
            statusId: 1,
            employeeId: 1,
            managerId: 2,
            enterpriseId: 1,
            amount: 13.2,
            concept: 'Reunion en cliente X',
            expenditureSheetId: 2,
        },
        {
            id: 3,
            datedOn: '2019-05-01',
            activityId: 2,
            statusId: 1,
            employeeId: 2,
            managerId: 4,
            enterpriseId: 2,
            amount: 3.2,
            concept: 'Kilometraje'
        },
        {
            id: 4,
            datedOn: '2019-06-01',
            activityId: 2,
            statusId: 3,
            employeeId: 5,
            managerId: 2,
            enterpriseId: 2,
            amount: 300,
            concept: 'Dietas Pernambuco'
        },
        {
            id: 5,
            datedOn: '2019-07-01',
            activityId: 2,
            statusId: 1,
            employeeId: 3,
            managerId: 6,
            enterpriseId: 3,
            amount: 23.12,
            concept: 'Otros gastos'
        }
    ], function (err, result) {
        res.send(
            (err === null) ? { msg: 'OK: expenses collection has been correctly initialized' } : { msg: 'KO: ' + err }
        );
    });
});
// GET resetCollectionSalaries
router.get('/resetCostTravelAllowanceTypes', function (req, res) {
    var db = req.db;
    var collection = db.get('costTravelAllowanceTypes');
    collection.remove({});
    collection.insert([
        {
            id: 1,
            name: 'ESPAÑA CON PERNOCTA',
            costTravelAllowanceMaxExempt: 30
        },
        {
            id: 1,
            name: 'ESPAÑA SIN PERNOCTA',
            costTravelAllowanceMaxExempt: 20
        }, {
            id: 1,
            name: 'EXTRANJERO CON PERNOCTA',
            costTravelAllowanceMaxExempt: 50
        }, {
            id: 1,
            name: 'EXTRANJERO SIN PERNOCTA',
            costTravelAllowanceMaxExempt: 40
        }
    ], function (err, result) {
        res.send(
            (err === null) ? { msg: 'OK: costTravelAllowanceTypes collection has been correctly initialized' } : { msg: 'KO: ' + err }
        );
    });
});

module.exports = router;
