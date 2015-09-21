var AuthBox = React.createClass({
	
	mixins: [React.addons.LinkedStateMixin],

	getInitialState: function () {
		return { username: 'admin', password: 'admin' }
	},

	render: function () {

		var msg = null;

		if (this.props['data-res']!==null) {
			msg = this.props['data-res'] ? null : (<div><i className="fa fa-exclamation-triangle" style={{color:'#FF0',fontSize:'12pt !important',marginTop:12}}></i></div>);
		}

		return (
			<div className="AuthBox flex flex-direction-column flex-align-center flex-justify-center">
				<div><i className="fa fa-lock" style={{color:'#FFF',fontSize:'18pt !important'}}></i></div>
				<div style={{marginTop:24,fontSize:'18pt !important',letterSpacing:2,color:'#FFF'}}>LOGIN</div>
				<div style={{marginBottom:2}}><input type="text" valueLink={this.linkState('username')} placeholder="enter Username" style={{textAlign:'center'}} /></div>
				<div style={{marginBottom:8}}><input type="password" valueLink={this.linkState('password')} placeholder="and Password" style={{textAlign:'center'}} /></div>
				<div style={{marginBottom:4}}><button onClick={this.props.onSubmit.bind(this,this.state.username,this.state.password)}>submit</button></div>
				{msg}
			</div>
		);
	}
});