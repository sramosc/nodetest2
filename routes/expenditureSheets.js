var express = require('express');
var router = express.Router();

// GET salaries
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
            $project: {
                "_id": 0,
                "id": 1,
                "expenditureBankClosing.description": "$expenditureBankClosing.description",
                "expenditureBankClosing.id": "$expenditureBankClosing.id",
                "employee.id": "$employee.id",
                "employee.name": "$employee.name",
                "employee.code": "$employee.code",
                "amount": 1
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
            amount: 123
        },
        {
            id: 2,
            expenditureBankClosingId: 1,
            employeeId: 2,
            amount: 12.3
        },
        {
            id: 3,
            expenditureBankClosingId: null,
            employeeId: 3,
            amount: 45.66
        },
        {
            id: 4,
            expenditureBankClosingId: null,
            employeeId: 3,
            amount: 500
        },
        {
            id: 5,
            expenditureBankClosingId: null,
            employeeId: 4,
            amount: 23.45
        },
        {
            id: 6,
            expenditureBankClosingId: 2,
            employeeId: 5,
            amount: 12.76
        },
        {
            id: 7,
            expenditureBankClosingId: 2,
            employeeId: 6,
            amount: 223
        },
        {
            id: 8,
            expenditureBankClosingId: 2,
            employeeId: 1,
            amount: 16.2
        },
        {
            id: 9,
            expenditureBankClosingId: 3,
            employeeId: 4,
            amount: 67.43
        },
        {
            id: 10,
            expenditureBankClosingId: 3,
            employeeId: 6,
            amount: 237
        }
    ], function (err, result) {
        res.send(
            (err === null) ? { msg: 'OK: expenditureSheets collection has been correctly initialized' } : { msg: 'KO: ' + err }
        );
    });
});

module.exports = router;
