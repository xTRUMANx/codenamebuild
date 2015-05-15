var React = require("react"),
  ReactRouter = require("react-router"),
  RouteHandler = ReactRouter.RouteHandler,
  Route =  ReactRouter.Route,
  DefaultRoute =  ReactRouter.DefaultRoute,
  HomePage = require("./HomePage"),
  ProjectPage = require("./ProjectPage");

var App = React.createClass({
  render: function(){
    return (
      <RouteHandler />
    );
  }
});

var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={HomePage} />
    <Route name="project" handler={ProjectPage} />
  </Route>
);

if(typeof window !== "undefined"){
  window.onload = function(){
    console.log("running router")
    ReactRouter.run(routes, ReactRouter.HistoryLocation, function(Handler){
      React.render(<Handler />, document.getElementById("app-container"));
    });
  }
}

module.exports = routes;
