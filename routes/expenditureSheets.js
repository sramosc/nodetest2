var express = require('express');
var router = express.Router();

// LIST EXPENDITURE SHEETS
router.get('/list', function (req, res) {
    var db = req.db;
    var collection = db.get('expenditureSheets');

    let pipeline = [
        {
            $lookup: {
                from: "sepa",
                localField: "expenditureBankClosingId",
                foreignField: "id",
                as: "expenditureBankClosing"
            }
        },
        {
            $unwind: {
                path: "$expenditureBankClosing",
                "preserveNullAndEmptyArrays": true
              }
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
                "expenditureBankClosing.description": "$expenditureBankClosing.description",
                "expenditureBankClosing.id": "$expenditureBankClosing.id",
                "employee.id": "$employee.id",
                "employee.name": "$employee.name",
                "employee.code": "$employee.code",
                "manager.id": "$manager.id",
                "manager.name": "$manager.name",
                "manager.code": "$manager.code",
                "status.id": "$status.id",
                "status.name": "$status.name",
                "enterprise.id":"$enterprise.id",
                "enterprise.name":"$enterprise.name",
                "amount": 1,
                "date":1
            }
        }]

    if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
        console.log("sin query params")
    } else {

        let matchStage = {}
        let matchExists = false

        // match stage
        if ('employeeId' in req.query) {
            matchStage['employeeId'] = Number(req.query.employeeId)
            matchExists = true
        }

        if ('managerId' in req.query) {
            matchStage['managerId'] = Number(req.query.managerId)
            matchExists = true
        }

        if ('enterpriseId' in req.query) {
            matchStage['enterpriseId'] = Number(req.query.enterpriseId)
            matchExists = true
        }

        if ('expenditureBankClosingId' in req.query) {
            matchStage['expenditureBankClosing.id'] = Number(req.query.expenditureBankClosingId)
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
                    expenditureSheets: docs,
                }
                res.json(result)
            }
        })
});

// GET resetCollectionSalaries
router.get('/reset', function (req, res) {
    var db = req.db;
    var collection = db.get('expenditureSheets');
    collection.remove({});
    collection.insert([
        {
            id: 1,
            expenditureBankClosingId: 1,
            employeeId: 1,
            amount: 123,
            managerId: 3,
            enterpriseId: 2,
            date: '2019-03-01',
            statusId: 1,
            activities: [1,2,3]
        },
        {
            id: 2,
            expenditureBankClosingId: 1,
            employeeId: 2,
            amount: 12.3,
            managerId: 3,
            enterpriseId: 2,
            date: '2019-03-01',
            statusId: 1,
            activities: [1,2,3]
        },
        {
            id: 3,
            expenditureBankClosingId: null,
            employeeId: 3,
            amount: 45.66,
            managerId: 3,
            enterpriseId: 2,
            date: '2019-03-01',
            statusId: 1,
            activities: [1,2,3]
        },
        {
            id: 4,
            expenditureBankClosingId: null,
            employeeId: 3,
            amount: 500,
            managerId: 3,
            enterpriseId: 2,
            date: '2019-03-01',
            statusId: 1,
            activities: [1,2,3]
        },
        {
            id: 5,
            expenditureBankClosingId: null,
            employeeId: 4,
            amount: 23.45,
            managerId: 3,
            enterpriseId: 2,
            date: '2019-03-01',
            statusId: 1,
            activities: [1,2,3]
        },
        {
            id: 6,
            expenditureBankClosingId: 2,
            employeeId: 5,
            amount: 12.76,
            managerId: 3,
            enterpriseId: 2,
            date: '2019-03-01',
            statusId: 1,
            activities: [1,2,3]
        },
        {
            id: 7,
            expenditureBankClosingId: 2,
            employeeId: 6,
            amount: 223,
            managerId: 3,
            enterpriseId: 2,
            date: '2019-03-01',
            statusId: 1,
            activities: [1,2,3]
        },
        {
            id: 8,
            expenditureBankClosingId: 2,
            employeeId: 1,
            amount: 16.2,
            managerId: 3,
            enterpriseId: 2,
            date: '2019-03-01',
            statusId: 1,
            activities: [1,2,3]
        },
        {
            id: 9,
            expenditureBankClosingId: 3,
            employeeId: 4,
            amount: 67.43,
            managerId: 3,
            enterpriseId: 2,
            date: '2019-03-01',
            statusId: 1,
            activities: [1,2,3]
        },
        {
            id: 10,
            expenditureBankClosingId: 3,
            employeeId: 6,
            amount: 237,
            managerId: 3,
            enterpriseId: 2,
            date: '2019-03-01',
            statusId: 1,
            activities: [1,2,3]
        }
    ], function (err, result) {
        res.send(
            (err === null) ? { msg: 'OK: expenditureSheets collection has been correctly initialized' } : { msg: 'KO: ' + err }
        );
    });
});

module.exports = router;
