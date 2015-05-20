var Express = require("express"),
  router = Express.Router(),
  projectsRoutes = require("./projects"),
  Config = require("../config"),
  Db = require("../db"),
  Crypto = require("crypto"),
  Q = require("q");

router.use("/projects", projectsRoutes);

router.get("/whoami", function(req, res){
  res.json({user: req.session.user || {}});
});

router.get("/logout", function(req, res){
  req.session.user = null;

  res.end();
});

router.post("/login", function(req, res){
  Q.spawn(function *(){
    var credentials = req.body;

    var hashedPassword = yield hashPassword(credentials.password, credentials.username);

    credentials.password = hashedPassword.toString("hex");

    Db.
      authenticate(credentials).
      then(function(user){
        if(user){
          req.session.user = {
            username: req.body.username
          };
        }

        res.json({err: !user ? "Invalid login." : null});
      }).
      fail(function(err){
        console.log(err);

        res.status(500).end();
      });
  });
});

router.post("/signUp", function(req, res){
  Q.spawn(function *(){
    var credentials = req.body;

    var hashedPassword = yield hashPassword(credentials.password, credentials.username);

    credentials.password = hashedPassword.toString("hex");

    Db.
      register(credentials).
      then(function(){
        req.session.user = {
          username: req.body.username
        };

        res.json({err: null});
      }).
      fail(function(err){
        console.log(err);

        res.status(500).end();
      });
  });
});

function hashPassword(password, salt){
  var pbkdf2 = Q.denodeify(Crypto.pbkdf2);

  return pbkdf2(password, salt, Config.HashIterations, Config.HashKeyLength);
}

module.exports = router;
