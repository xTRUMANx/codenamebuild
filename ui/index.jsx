var React = require("react"),
  ReactRouter = require("react-router"),
  RouteHandler = ReactRouter.RouteHandler,
  Route =  ReactRouter.Route,
  DefaultRoute =  ReactRouter.DefaultRoute,
  HomePage = require("./HomePage"),
  ProjectPage = require("./ProjectPage"),
  CreateProjectPage = require("./CreateProjectPage"),
  Q = require("q");

var App = React.createClass({
  render: function(){
    return  (
      <div className="container">
        <h1 className="text-center">Codename: Build</h1>
        <p className="lead text-center">Share your idea and bring your vision to life</p>
        <RouteHandler {...this.props} />
        <script id="data" type="text" dangerouslySetInnerHTML={{__html: JSON.stringify(this.props.data)}} />
      </div>
    );
  }
});

var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute name="home" handler={HomePage} />
    <Route name="projects">
      <DefaultRoute handler={ProjectPage} />
      <Route name="createProject" handler={CreateProjectPage} />
    </Route>
  </Route>
);

if(typeof window !== "undefined"){
  window.onload = function(){
    ReactRouter.run(routes, ReactRouter.HistoryLocation, function(Handler, state){
      var data = JSON.parse(document.getElementById("data").innerHTML);

      React.render(<Handler data={data} />, document.getElementById("app-container"));
    });
  }
}

function fetchData(routes, params, query, cookie) {
  return Q.all(routes.reduce(function (promises, route) {
    promises.push(route.handler.fetchData ? route.handler.fetchData(params, query, cookie) : null);

    return promises;
  }, []));
}

module.exports = {
  routes: routes,
  fetchData: fetchData
};
