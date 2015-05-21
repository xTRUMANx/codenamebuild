var Express = require("express"),
  router = Express.Router(),
  Config = require("../config"),
  Db = require("../db");

router.get("/", function(req, res){
  if(req.query.id){
    Db.
      getProject(req.query.id).
      then(function(project){
        res.json({project: project});
      }).
      fail(function(err){
        console.log(err);

        res.status(500).end();
      });
  }
  else{
    Db.
      getProjects().
      then(function(projects){
        res.json({projects: projects});
      }).
      fail(function(err){
        console.log(err);

        res.status(500).end();
      });
  }
});

router.post("/", function(req, res){
  if(!req.session.user){
    res.status(403).end();
    return;
  }

  var project = req.body;
  project.createdBy = req.session.user.username;

  Db.
    saveProject(project).
    then(function(id){
      res.json({id: id});
    }).
    fail(function(err){
      console.log(err);

      res.status(500).end();
    });
});

module.exports = router;
