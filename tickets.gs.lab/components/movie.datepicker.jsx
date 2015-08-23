var MovieDatePicker = React.createClass({
	
	getCalendar: function () {
		$.ajax({
			type: 'post',
			url: 'modules/common/movie-calendar.php',
			dataType: 'json',
			success: function (res) {

				if (res.error) {
					this.setState( res )
					return;
				}

				var a = [];
				
				for (var i in res) {
					var d = new Date(res[i].date.sec * 1000);
                    var t = d.toDMString() === new Date().toDMString() ? "TODAY" : d.toDMString();

                    a.push({ date: d.toISOString(), label: t });
				}

				this.setState({ days: a });

			}.bind(this)
		});
	},
	
	handleClick: function (d) {
		this.props.onDateSelect (d);
	},

	getInitialState: function () {
		return { days: [] };
	},

	componentDidMount: function () {
		this.getCalendar ();
	},

	render: function () {

		if (this.state.error) {
			return (<div>{this.state.error_msg}</div>);
		}

		if ( this.state.days.length ) {

			return (
				<div className="movie-datepicker">
				{
					this.state.days.map( function (v) {
						return (
							<div onClick={this.handleClick.bind(this, v.date)} data-isselected={v.date===this.props.current ? true : false}>
								<span>{new Date(v.date).toDayNameString()}</span>
								<span><i className="fa fa-angle-right"></i></span>
								<span>{v.label}</span>
							</div>
						);
					}.bind(this))
				}
				</div>
			);

		} else
			return (<div>movie.datepicker | loading | error | nothing</div>); 
	}
});