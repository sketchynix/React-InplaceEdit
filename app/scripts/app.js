
var React = window.React = require('react'),
    InPlace = require("./ui/InPlace"),
    mountNode = document.getElementById("app");

var TestApp = React.createClass({
  getInitialState: function() {
    return {
        buttons: [],
        text: '',
        permission: true
      };
  },
  render: function() {
    return (
      <div>
        <InPlace placeholder="test" permission={this.state.permission} />
      </div>
    );
  }
});


React.render(<TestApp />, mountNode);

