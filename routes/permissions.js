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

            var db2 = req.db
            var collection2 = db2.get('groupsPermissions')

            let pipeline2 = [
                {
                    $project: {
                        "_id": 0,
                        "id": 1,
                        "id": "$groupId",
                        "name": "$groupName",
                        "permissions": 1
                    }
                }]

            collection2.aggregate(pipeline2, {}, function (e, docs2) {
                if (e != null) {
                    res.json(e)
                } else {
                    let groups = docs2

                    if (docToFind == 1) {
                        groups[0].assigned = false
                        groups[1].assigned = false
                    } else {
                        groups[0].assigned = true
                        groups[1].assigned = false
                    }

                    let result = {
                        acl: {
                            permissions: permissions,
                            groups: groups
                        }
                    }
                    res.json(result)
                }
            })
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
                acl: {
                    permissions: permissions
                }
            }
            res.json(result)
        }
    })
})

router.get('/get/empgroups/:id', function (req, res) {
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
            "employeeId": 6,
            "userId": '79000002374',
            "permissions": [
                {
                    "subject": "banksAccounts",
                    "id": 1,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": true
                        },
                        {
                            "actionName": "clear_btn_new",
                            "id": 7,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "id": 11,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "calendars",
                    "id": 2,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": true
                        },
                        {
                            "actionName": "clear_btn_new",
                            "id": 7,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "id": 11,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "orgsUnits",
                    "id": 3,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": true
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "id": 15,
                            "actionState": true
                        },
                        {
                            "actionName": "delete_btn_lst",
                            "id": 16,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": true
                        },
                        {
                            "actionName": "clear_btn_new",
                            "id": 7,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "activities",
                    "id": 4,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "id": 11,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "notifications",
                    "id": 5,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "financialsDocuments",
                    "id": 6,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "vacations",
                    "id": 7,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": true
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "id": 15,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        },
                        {
                            "actionName": "clear_btn_edit",
                            "id": 18,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_conf",
                            "id": 17,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "tasks",
                    "id": 8,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "workReports",
                    "id": 9,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "users",
                    "id": 10,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "groups",
                    "id": 11,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "sepa",
                    "id": 12,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": true
                        },
                        {
                            "actionName": "print_sepa_edit",
                            "id": 18,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "substitutions",
                    "id": 13,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": true
                        }
                    ]
                }
            ]
        },
        {
            "id": 2,
            "employeeId": 1,
            "userId": "79000000112",
            "permissions": [
                {
                    "subject": "banksAccounts",
                    "id": 1,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_new",
                            "id": 7,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "id": 11,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "calendars",
                    "id": 2,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_new",
                            "id": 7,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "id": 11,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "orgsUnits",
                    "id": 3,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": false
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "id": 15,
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_lst",
                            "id": 16,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_new",
                            "id": 7,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "activities",
                    "id": 4,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "id": 11,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "notifications",
                    "id": 5,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "financialsDocuments",
                    "id": 6,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "vacations",
                    "id": 7,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": true
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "id": 15,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "clear_btn_edit",
                            "id": 18,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_conf",
                            "id": 17,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "tasks",
                    "id": 8,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "workReports",
                    "id": 9,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "users",
                    "id": 10,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "groups",
                    "id": 11,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "sepa",
                    "id": 12,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": false
                        },
                        {
                            "actionName": "print_sepa_edit",
                            "id": 18,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "substitutions",
                    "id": 13,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
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
                    "id": 1,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": true
                        },
                        {
                            "actionName": "clear_btn_new",
                            "id": 7,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "id": 11,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "calendars",
                    "id": 2,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": true
                        },
                        {
                            "actionName": "clear_btn_new",
                            "id": 7,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "id": 11,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": true
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "orgsUnits",
                    "id": 3,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": false
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "id": 15,
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_lst",
                            "id": 16,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_new",
                            "id": 7,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "activities",
                    "id": 4,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "id": 11,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "notifications",
                    "id": 5,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "financialsDocuments",
                    "id": 6,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "vacations",
                    "id": 7,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": false
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "id": 15,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_edit",
                            "id": 18,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_conf",
                            "id": 17,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "tasks",
                    "id": 8,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "workReports",
                    "id": 9,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "users",
                    "id": 10,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "groups",
                    "id": 11,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "sepa",
                    "id": 12,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": false
                        },
                        {
                            "actionName": "print_sepa_edit",
                            "id": 18,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "substitutions",
                    "id": 13,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": false
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
                    "id": 1,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_new",
                            "id": 7,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "id": 11,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "calendars",
                    "id": 2,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_new",
                            "id": 7,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "id": 11,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "orgsUnits",
                    "id": 3,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": false
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "id": 15,
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_lst",
                            "id": 16,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_new",
                            "id": 7,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "activities",
                    "id": 4,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": false
                        },
                        {
                            "actionName": "delete_btn_edit",
                            "id": 11,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "notifications",
                    "id": 5,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "financialsDocuments",
                    "id": 6,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "vacations",
                    "id": 7,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": false
                        },
                        {
                            "actionName": "edit_btn_lst",
                            "id": 15,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": false
                        },
                        {
                            "actionName": "clear_btn_edit",
                            "id": 18,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_conf",
                            "id": 17,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "tasks",
                    "id": 8,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "workReports",
                    "id": 9,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": true
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": true
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "users",
                    "id": 10,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "groups",
                    "id": 11,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_lst",
                            "id": 3,
                            "actionState": false
                        },
                        {
                            "actionName": "export_xls_lst",
                            "id": 4,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": true
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": true
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": true
                        },
                        {
                            "actionName": "export_xls_edit",
                            "id": 13,
                            "actionState": true
                        }
                    ]
                },
                {
                    "subject": "sepa",
                    "id": 12,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_edit",
                            "id": 9,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_edit",
                            "id": 10,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_edit",
                            "id": 14,
                            "actionState": false
                        },
                        {
                            "actionName": "print_report_edit",
                            "id": 12,
                            "actionState": false
                        },
                        {
                            "actionName": "print_sepa_edit",
                            "id": 18,
                            "actionState": false
                        },
                        {
                            "actionName": "browse_new",
                            "id": 5,
                            "actionState": false
                        },
                        {
                            "actionName": "confirm_btn_new",
                            "id": 6,
                            "actionState": false
                        },
                        {
                            "actionName": "cancel_btn_new",
                            "id": 8,
                            "actionState": false
                        }
                    ]
                },
                {
                    "subject": "substitutions",
                    "id": 13,
                    "actions": [
                        {
                            "actionName": "browse_lst",
                            "id": 1,
                            "actionState": false
                        },
                        {
                            "actionName": "create_btn_lst",
                            "id": 2,
                            "actionState": false
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
