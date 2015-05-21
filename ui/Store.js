var Q = require("q"),
  Request = require("request"),
  Config = require("./Config");

var Store = {
  emit: function(){
    this.subscriptions = this.subscriptions || [];

    this.subscriptions.forEach(function(subscription){
      subscription(this.state);
    }.bind(this));
  },
  subscribe: function(cb){
    this.subscriptions = this.subscriptions || [];

    this.subscriptions.push(cb);
  },
  unsubscribe: function(cb){
    var index = this.subscriptions.indexOf(cb);

    this.subscriptions.splice(index, 1);
  },
  setAndGetInitialState: function(state){
    this.state = this.state || {};

    if(state){
      Object.keys(state).map(function(key){
        this.state[key] = state[key];
      }.bind(this));
    }

    return this.state;
  },
  giveState: function(){
    var stateJSON = JSON.stringify(this.state, function(key, value){
      switch(key){
        case "parent":
          return value.id;
        case "selectedMenuNode":
          return undefined;
        default:
          return value;
      }
    });

    prompt("Here's the state:", stateJSON);
  },
  takeState: function(){
    var stateJSON = prompt("Enter state JSON");

    this.state = JSON.parse(stateJSON);

    console.log(this.state)

    this.emit();
  },
  saveProject: function(project){
    var deferred = Q.defer();

    Request({
      url: Config.apiEndpoints.projects,
      method: "POST",
      json: true,
      body: project
    }, function(err, res, body){
      if(err){
        deferred.reject(err);
      }
      else{
        deferred.resolve(body.id);
      }
    });

    return deferred.promise;
  },
  getProjects: function(){
    var deferred = Q.defer();

    this.loadingProjects = true;
    this.emit();

    this.fetchProjects(function(err, res, body){
      this.loadingProjects = false;

      if(err || !body){
        deferred.reject(err);
      }
      else{
        this.state = this.state || {};

        this.state.projects = body.projects;

        deferred.resolve(this.state);
      }

      this.emit();
    }.bind(this));

    return deferred.promise;
  },
  fetchProjects: function(cb){
    Request({
      url: Config.apiEndpoints.projects,
      method: "GET",
      json: true
    }, cb);
  },
  signUp: function(username, password){
    var deferred = Q.defer();

    Request({
      url: Config.apiEndpoints.signUp,
      method: "POST",
      json: true,
      body: {username: username, password: password}
    }, function(err, res, body){
      if(err){
        deferred.reject(err);
      }
      else{
        deferred.resolve(body.err);
      }
    });

    return deferred.promise;
  },
  login: function(username, password){
    var deferred = Q.defer();

    Request({
      url: Config.apiEndpoints.login,
      method: "POST",
      json: true,
      body: {username: username, password: password}
    }, function(err, res, body){
      if(err && !body){
        deferred.reject(err || "body was falsy");
      }
      else{
        deferred.resolve(body.err);
      }
    });

    return deferred.promise;
  },
  setUsername: function(username){
    this.state = this.state || {};

    this.state.username = username;

    this.emit();
  },
  logout: function(){
    var deferred = Q.defer();

    Request({
      url: Config.apiEndpoints.logout
    }, function(err){
      if(!err){
        this.state.username = null;

        this.emit();

        deferred.resolve();
      }
      else{
        deferred.reject(err);
      }
    }.bind(this));

    return deferred.promise;
  },
  getUser: function(){
    var deferred = Q.defer();

    this.loadingUser = true;
    this.emit();

    this.fetchUser(function(err, res, body){
      this.loadingUser = false;

      if(err || !body){
        deferred.reject(err);
      }
      else{
        this.state = this.state || {};

        this.state.user = body.user;

        deferred.resolve(this.state);
      }

      this.emit();
    }.bind(this));

    return deferred.promise;
  },
  fetchUser: function(cookie, cb){
    Request({
      url: Config.apiEndpoints.whoami,
      method: "GET",
      json: true,
      headers: {
        Cookie: cookie
      }
    }, cb);
  },
  fetchProject: function(id, cb){
    Request({
      url: Config.apiEndpoints.projects,
      method: "GET",
      json: true,
      qs: {id: id}
    }, cb);
  },
  getProject: function(id){
    this.state = this.state || {};

    var deferred = Q.defer();

    this.state.loadingProject = true;
    this.emit();

    this.fetchProject(id, function(err, res, body){
      this.state.loadingProject = false;

      if(err || !body){
        deferred.reject(err);
      }
      else{
        this.state.project = body.project;

        deferred.resolve(this.state);
      }

      this.emit();
    }.bind(this));

    return deferred.promise;
  }
};

module.exports = Store;
