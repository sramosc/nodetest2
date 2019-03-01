var express = require('express');
var router = express.Router();


router.get('/get', function (req, res) {
    var db = req.db
    var collection = db.get('userPermissions')

    let pipeline = [
        {
            $match: {
                userId: req.query.userId
            }
        },
        {
            $project: {
                "_id": 0,
                "id": 1,
                "employeeId": 1,
                "permissions": 1
            }
        }]

    collection.aggregate(pipeline, {}, function (e, docs) {
        if (e != null) {
            res.json(e)
        } else {

            let permissions = docs[0].permissions
            permissions.forEach(subject => {
                subject.actions = subject.actions.filter(action => {
                    return action.actionState
                }).map(action => {
                    return action.actionName
                })
            })

            let result = {
                permissions: permissions,
            }
            res.json(result)
        }
    })
})

router.get('/get/employees/:id', function (req, res) {
    var db = req.db
    var collection = db.get('userPermissions')
    var docToFind = req.params.id

    let pipeline = [
        {
            $match: {
                employeeId: Number(docToFind)
            }
        },
        {
            $project: {
                "_id": 0,
                "id": 1,
                "employeeId": 1,
                "permissions": 1
            }
        }]

    collection.aggregate(pipeline, {}, function (e, docs) {
        if (e != null) {
            res.json(e)
        } else {

            let permissions = docs[0].permissions

            let result = {
                permissions: permissions,
            }
            res.json(result)
        }
    })
})

router.get('/get/groups/:id', function (req, res) {
    var db = req.db
    var collection = db.get('groupsPermissions')
    var docToFind = req.params.id

    let pipeline = [
        {
            $match: {
                groupId: Number(docToFind)
            }
        },
        {
            $project: {
                "_id": 0,
                "id": 1,
                "groupId": 1,
                "permissions": 1
            }
        }]

    collection.aggregate(pipeline, {}, function (e, docs) {
        if (e != null) {
            res.json(e)
        } else {

            let permissions = docs[0].permissions

            let result = {
                permissions: permissions,
            }
            res.json(result)
        }
    })
})

router.get('/get/empGroups/:id', function (req, res) {
    var db = req.db
    var collection = db.get('groupsPermissions')
    var docToFind = Number(req.params.id)

    let pipeline = [
        {
            $project: {
                "_id": 0,
                "id": 1,
                "id": "$groupId",
                "name": "$groupName",
                "permissions": 1
            }
        }]

    collection.aggregate(pipeline, {}, function (e, docs) {
        if (e != null) {
            res.json(e)
        } else {
            let result = {
                groups: docs
            }
            if (docToFind == 1) {
                result.groups[0].assigned = false
                result.groups[1].assigned = false
            } else {
                result.groups[0].assigned = true
                result.groups[1].assigned = false
            }
            res.json(result)
        }
    })
})

router.get('/resetEmployees', function (req, res) {
    var db = req.db;
    var collection = db.get('userPermissions');
    collection.remove({});
    collection.insert([
        {
            "id": 1,
            "employeeId": 1,
            "userId": '79000002374',
            "permissions": [
                {
                    "subject": "banksAccounts",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_new",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "actionState": true
                        },
                        {
                            "actionName": "clear_btn_new",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "calendars",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_new",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "actionState": true
                        },
                        {
                            "actionName": "clear_btn_new",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "orgsUnits",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "delete_btn_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_new",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "actionState": true
                        },
                        {
                            "actionName": "clear_btn_new",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "activities",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "notifications",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "financialsDocuments",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "vacations",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_conf",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "tasks",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "workReports",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "users",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "groups",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": true
                        }
                    ]
                }
            ]
        },
        {
            "id": 2,
            "employeeId": 2,
            "userId": "79000000112",
            "permissions": [
                {
                    "subject": "banksAccounts",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_new",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "calendars",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_new",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "orgsUnits",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_new",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "activities",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "notifications",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "financialsDocuments",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "vacations",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_conf",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "tasks",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "workReports",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "users",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "groups",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": true
                        }
                    ]
                }
            ]
        }

    ], function (err, result) {
        res.send(
            (err === null) ? { msg: 'OK: userPermissions collection has been correctly initialized' } : { msg: 'KO: ' + err }
        );
    });
});

router.get('/resetGroups', function (req, res) {
    var db = req.db;
    var collection = db.get('groupsPermissions');
    collection.remove({});
    collection.insert([
        {
            "id": 1,
            "groupId": 1,
            "groupName": "EMPLEADOS",
            "permissions": [
                {
                    "subject": "banksAccounts",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_new",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "actionState": true
                        },
                        {
                            "actionName": "clear_btn_new",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "calendars",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_new",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "actionState": true
                        },
                        {
                            "actionName": "clear_btn_new",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "orgsUnits",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_new",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "activities",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "notifications",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "financialsDocuments",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "vacations",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_conf",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "tasks",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "workReports",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "users",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "groups",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": true
                        }
                    ]
                }
            ]
        },
        {
            "id": 2,
            "groupId": 2,
            "groupName": "FINANCIERO",
            "permissions": [
                {
                    "subject": "banksAccounts",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_new",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "calendars",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_new",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "orgsUnits",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_new",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "activities",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "notifications",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "financialsDocuments",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "vacations",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_conf",
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "tasks",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "workReports",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "users",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "groups",
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "actionState": true
                        }
                    ]
                }
            ]
        }

    ], function (err, result) {
        res.send(
            (err === null) ? { msg: 'OK: groupsPermissions collection has been correctly initialized' } : { msg: 'KO: ' + err }
        );
    });
});

module.exports = router;
