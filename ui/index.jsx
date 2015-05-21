var React = require("react"),
  ReactRouter = require("react-router"),
  RouteHandler = ReactRouter.RouteHandler,
  Route =  ReactRouter.Route,
  DefaultRoute =  ReactRouter.DefaultRoute,
  Link =  ReactRouter.Link,
  HomePage = require("./HomePage"),
  ProjectPage = require("./ProjectPage"),
  SignUpPage = require("./SignUpPage"),
  LoginPage = require("./LoginPage"),
  LogoutPage = require("./LogoutPage"),
  CreateProjectPage = require("./CreateProjectPage"),
  Q = require("q"),
  Store = require("./Store");

var App = React.createClass({
  statics: {
    fetchData: function(params, query, cookie){
      var deferred = Q.defer();

      Store.fetchUser(cookie, function(err, res, body){
        if(err || !body){
          deferred.reject(err);
        }
        else{
          deferred.resolve(body.user);
        }
      });

      return deferred.promise;
    }
  },
  componentDidMount: function(){
    Store.subscribe(this.resetState);
  },
  componentWillUnmount: function(){
    Store.unsubscribe(this.resetState);
  },
  resetState: function(newState){
    this.setState(newState);
  },
  getInitialState: function(){
    if(!this.props.data.root){
      Store.getUser();

      return Store.setAndGetInitialState();
    }
    else{
      return Store.setAndGetInitialState(this.props.data.root);
    }
  },
  render: function(){
    var authenticatedLinks = (
      <ul className="nav navbar-nav navbar-right">
        <li>
          <Link to="logout">Logout</Link>
        </li>
      </ul>
    );

    var unauthenticatedLinks = (
      <ul className="nav navbar-nav navbar-right">
        <li>
          <Link to="signup">Sign Up</Link>
        </li>
        <li>
          <Link to="login">Login</Link>
        </li>
      </ul>
    );

    return  (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <Link className="navbar-brand" to="root">Codename: Build</Link>
            </div>
            {this.state.username ? authenticatedLinks : unauthenticatedLinks}
          </div>
        </nav>
        <div className="container">
          <RouteHandler {...this.props} />
          <script id="data" type="text" dangerouslySetInnerHTML={{__html: JSON.stringify(this.props.data)}} />
        </div>
      </div>
    );
  }
});

var routes = (
  <Route name="root" path="/" handler={App}>
    <DefaultRoute name="home" handler={HomePage} />
    <Route name="projects">
      <DefaultRoute name="projectPage" handler={ProjectPage} />
      <Route name="createProject" handler={CreateProjectPage} />
    </Route>
    <Route name="logout" handler={LogoutPage} />
    <Route name="login" handler={LoginPage} />
    <Route name="signup" handler={SignUpPage} />
  </Route>
);

if(typeof window !== "undefined"){
  window.onload = function(){
    window.Store = Store;

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
