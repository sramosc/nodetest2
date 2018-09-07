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
var db = monk('usertest1:userpass1@ds119059.mlab.com:19059/nodetest1');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employeesRoutes = require('./routes/employees');
var oUnitsRoutes = require('./routes/ounits');
var calendarsRoutes = require('./routes/calendars');
var accountsRoutes = require('./routes/accounts');
var companiesRoutes = require('./routes/companies');
var vacationsRoutes = require('./routes/vacations');
var activitiesRoutes = require('./routes/activities');
var activityTypesRoutes = require('./routes/activityTypes');
var activityLinesRoutes = require('./routes/activityLines');
var activityRolesRoutes = require('./routes/activityRoles');
var activityInvoicingTypesRoutes = require('./routes/activityInvoicingTypes');
var activityExpensesPermissionTypesRoutes = require('./routes/activityExpensesPermissionTypes');
var clientsRoutes = require('./routes/clients');


var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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
app.use('/users', usersRouter);
app.use('/employees', employeesRoutes);
app.use('/ounits', oUnitsRoutes);
app.use('/calendars', calendarsRoutes);
app.use('/accounts', accountsRoutes);
app.use('/companies', companiesRoutes);
app.use('/vacations', vacationsRoutes);
app.use('/activities', activitiesRoutes);
app.use('/activityTypes', activityTypesRoutes);
app.use('/activityLines', activityLinesRoutes);
app.use('/activityRoles', activityRolesRoutes);
app.use('/activityInvoicingTypes', activityInvoicingTypesRoutes);
app.use('/activityExpensesPermissionTypes', activityExpensesPermissionTypesRoutes);
app.use('/clients', clientsRoutes);


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
