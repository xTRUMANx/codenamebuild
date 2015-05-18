var React = require("react"),
  ReactRouter = require("react-router"),
  Store = require("./Store"),
  ProgressBar = require("./ProgressBar");

var LogoutPage = React.createClass({
  mixins: [ReactRouter.Navigation],
  componentDidMount: function(){
    Store.
      logout().
      then(function(){
        this.transitionTo("root");
      }.bind(this)).
      fail(function(err){
        console.log(err)
      });
  },
  render: function(){
    return (
      <ProgressBar message="Logging out" />
    );
  }
});

module.exports = LogoutPage;
