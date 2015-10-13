var Container = React.createClass({
	render: function () {

		switch (this.props.view)
		{
			case 'member-finder':
				if (this.props.data.multi)
				{
					return <MemberList />
				}
				else
				{
					return <MemberInfo data={this.props.data} />
				}
			break;

			default: 
				return (<div>...</div>)
			break;
		}
	}
});