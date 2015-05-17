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
  setAndGetInitialState: function(projects){
    this.state = {};

    if(projects){
      this.state.projects = projects;
    }
    else{
      this.state.projects = [];
      this.getProjects();
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

    Request({
      url: Config.apiEndpoints.projects,
      method: "GET",
      json: true
    }, function(err, res, body){
      this.loadingProjects = false;

      if(err){
        deferred.reject(err);
      }
      else{
        this.state = this.state || {};
        this.state.projects = body.projects;
        deferred.resolve(body.projects);
      }

      this.emit();
    }.bind(this));

    return deferred.promise;
  }
};

module.exports = Store;
