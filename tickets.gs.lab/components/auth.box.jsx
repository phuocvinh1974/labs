var AuthBox = React.createClass({
	onSubmit: function () {

		$.ajax ({
			type: 'post',
			url: 'modules/common/auth.php',
			dataType: 'json',
			success: function (res) {

				if (res.granted) {
					this.state.granted = true;
					this.state.user = res.profile;
				}
				else this.state.granted = false;

				this.props.onSubmit (this.state.granted, this.state.user);

			}.bind(this)
		});
	},
	getInitialState: function () {
		return { granted: null , user: null }
	},
	render: function () {

		var ex = null;

		if (this.state.granted!==null) {
			ex = this.state.granted ? null : (<div><i className="fa fa-exclamation-triangle" style={{color:'#FF0',fontSize:'12pt !important',marginTop:12}}></i></div>);
		}

		return (
			<div className="AuthBox flex f-column f-midcen">
				<div><i className="fa fa-lock" style={{color:'#FFF',fontSize:'18pt !important'}}></i></div>
				<div style={{marginTop:24,fontSize:'18pt !important',letterSpacing:2,color:'#FFF'}}>LOGIN</div>
				<div style={{marginBottom:2}}><input placeholder="enter Username" style={{textAlign:'center'}} /></div>
				<div style={{marginBottom:8}}><input type="password" placeholder="and Password" style={{textAlign:'center'}} /></div>
				<div style={{marginBottom:4}}><button onClick={this.onSubmit}>submit</button></div>
				{ex}
			</div>
		);
	}
});