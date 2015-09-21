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
				<div className="App flex flex-align-center flex-justify-center">
					<div style={{textAlign:'right',marginRight:24}}>
						<div style={{fontSize:'18pt !important',letterSpacing:2,color:'#FFF',backgroundColor:'#F06292'}}>MOVIE SHOWTIMES</div>
						<div style={{marginBottom:12}}><i className="fa fa-user" style={{fontSize:'10pt !important',marginRight:6}}></i>{this.state.profile.fullName} | <span onClick={this.logout} style={{cursor:'pointer'}}>Logout</span></div>
						<MovieDatePicker current={this.state.dateSelected} onDateSelect={this.dateSelect} />
					</div>
					<MovieTimes current={this.state.dateSelected} onTimeSelect={this.timeSelect} />
					<MovieTickets onClose={this.closeLayout} show={this.state.showLayout} showtime={this.state.movieTimeSelected} pricing={this.state.Pricing} profile={this.state.profile} />
				</div>
			);
		}
		else 
			return (
				<div className="App flex flex-align-center flex-justify-center">
					<AuthBox onSubmit={this.authCheck} data-res={this.state.granted} />
				</div>
			);
	}
});