var express = require('express');
var router = express.Router();

// GET userList
router.get('/list', function (req, res) {
  let docs  = [
    {
      id: 1,
      name: 'tarea programada 1'      
    },
    {
      id: 2,
      name: 'tarea programada 2'      
    },
    {
      id: 3,
      name: 'tarea programada 3'      
    },
    {
      id: 4,
      name: 'tarea programada 4'      
    },
    {
      id: 5,
      name: 'tarea programada 5'
    },
    {
      id: 6,
      name: 'tarea programada 6'      
    }
  ]
    let result = {
      tasks: docs,
    }
    res.json(result)
});


module.exports = router;
