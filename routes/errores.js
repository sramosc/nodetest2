var express = require('express');
var router = express.Router();

router.get('/error400', function (req, res) {
  let result = {
    errorMessage: "Error 400 - BAD REQUEST"
  }
  res.status(400)
  res.json(result)
});

router.get('/error401', function (req, res) {
  let result = {
    errorMessage: "Error 401 - Unauthorized"
  }
  res.status(401)
  res.json(result)
});

router.get('/error403', function (req, res) {
  let result = {
    errorMessage: "Error 403 - Forbidden"
  }
  res.status(403)
  res.json(result)
});

router.get('/error404', function (req, res) {
  let result = {
    errorMessage: "Error 404 - Not Found"
  }
  res.status(404)
  res.json(result)
});

router.get('/error500', function (req, res) {
  let result = {
    errorMessage: "Error 500 - Internal Server Error"
  }
  res.status(500)
  res.json(result)
});

module.exports = router;
