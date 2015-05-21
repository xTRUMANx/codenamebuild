var React = require("react"),
  ReactRouter = require("react-router"),
  Store = require("./Store"),
  ProgressBar = require("./ProgressBar"),
  Q = require("q");

var ProjectPage = React.createClass({
  mixins: [ReactRouter.State],
  statics: {
    fetchData: function(params, query, cookie){
      var deferred = Q.defer();

      var projectId = query.id;

      Store.fetchProject(projectId, function(err, res, body){
        if(err || !body){
          deferred.reject(err);
        }
        else{
          deferred.resolve(body.project);
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
    if(!this.props.data.projectPage){
      var projectId = this.getQuery().id;

      Store.getProject(projectId);

      return Store.setAndGetInitialState();
    }
    else{
      return Store.setAndGetInitialState({project: this.props.data.projectPage});
    }
  },
  render: function(){
    if(this.state.loadingProject){
      return <ProgressBar message="Loading Project" />;
    }

    return (
      <div>
        <h1>{this.state.project.name}</h1>
        <small>Created By {this.state.project.createdBy} on {this.state.project.createdOn}</small>
        <p className="lead">{this.state.project.description}</p>
      </div>
    );
  }
});

module.exports = ProjectPage;
