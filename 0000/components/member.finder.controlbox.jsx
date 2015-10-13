var MemberFinderControlBox = React.createClass({

	mixins: [React.addons.LinkedStateMixin],

	memberFinder: function () {
		this.props.search(this.state.memberId, this.state.multi)
	},

	getInitialState: function () {

		return { 
			memberId: null, multi: false
		}

	},

	render: function () {
		return (
			<div style={{marginTop:24}}>
				<div><input type="text" valueLink={this.linkState('memberId')} placeholder="Enter Member ID" /></div>
				<button onClick={this.memberFinder} style={{marginTop:2}}>SEARCH</button>
			</div>
		);
	}
});