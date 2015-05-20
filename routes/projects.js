var Express = require("express"),
  router = Express.Router(),
  Config = require("../config"),
  Db = require("../db");

router.get("/", function(req, res){
  Db.
    getProjects().
    then(function(projects){
      res.json({projects: projects});
    }).
    fail(function(err){
      console.log(err);

      res.status(500).end();
    });
});

router.post("/", function(req, res){
  Db.
    saveProject(req.body).
    then(function(id){
      res.json({id: id});
    }).
    fail(function(err){
      console.log(err);

      res.status(500).end();
    });
});

module.exports = router;
