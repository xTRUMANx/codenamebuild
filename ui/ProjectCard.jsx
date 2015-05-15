var React = require("react"),
  ReactRouter = require("react-router"),
  Link = ReactRouter.Link;

var ProjectCard = React.createClass({
  render: function(){
    var project = this.props.project;

    return (
      <div className="col-xs-6 col-sm-4 col-lg-3">
        <Link to="project" query={{id: project.id}}><h4>{project.title}</h4></Link>
        <p>{project.description}</p>
        <p>{project.membersCount} {project.membersCount === 1 ? "member" : "members"}</p>
        <hr />
      </div>
    );
  }
});

module.exports = ProjectCard;
