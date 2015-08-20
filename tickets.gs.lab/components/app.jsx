var App = React.createClass({

	authCheck: function (u,p) {
		$.ajax ({
			type: 'post',
			url: 'modules/common/auth.php',
			data: { post: {username: u, password: p} },
			dataType: 'json',
			success: function (res) {

				this.setState({ granted: res.granted, profile: res.profile });
				
			}.bind(this)
		});
	},

	logout: function () {
		this.setState({ granted: null, profile: null });
	},

	getInitialState: function () {
		return { granted: null, profile: null }
	},

	render: function () {

		if (this.state.granted)
			return (<div onClick={this.logout}>{this.state.profile}</div>);
		else 
			return (
				<div className="App flex f-midcen">
					<AuthBox onSubmit={this.authCheck} data-res={this.state.granted} />
				</div>
			);
	}
});