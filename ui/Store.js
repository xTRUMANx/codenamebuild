var Store = {
  emit: function(){
    this.subscriptions = this.subscriptions || [];

    this.subscriptions.forEach(function(subscription){
      subscription(this.state);
    }.bind(this));
  },
  subscribe: function(cb){
    this.subscriptions = this.subscriptions || [];

    this.subscriptions.push(cb);
  },
  setAndGetInitialState: function(){
    this.projects = [
      {id: 1, title: "Project 1", description: "First Project", membersCount: 6},
      {id: 2, title: "Project 2", description: "Second Project", membersCount: 12},
      {id: 3, title: "Project 3", description: "Third Project", membersCount: 24},
      {id: 4, title: "Project 4", description: "Fourth Project", membersCount: 20},
      {id: 5, title: "Project 5", description: "Fifth Project", membersCount: 19}
    ];

    return {
      projects: this.projects
    };
  },
  giveState: function(){
    var stateJSON = JSON.stringify(this.state, function(key, value){
      switch(key){
        case "parent":
          return value.id;
        case "selectedMenuNode":
          return undefined;
        default:
          return value;
      }
    });

    prompt("Here's the state:", stateJSON);
  },
  takeState: function(){
    var stateJSON = prompt("Enter state JSON");

    this.state = JSON.parse(stateJSON);

    console.log(this.state)

    this.emit();
  }
};

module.exports = Store;
