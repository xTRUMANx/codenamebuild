var Express = require("express"),
  router = Express.Router(),
  ParseApi = require("node-parse-api").Parse,
  Config = require("../Config");

var parseApiClient = new ParseApi({
  app_id: Config.Parse.AppId,
  api_key: Config.Parse.ApiKey
});

router.get("/", function(req, res){
  parseApiClient.findMany("Project", "", function(err, response){
    if(err){
      res.status(500).end();
    }
    else{
      var projects = response.results.map(function(result){
        var project = result;
        project.id = result.objectId;
        return project;
      });

      res.json({projects: response.results});
    }
  });
});

router.post("/", function(req, res){
  parseApiClient.insert("Project", req.body, function(err, response){
    res.json({id: response.objectId});
  });
});

module.exports = router;
