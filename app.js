var bodyParser = require('body-parser');
var createError = require('http-errors');
var cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Database
var mongo = require('mongodb');
var monk = require('monk');
//var db = monk('usertest1:userpass1@ds119059.mlab.com:19059/nodetest1');
var db = monk('mongodb://localhost:27017/entelgyservices');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employeesRoutes = require('./routes/employees');
var orgsUnitsRoutes = require('./routes/orgsUnits');
var orgsUnitsTypesRoutes = require('./routes/orgsUnitsTypes');
var calendarsRoutes = require('./routes/calendars');
var calendarTypesRoutes = require('./routes/calendarTypes');
var calendarYearsRoutes = require('./routes/calendarYears');
var calendarMonthsRoutes = require('./routes/calendarMonths');
var bankAccountsRoutes = require('./routes/bankAccounts');
var enterprisesRoutes = require('./routes/enterprises');
var vacationsRoutes = require('./routes/vacations');
var activitiesRoutes = require('./routes/activities');
var activityTypesRoutes = require('./routes/activityTypes');
var activitiesLinesRoutes = require('./routes/activitiesLines');
var activityRolesRoutes = require('./routes/activityRoles');
var activityInvoicingTypesRoutes = require('./routes/activityInvoicingTypes');
var activityExpensesPermissionTypesRoutes = require('./routes/activityExpensesPermissionTypes');
var activitySubtypesRoutes = require('./routes/activitySubtypes');
var activityIncomeTypesRoutes = require('./routes/activityIncomeTypes');
var clientsRoutes = require('./routes/clients');
var companiesRoutes = require('./routes/companies');
var tasksRoutes = require('./routes/tasks');
var employeeGroupsRoutes = require('./routes/employeeGroups');
var salariesRoutes = require('./routes/salaries');
var notificationsRoutes = require('./routes/notifications');
var notificationTypesRoutes = require('./routes/notificationTypes');
var erroresRoutes = require('./routes/errores')
var permissionsRoutes = require('./routes/permissions')
var financialsDocumentsRoutes = require('./routes/financialsDocuments');
var workReportsRoutes = require('./routes/workReports');
var sepaRoutes = require('./routes/sepa');
var sepaStatusRoutes = require('./routes/sepaStatus');
var substitutionsRoutes = require('./routes/substitutions');
var expenditureSheetsRoutes = require('./routes/expenditureSheets');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('port', 8000);
var port = 8000;
app.listen(port, function () {
  console.log('App listening on port ' + port + '!');
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function (req, res, next) {
  req.db = db;
  next();
});

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/employees', employeesRoutes);
app.use('/api/orgsunits', orgsUnitsRoutes);
app.use('/api/orgsunitstypes', orgsUnitsTypesRoutes);
app.use('/api/calendars', calendarsRoutes);
app.use('/api/calendarstypes', calendarTypesRoutes);
app.use('/api/years', calendarYearsRoutes);
app.use('/api/months', calendarMonthsRoutes);
app.use('/api/banksaccounts', bankAccountsRoutes);
app.use('/api/enterprises', enterprisesRoutes);
app.use('/api/vacations', vacationsRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/activitiestypes', activityTypesRoutes);
app.use('/api/activitieslines', activitiesLinesRoutes);
app.use('/api/activitiesroles', activityRolesRoutes);
app.use('/api/activitiesinvoicingtypes', activityInvoicingTypesRoutes);
app.use('/api/activitiesexpensespermissionstypes', activityExpensesPermissionTypesRoutes);
app.use('/api/activitiessubtypes', activitySubtypesRoutes);
app.use('/api/recordsstatus', activityInvoicingTypesRoutes);
app.use('/api/activitiesstatus', activityInvoicingTypesRoutes);
app.use('/api/activitiesincometypes', activityIncomeTypesRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/customers', clientsRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/groups', employeeGroupsRoutes);
app.use('/api/salaries', salariesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/notificationstypes', notificationTypesRoutes);
app.use('/api/acl', permissionsRoutes);
app.use('/api/errores', erroresRoutes);
app.use('/api/financialsdocuments', financialsDocumentsRoutes);
app.use('/api/workreports', workReportsRoutes);
app.use('/api/sepa', sepaRoutes);
app.use('/api/sepastatus', sepaStatusRoutes);
app.use('/api/substitutions', substitutionsRoutes);
app.use('/api/expendituresheets', expenditureSheetsRoutes);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
