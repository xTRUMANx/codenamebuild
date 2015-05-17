var React = require("react"),
  ReactRouter = require("react-router"),
  Store = require("./Store");

var CreateProjectPage = React.createClass({
  mixins: [ReactRouter.Navigation],
  saveProject: function(e){
    e.preventDefault();

    var project= {
      name: this.refs.name.getDOMNode().value,
      description: this.refs.description.getDOMNode().value
    };

    Store.
      saveProject(project).
      then(function(id){
        this.transitionTo("projects", null, {id: id});
      }.bind(this)).
      fail(function(err){
        console.log(err);
      });
  },
  render: function(){
    return (
      <div>
        <h2>Start a Project</h2>

        <form onSubmit={this.saveProject}>
          <div className="form-group">
            <label className="control-label">Project Name</label>
            <input className="form-control" ref="name" />
          </div>
          <div className="form-group">
            <label className="control-label">Project Description</label>
            <textarea className="form-control" ref="description" />
          </div>
          <div className="form-group">
            <input className="btn btn-primary" type="submit" value="Start Project" />
          </div>
        </form>
      </div>
    );
  }
});

module.exports = CreateProjectPage;
