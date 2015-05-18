var Express = require("express"),
  router = Express.Router(),
  projectsRoutes = require("./projects"),
  ParseApi = require("node-parse-api").Parse,
  Config = require("../Config"),
  Request = require("request");

var parseApiClient = new ParseApi({
  app_id: Config.Parse.AppId,
  api_key: Config.Parse.ApiKey
});

router.use("/projects", projectsRoutes);

router.get("/whoami", function(req, res){
  res.json({user: req.session.user || {}});
});

router.get("/logout", function(req, res){
  req.session.user = null;

  res.end();
});

router.post("/login", function(req, res){
  // NOTE: Not using parseApiClient for this
  // operation since it can't tell you the reason
  // for a failed sign up (such as username in use).

  Request({
    method: "GET",
    url: "https://api.parse.com/1/login",
    headers: {
      "X-Parse-Application-Id": Config.Parse.AppId,
      "X-Parse-REST-API-Key": Config.Parse.ApiKey
    },
    json: true,
    qs: req.body
  }, function(err, response, body){
    if(err){
      res.status(500).end();
    }
    else{
      if(body.sessionToken){
        req.session.user = {
          parseToken: body.sessionToken,
          objectId: body.objectId,
          username: req.body.username
        };
      }

      res.json({err: body.error});
    }
  });
});

router.post("/signUp", function(req, res){
  // NOTE: Not using parseApiClient for this
  // operation since it can't tell you the reason
  // for a failed sign up (such as username in use).
  Request({
    method: "POST",
    url: "https://api.parse.com/1/users",
    headers: {
      "X-Parse-Application-Id": Config.Parse.AppId,
      "X-Parse-REST-API-Key": Config.Parse.ApiKey
    },
    json: true,
    body: req.body
  }, function(err, response, body){
    if(err){
      res.status(500).end();
    }
    else{
      if(body.sessionToken){
        req.session.user = {
          parseToken: body.sessionToken,
          objectId: body.objectId,
          username: req.body.username
        };
      }

      res.json({err: body.error});
    }
  });
});

module.exports = router;
