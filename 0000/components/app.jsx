var App = React.createClass({

	mixins: [React.addons.LinkedStateMixin],

	// addNewMember: function () {
	// 	$.ajax({
	// 		type: 'post',
	// 		url: 'modules/member-new.php',
	// 		data: {
	// 			firstName: this.state.firstName,
	// 			lastName: this.state.lastName,
	// 			email: this.state.email,
	// 			telephone: this.state.telephone,
	// 			mobilePhone: this.state.mobilePhone
	// 		},
	// 		success: function (res) {

	// 			this.setState ({ view: 'member-info' });
				
	// 		}.bind(this)
	// 	});
	// },

	// memberSearch: function () {
	// 	this.setState ({
	// 		view: 'member-search',
	// 		data: { memberId: this.state.memberId, multi: false }
	// 	});
	// },

	// MemberFinder
	memberSearch: function (v,m) {
		this.setState ({ view: 'member-finder', data: { memberId: v, multi: m } })
	},

	getInitialState: function () {

		return { view: null, data: null }
	},

	render: function () {
		return (
			<div className="App flex">
				<Sidebar search={this.memberSearch} className="sidebar" />
				<Container view={this.state.view} data={this.state.data} className="container" />
			</div>
		);
	}

});