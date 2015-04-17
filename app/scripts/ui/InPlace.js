'use strict';

var React = require('react');

var InPlace = React.createClass({
	propTypes: {
		permission: React.PropTypes.bool,
		value: React.PropTypes.node,
		containerClass: React.PropTypes.string,
		button: React.PropTypes.array,
		inputType: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		save: React.PropTypes.func
	},
	getInitialState() {
		return {
			inputVisible: false,
			draft: ''
		};
	},
	showInput() {
		this.setState({ inputVisible: !this.state.inputVisible }, function(){
			React.findDOMNode(this.refs.inplaceInput).focus();
		});
	},
	hideInput() {
		this.setState({ inputVisible: false });
	},
	saveEdit() {
		if(this.props.permission){
			if(_.isFunction(this.props.save)){
				this.props.save(draft);
			} else {
				//set the value--- this is immutable in theory
				//need to look up how to do this properly in react

				//this.value = scope.draft;
			}
			this.hideInput();
		}
	},
	cancelEdit() {
		//scope.draft = scope.value;

       	//hide the input
		this.hideInput();
	},
	/**
	 * isEditing input shouuld be the draft value
	 * @return {[type]} [description]
	 */
	render() {
		var buttons = !this.props.buttons ? '' : this.props.buttons.map(function (btn) {
			return <button onClick="button.action" className={button.cssClass}>{button.text}</button>
		});

		var draftTemplate = this.props.value > 0 ?
			<span onClick={this.showInput}>{this.props.value}</span> :
			<span onClick={this.showInput}>{this.props.placeholder}</span>;

		var editTemplate = this.state.inputVisible ? '' : draftTemplate;

		var isEditing = !this.state.inputVisible ? '' :
			<div>
				<input type="text" value="" ref="inplaceInput" />
				<div>
					<button onClick={this.saveEdit}>Save</button>
					<button onClick={this.cancelEdit}>Cancel</button>
					{buttons}
				</div>
			</div>;

		return <div>
			{editTemplate}
			{isEditing}
		</div>
	}
});

module.exports = InPlace;