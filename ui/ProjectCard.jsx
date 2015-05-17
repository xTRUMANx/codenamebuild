var React = require("react"),
  ReactRouter = require("react-router"),
  Link = ReactRouter.Link;

var ProjectCard = React.createClass({
  render: function(){
    var project = this.props.project;

    return (
      <div className="col-xs-6 col-sm-4 col-lg-3">
        <Link to="projects" query={{id: project.id}}><h4>{project.name}</h4></Link>
        <p>{project.description}</p>
        <hr />
      </div>
    );
  }
});

module.exports = ProjectCard;
