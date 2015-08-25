var MovieTickets = React.createClass({

	render: function () {

		if (this.props.show)
			return (
				<div className="layout-fit flex f-midcen">
					<div className="layout-box">
						<div onClick={this.props.onClose} style={{textAlign:'right'}}><i className="fa fa-close" style={{cursor:'pointer'}}></i></div>
						<div className="flex">
							<div style={{fontSize:'24px !important',color:'#999',marginLeft:12,marginRight:12}}>{this.props.showtime.format}</div>
							<div>
								<div>{this.props.showtime.IntTitle}</div>
								<div style={{color:'#999'}}>{this.props.showtime.Title}</div>
							</div>
							<div className="flex">
								<div style={{marginRight:12,color:'#999'}}>P. {this.props.showtime.room}</div>
								<div style={{marginRight:12,color:'#999'}}>{new Date(this.props.showtime.date).toDayNameString()}</div>
								<div style={{textAlign:'center',color:'#ccc',marginRight:12}}><i className="fa fa-clock-o"></i></div>
							</div>
							<div>
								<div style={{fontWeight:'bold',color:'#0288D1'}}>{parseInt(this.props.showtime.start).toHMTString()}</div>
								<div style={{color:'#999',marginRight:12}}>{new Date(this.props.showtime.date).toDMString()}</div>
							</div>
						</div>
					</div>
				</div>
			);
		else
			return null;
	}
});

var SeatingPlanLayout = React.createClass({

	render: function () {
		return null;
	}
});