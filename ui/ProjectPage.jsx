var React = require("react"),
  ReactRouter = require("react-router");

var ProjectPage = React.createClass({
  mixins: [ReactRouter.State],
  render: function(){
    return (
      <h1>Project Id: {this.getQuery().id}</h1>
    );
  }
});

module.exports = ProjectPage;
