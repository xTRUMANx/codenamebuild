var React = require("react"),
  ReactRouter = require("react-router"),
  Store = require("./Store"),
  ProgressBar = require("./ProgressBar");

var LoginPage = React.createClass({
  mixins: [ReactRouter.Navigation],
  getInitialState: function(){
    return Store.setAndGetInitialState();
  },
  login: function(e){
    e.preventDefault();

    var username = this.refs.username.getDOMNode().value,
      password = this.refs.password.getDOMNode().value;

    this.setState({loggingIn: true, err: null});

    Store
      .login(username, password)
      .then(function(err){
        if(!err){
          Store.setUsername(username);

          this.transitionTo("root");
        }
        else{
          this.setState({loggingIn: false, err: err});
        }
      }.bind(this));
  },
  render: function(){
    return (
      <div>
        <h2>Login</h2>
        {this.state.err ? <p className="alert alert-danger">{this.state.err}</p> : null}
        <form onSubmit={this.login}>
          <div className="form-group">
            <label className="control-label">
              Username
            </label>
            <input className="form-control" ref="username" />
          </div>
          <div className="form-group">
            <label className="control-label">
              Password
            </label>
            <input className="form-control" type="password" ref="password" />
          </div>
          <div className="form-group">
            <input className="btn btn-primary" type="submit" value="Login" disabled={this.state.loggingIn} />
            {this.state.loggingIn ? <ProgressBar message="Logging In" /> : null}
          </div>
        </form>
      </div>
    );
  }
});

module.exports = LoginPage;
