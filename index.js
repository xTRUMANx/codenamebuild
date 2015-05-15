var Express = require("express"),
  Path = require("path"),
  FS = require("fs"),
  Morgan = require("morgan"),
  React = require("react"),
  ReactRouter = require("react-router"),
  UI = require("./ui-transformed");

var indexTemplate = FS.readFileSync("./public/index-template.html", {encoding: "utf8"});

var app = Express();

app.use(Express.static(Path.join(__dirname, "public")));

app.use(Morgan("dev"));

app.set("port", process.env.PORT || 3002);

app.use(function(req, res){
  ReactRouter.run(UI, req.url, function(Handler){
    var markup = React.renderToString(React.createElement(Handler));

    var fullMarkup = indexTemplate.replace("APP GOES HERE", markup);

    res.status(200).send(fullMarkup);
  });
});

app.listen(app.get("port"), function(){
  console.log("app is listening at port " + app.get("port"));
});
