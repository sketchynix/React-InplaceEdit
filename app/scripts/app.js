var React = window.React = require('react'),
    InPlace = require("./ui/InPlace"),
    mountNode = document.getElementById("app");

var TestApp = React.createClass({
    getInitialState() {
        return {
            buttons: [],
            permission: true,
            value: 'im here',
            placeholder: 'placeholder test',
            fieldType: 'textarea'
        };
    },
    setValue(newValue) {
        this.setState({
            value: newValue
        });
    },
    render() {
        return (<div>
            <InPlace {...this.state} save={this.setValue} />
        </div>);
    }
});

React.render(<TestApp /> , mountNode);
