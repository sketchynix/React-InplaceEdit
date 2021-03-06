'use strict';

var React = require('react');

var InPlace = React.createClass({
	propTypes: {
		value: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		containerClass: React.PropTypes.string,
		permission: React.PropTypes.oneOfType([
  			React.PropTypes.bool,
  			React.PropTypes.func
      	]),
		fieldType: React.PropTypes.oneOf(['input', 'textarea']),
		inputType: React.PropTypes.string,
		save: React.PropTypes.func,
		updateOnChange: React.PropTypes.bool,
		buttons: React.PropTypes.array
	},
	getInitialState() {
		return {
			inputVisible: false,
			draft: this.props.value,
			mouseIsDownInComponent: false
		};
	},
	componentDidMount() {
  		window.addEventListener('mousedown', this.pageClick, false);
	},
	componentWillUnmount() {
		window.removeEventListener('mousedown', this.pageClick)
	},
	pageClick (event) {
		if (!this.state.mouseIsDownInComponent && this.state.inputVisible){
			this.saveDraft();
			this.hideInput();
		}
	},
	mouseDownHandler() {
 		this.state.mouseIsDownInComponent = true;
	},
	mouseUpHandler() {
 		this.state.mouseIsDownInComponent = false;
	},
	hasPermission(){
		return (typeof this.props.permission === "function") ? this.props.permission() : this.props.permission;
	},
	/**
	 * Show the input and focus in on it
	 */
	showInput() {
		if(this.hasPermission()){
			this.setState({ inputVisible: true }, function(){
				React.findDOMNode(this.refs.inplaceInput).focus();
				React.findDOMNode(this.refs.inplaceInput).select();
			});
		}
	},
	hideInput() {
		this.setState({ inputVisible: false });
	},
	saveDraftToValue() {
		//we specified the save property, if passed in, will be a function
		if(this.hasPermission() && this.props.save){
			this.props.save(this.state.draft);
		} else {
			//set the value--- this is immutable in theory
			//need to look up how to do this properly in react
			//this.value = scope.draft;
		}
		this.hideInput();
	},
	saveDraft(val){
		this.state.draft = val ? val : React.findDOMNode(this.refs.inplaceInput).value;
	},
	saveOnChange(event){
		this.saveDraft(event.target.value);

		if(this.props.updateOnChange){
			this.saveDraftToValue();
		}
	},
	save(){
		this.saveDraft();

		this.saveDraftToValue();
	},
	cancelEdit(event) {
		this.state.draft = this.props.value;
       	//hide the input
		this.hideInput();
	},
	onKeyPress(event){
		if(event.keyCode === 13 || event.which === 13 && this.props.fieldType !== 'textarea'){
			this.save();
		}
	},
	/**
	 * isEditing input shouuld be the draft value
	 * @return {[type]} [description]
	 */
	render() {
		/**
		 * Extra buttons to show
		 */
		let buttons = !this.props.buttons ? '' : this.props.buttons.map(function (btn) {
			return <button onClick={button.action} className={button.cssClass}>{button.text}</button>
		});

		let inputType = this.props.inputType ? this.props.inputType : 'text';
		/**
		 * Set the classname to use on the container
		 * @type {string}
		 */
		let containerClassName = this.props.containerClass ? '' : 'fn-editable-wrap';

		let valueOrPlaceholderTemplate = this.props.value ?
			<span onClick={this.showInput}>{this.props.value}</span> :
			<span onClick={this.showInput}>{this.props.placeholder}</span>;

		let editTemplate = this.state.inputVisible ? '' : valueOrPlaceholderTemplate;

		/**
		 * Are we using an input box or textarea
		 * @type {template}
		 */
		let inputTemplate = this.props.fieldType === 'textarea' ?
			<textarea defaultValue={this.state.draft}
					onPaste={this.saveOnChange}
					onBlur={this.saveOnChange}
					onChange={this.saveOnChange} ref="inplaceInput"  />
					:
			<input type={inputType} defaultValue={this.state.draft}
					onPaste={this.saveOnChange}
					onBlur={this.saveOnChange}
					onChange={this.saveOnChange} ref="inplaceInput"  />

		let isEditing = !this.state.inputVisible ? '' :
			<div onKeyPress={this.onKeyPress}>
				{inputTemplate}
				<div>
					<button onClick={this.save}>Save</button>
					<button onClick={this.cancelEdit}>Cancel</button>
					{buttons}
				</div>
			</div>;

		return <div className={containerClassName} onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler}>
			{editTemplate}
			{isEditing}
		</div>
	}
});

module.exports = InPlace;