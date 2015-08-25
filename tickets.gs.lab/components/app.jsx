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

	getPricing: function () {

		$.ajax({
			type: 'post',
			url: 'modules/common/movie-pricing.php',
			dataType: 'json',
			success: function (res) {
				this.state.Pricing = res;
			}.bind(this)
		});
	},

	dateSelect: function (d) {
		this.setState({ dateSelected: d });
	},

	timeSelect: function (t) {

		this.state.movieTimeSelected = t;

		this.setState({ showLayout: true });
	},

	closeLayout: function () {
		this.setState({ showLayout: false, movieTimeSelected: null });
	},

	logout: function () {
		this.setState({ granted: null, profile: null });
	},

	getInitialState: function () {
		return {
			granted: null, profile: null,
			dateSelected: new Date().Today() + 'T00:00:00.000Z',
			Pricing: null, movieTimeSelected: null,
			showLayout: false }
	},

	componentWillMount: function () {
		this.getPricing ();
	},

	render: function () {

		if (this.state.granted)
		{
			return (
				<div className="App flex f-midcen">
					<div style={{textAlign:'right',marginRight:24}}>
						<div style={{fontSize:'18pt !important',letterSpacing:2,color:'#FFF',backgroundColor:'#2196F3'}}>MOVIE SHOWTIMES</div>
						<div><i className="fa fa-user" style={{fontSize:'10pt !important',marginRight:6}}></i>{this.state.profile.fullName} | <span onClick={this.logout} style={{cursor:'pointer'}}>Logout</span></div>
						<div style={{marginBottom:12}}></div>
						<MovieDatePicker current={this.state.dateSelected} onDateSelect={this.dateSelect} />
					</div>
					<MovieTimes current={this.state.dateSelected} onTimeSelect={this.timeSelect} />
					<MovieTickets show={this.state.showLayout} onClose={this.closeLayout} showtime={this.state.movieTimeSelected} />
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