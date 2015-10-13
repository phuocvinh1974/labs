var Sidebar = React.createClass({

	memberSearch: function (v,m) {
		this.props.search(v,m)
	},

	render: function () {
		return (
			<div className="sidebar">
				<div style={{fontSize:'18pt !important',color:'#FFF',backgroundColor:'#BA68C8'}}>MEMBERS ZONE</div>
				<MemberFinderControlBox search={this.memberSearch} />
				<MemberQuickAddControlBox />
			</div>
		);
	}

});