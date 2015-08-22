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

	dateSelect: function (d) {
		this.setState({ dateSelected: d });
	},

	logout: function () {
		this.setState({ granted: null, profile: null });
	},

	getInitialState: function () {
		return { granted: null, profile: null, dateSelected: new Date().Today() + 'T00:00:00.000Z' }
	},

	render: function () {

		if (this.state.granted)
		{
			return (
				<div className="App flex f-midcen">
					<div style={{textAlign:'right',marginRight:12}}>
						<div style={{fontSize:'18pt !important',letterSpacing:2}}>MOVIE SHOWTIMES</div>
						<div onClick={this.logout}>{this.state.profile.fullName}</div>
						<MovieDatePicker current={this.state.dateSelected} onDateSelect={this.dateSelect} />
					</div>
				</div>
			);
		}
		else 
			return (
				<div className="App flex f-midcen">
					<AuthBox onSubmit={this.authCheck} data-res={this.state.granted} />
				</div>
			);
	}
});