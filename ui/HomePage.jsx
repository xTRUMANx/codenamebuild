var React = require("react"),
  ProjectCard = require("./ProjectCard"),
  Store = require("./Store");

var HomePage = React.createClass({
  componentWillMount: function(){
    Store.subscribe(this.resetState);
  },
  resetState: function(newState){
    this.setState(newState);
  },
  getInitialState: function(){
    return Store.setAndGetInitialState();
  },
  render: function(){
    projectCards = this.state.projects.map(function(project){
      return <ProjectCard key={project.id} project={project} />
    });

    var startAProjectCard = (
      <div key={0} className="col-sm-4">
        <p>Couldn't find something of interest?</p>
        <a className="btn btn-lg btn-primary" href="/projects/create">Start a Project</a>
      </div>
    );

    projectCards.push(startAProjectCard);

    return (
      <div className="container">
        <h1 className="text-center">Codename: Build</h1>
        <p className="lead text-center">Share your idea and bring your vision to life</p>
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
        {projectCards}
      </div>
    );
  }
});

module.exports = HomePage;
