var React = require("react"),
  ReactRouter = require("react-router"),
  Link = ReactRouter.Link,
  ProjectCard = require("./ProjectCard"),
  Store = require("./Store"),
  MasonryMixin = require('react-masonry-mixin'),
  ProgressBar = require("./ProgressBar"),
  Q = require("q");

var HomePage = React.createClass({
  mixins: [MasonryMixin('masonryContainer', {})],
  statics: {
    fetchData: function(){
      var deferred = Q.defer();

      Store.fetchProjectData(function(err, res, body){
        if(err || !body){
          deferred.reject(err);
        }
        else{
          deferred.resolve(body.projects);
        }
      });

      return deferred.promise;
    }
  },
  componentWillMount: function(){
    Store.subscribe(this.resetState);
  },
  resetState: function(newState){
    this.setState(newState);
  },
  getInitialState: function(){
    return Store.setAndGetInitialState(this.props.data.home);
  },
  render: function(){
    projectCards = this.state.projects.map(function(project){
      return <ProjectCard key={project.id} project={project} />
    });

    var startAProjectCard = (
      <div key={0} className="col-xs-6 col-sm-4 col-lg-3">
        <p>Couldn't find something of interest?</p>
        <Link className="btn btn-lg btn-primary" to="createProject">Start a Project</Link>
      </div>
    );

    projectCards.push(startAProjectCard);

    return (
      <div>
        <h2>TODO</h2>
        <ul>
          <li>Submit a project</li>
          <li>Browse submitted projects</li>
          <li>View a particular project in detail</li>
          <li>Join a project</li>
          <li>Discuss and collaborate with others in your project. Kind of like a subreddit or a forum.</li>
        </ul>
        <h2 className="text-center">Projects</h2>
        <input className="form-control" placeholder="Find a project..." />
        <div ref="masonryContainer">
          {Store.loadingProjects ? <ProgressBar message="Loading Projects" /> : null}
          {projectCards}
        </div>
      </div>
    );
  }
});

module.exports = HomePage;
