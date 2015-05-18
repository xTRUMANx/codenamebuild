var React = require("react"),
  ReactRouter = require("react-router"),
  Store = require("./Store"),
  ProgressBar = require("./ProgressBar");

var SignUpPage = React.createClass({
  mixins: [ReactRouter.Navigation],
  getInitialState: function(){
    return {};
  },
  signUp: function(e){
    e.preventDefault();

    var username = this.refs.username.getDOMNode().value,
      password = this.refs.password.getDOMNode().value;

    this.setState({signingUp: true, err: null});

    Store
      .signUp(username, password)
      .then(function(err){
        if(!err){
          Store.setUsername(username);

          this.transitionTo("root");
        }
        else{
          this.setState({signingUp: false, err: err});
        }
      }.bind(this));
  },
  render: function(){
    return (
      <div>
        <h2>Sign Up</h2>
        {this.state.err ? <p className="alert alert-danger">{this.state.err}</p> : null}
        <form onSubmit={this.signUp}>
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
            <input className="btn btn-primary" type="submit" value="Sign Up" disabled={this.state.signingUp} />
            {this.state.signingUp ? <ProgressBar message="Signing Up" /> : null}
          </div>
        </form>
      </div>
    );
  }
});

module.exports = SignUpPage;
