var Express = require("express"),
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  BodyParser = require("body-parser"),
  Path = require("path"),
  FS = require("fs"),
  Morgan = require("morgan"),
  React = require("react"),
  ReactRouter = require("react-router"),
  UI = require("./ui-transformed"),
  apiRoutes = require("./routes/api"),
  Q = require("q");

var indexTemplate = FS.readFileSync("./app-shell.html", {encoding: "utf8"});

var app = Express();

app.use(Express.static(Path.join(__dirname, "public")));

app.use(BodyParser.json());

app.use(Morgan("dev"));

app.use(cookieParser());

app.use(session({
  secret: "mysupersecretsessionsecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  }
}));

app.set("port", process.env.PORT || 3002);

app.use("/api", apiRoutes);

app.use(function(req, res){
  if(req.path === "/favicon.ico"){
      // NOTE: Temporary measure until I add a favicon file
      return res.status(404).end();
  }

  ReactRouter.run(UI.routes, req.url, function(Handler, state){
    Q.spawn(function *(){
      var cookie =  "connect.sid= " + req.cookies["connect.sid"];

      var results = yield UI.fetchData(state.routes, req.params, req.query, cookie);

      var data = results.reduce(function(prev, curr, i, arr){
        if(curr){
          prev[state.routes[i].name] = curr;
        }

        return prev;
      }, {})

      var markup = React.renderToString(React.createElement(Handler, { data: data }));

      var fullMarkup = indexTemplate.replace("APP GOES HERE", markup);

      res.status(200).send(fullMarkup);
    });
  });

  Q.onerror = function(err){
    console.log(err);

    res.status(500).end();
  };
});

app.listen(app.get("port"), function(){
  console.log("app is listening at port " + app.get("port"));
});
