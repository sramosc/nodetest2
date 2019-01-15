var express = require('express');
var router = express.Router();

// GET permissions selection
router.get('/get/:id', function (req, res) {
    var docToFind = req.params.id;
    let result = '';
    // lista de acciones posibles : ['browse', 'create', 'edit', 'delete', 'print_report', 'export_xls', 'confirm', 'clear', 'cancel']
    if (docToFind == '79000002374') {
        result = {
            permissions: [
                { subject: 'banksAccounts', actions: ['browse', 'create', 'print_report', 'export_xls'] },
                { subject: 'newBankAccount', actions: ['browse', 'confirm', 'clear', 'cancel'] },
                { subject: 'editBankAccount', actions: ['browse', 'delete', 'print_report', 'export_xls', 'confirm', 'cancel'] },
                { subject: 'calendars', actions: ['browse', 'create', 'print_report', 'export_xls'] },
                { subject: 'newCalendar', actions: ['browse', 'confirm', 'clear', 'cancel'] },
                { subject: 'editCalendar', actions: ['browse', 'delete', 'print_report', 'export_xls', 'confirm', 'cancel'] },
                { subject: 'orgsUnits', actions: ['browse', 'create', 'edit', 'delete', 'print_report', 'export_xls'] },
                { subject: 'newOunit', actions: ['browse', 'confirm', 'clear', 'cancel'] },
                { subject: 'editOunit', actions: ['browse', 'confirm', 'cancel'] },
                { subject: 'activities', actions: ['browse', 'print_report', 'export_xls'] },
                { subject: 'notifications', actions: ['browse'] },
                { subject: 'salaries', actions: ['browse'] },
                { subject: 'vacations', actions: ['browse', 'create', 'edit', 'print_report', 'export_xls'] },
                { subject: 'tasks', actions: ['browse'] }
            ]
        }
    } else {
        result = {
            permissions: [
                {
                    actions: [
                        'browse'
                    ],
                    subject: 'banksAccounts'
                }
            ]
        }
    }

    res.json(result)
});

module.exports = router;
