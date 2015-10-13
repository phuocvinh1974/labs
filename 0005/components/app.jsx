var App = React.createClass({

	authCheck: function (u,p) {
		$.ajax ({
			type: 'post',
			url: 'modules/common/auth.php',
			data: { post: {username: u, password: p} },
			dataType: 'json',
			success: function (res) {
				this.state.granted = res.granted;
				this.state.profile = res.profile;
				this.state.dateSelected = new Date().Today() + 'T00:00:00.000Z';
				this.getPricing ();
				this.setState (); // render
			}.bind (this)
		});
	},

	getPricing: function () {
		$.ajax({
			type: 'post',
			url: 'modules/common/movie-pricing.php',
			dataType: 'json',
			success: function (res) {
				this.state.Pricing = res;
			}.bind (this)
		});
	},

	onDateSelect: function (d) {
		this.setState({ dateSelected: d });
	},

	onTimeSelect: function (t) {

		this.state.showtime = t;

		this.setState({ showLayout: true });
	},

	closeTicketLayout: function () {
		this.setState({showLayout:false,showtime:null});
	},

	logout: function () {
		this.replaceState ( this.getInitialState() );
	},

	getInitialState: function () {
		return {
			granted: null, profile: null,
			dateSelected: null,
			Pricing: null, showtime: null,
			showLayout: false }
	},

	render: function () {

		if (this.state.granted)
		{
			return (
				<div className="App flex flex-align-center flex-justify-center">
					<div style={{textAlign:'right',marginRight:24}}>
						<div style={{fontSize:'18pt !important',letterSpacing:2,color:'#FFF',backgroundColor:'#F06292'}}>MOVIE SHOWTIMES</div>
						<div style={{marginBottom:12}}><i className="fa fa-user" style={{fontSize:'10pt !important',marginRight:6}}></i>{this.state.profile.fullName} | <span onClick={this.logout} style={{cursor:'pointer'}}>Logout</span></div>
						<MovieDatePicker current={this.state.dateSelected} onDateSelect={this.onDateSelect} />
					</div>
					<MovieTimes current={this.state.dateSelected} onTimeSelect={this.onTimeSelect} />
					<MovieTickets onClose={this.closeTicketLayout} show={this.state.showLayout} showtime={this.state.showtime} pricing={this.state.Pricing} profile={this.state.profile} />
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