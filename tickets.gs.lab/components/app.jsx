var App = React.createClass({
	authCheck: function (g,u) {
		this.setState({ granted: g, user: u });
	},
	logout: function () {
		this.setState({ granted: false });
	},
	getInitialState: function () {
		return { granted: false, user: null }
	},
	render: function () {

		if (this.state.granted)
			return (<div onClick={this.logout}>{this.state.user}</div>);
		else 
			return (
				<div className="App flex f-midcen">
					<AuthBox onSubmit={this.authCheck} />
				</div>
			);
	}
});