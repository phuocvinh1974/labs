var MemberQuickAddControlBox = React.createClass({

	mixins: [React.addons.LinkedStateMixin],

	addNewMember: function () {
		$.ajax({
			type: 'post',
			url: 'modules/member-new.php',
			data: {
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				email: this.state.email,
				telephone: this.state.telephone,
				mobilePhone: this.state.mobilePhone
			},
			success: function (res) {

				this.setState ({ view: 'member-info' });
				
			}.bind(this)
		});
	},

	getInitialState: function () {
		return {
			firstName: null, lastName: null,
			email: null, telephone: null, mobilePhone: null
		}
	},

	render: function () {
		return (
			<div style={{marginTop:24}}>
				<div>Add New Member</div>
				<div><input type="text" valueLink={this.linkState('firstName')} placeholder="First Name" /></div>
				<div style={{marginTop:2}}><input type="text" valueLink={this.linkState('lastName')} placeholder="Last Name" /></div>
				<div style={{marginTop:2}}><input type="text" valueLink={this.linkState('email')} placeholder="Email" /></div>
				<div style={{marginTop:2}}><input type="text" valueLink={this.linkState('telephone')} placeholder="Telephone" /></div>
				<div style={{marginTop:2}}><input type="text" valueLink={this.linkState('mobilePhone')} placeholder="MobilePhone" /></div>
				<button onClick={this.addNewMember} style={{marginTop:2}}>ADD</button>
			</div>
		);
	}
});