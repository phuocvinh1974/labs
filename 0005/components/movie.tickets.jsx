var MovieTickets = React.createClass({

	resSeatsPaid: function (s) {
		this.state.seatsPaid = s;
	},

	onSeatSelect: function (n) {

		if (!this.state.seatsSelected[n])
			this.state.seatsSelected[n] = true;
		else
			delete this.state.seatsSelected[n];
	},

	seatsConfirm: function () {

		if (!Object.keys(this.state.seatsSelected).length)
		return;

		var data = { infos: this.props.showtime, seats: $.extend(this.state.seatsSelected, this.state.seatsPaid) };

		$.ajax({
			type: 'post',
			url: 'modules/tickets/seats-saving.php',
			data: { post: data },
			success: function (res) {

				this.setState({ layoutReload: true });
				
			}.bind(this)
		});
	},

	closeLayout: function () {
		this.props.onClose ()
	},

	getInitialState: function () {
		return { seatsSelected: {}, seatsPaid: {}, layoutReload: false };
	},

	render: function () {

		if (this.props.show)
			return (
				<div className="layout-fit flex f-midcen">
					<div className="layout-box">
						<div onClick={this.closeLayout} style={{textAlign:'right',marginBottom:6}}><i className="fa fa-close" style={{cursor:'pointer'}}></i></div>
						<div className="flex f-space" style={{borderTop:'dotted 1px #EEE',borderBottom:'dotted 1px #EEE',paddingTop:6,paddingBottom:6}}>
							<div className="flex f-midcen">
								<div style={{fontSize:'24px !important',color:'#999',marginLeft:12,marginRight:12}}>{this.props.showtime.format}</div>
								<div>
									<div>{this.props.showtime.IntTitle}</div>
									<div style={{color:'#999'}}>{this.props.showtime.Title}</div>
								</div>
							</div>
							<div className="flex f-midcen">
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
						<div style={{textAlign:'center',color:'#999',letterSpacing:5,marginTop:24}}>SCREEN</div>
						<SeatingPlanLayout showtime={this.props.showtime} onSeatSelect={this.onSeatSelect} resSeatsPaid={this.resSeatsPaid} reload={this.layoutReload} />
						<div>
							<button onClick={this.seatsConfirm}>CONFIRM</button>
							<button>PRINT</button>
						</div>
					</div>
				</div>
			);
		else
			return null;
	}
});

var SeatingPlanLayout = React.createClass({

	loadSeatingPlan: function (n,callback) {

		$.ajax({
			type: 'post',
			url: 'modules/tickets/seats-loading.php',
			data: { data: this.props.showtime },
			dataType: 'json',
			success: function (res) {

				var seating_plan = {};

				this.props.resSeatsPaid (res);

				// room 1
				if (parseInt(n)===1)
				{

					var vip_seating = {
						F6:true,F7:true,F8:true,F9:true,F10:true,F11:true,F12:true,F13:true,
						G6:true,G7:true,G8:true,G9:true,G10:true,G11:true,G12:true,G13:true,
						H6:true,H7:true,H8:true,H9:true,H10:true,H11:true,H12:true,H13:true
					};

					for (var r = 0; r < 10; r ++) { // rows

						var row = String.fromCharCode(65+r);

						seating_plan[r] = {}; 
						
						for (var i = 1; i <= 17; i++) {
							var stat = res[row+i];
							seating_plan[r][row+i] = { status: stat===undefined ? 'available' : stat['status'], type: vip_seating[row+i] ? 'P' : 'N' }
						}
					}

				}

				// room 2-3
				else
				{

					var vip_seating = {
						E4:true,E5:true,E6:true,E7:true,E8:true,E9:true,
						F4:true,F5:true,F6:true,F7:true,F8:true,F9:true,
						G4:true,G5:true,G6:true,G7:true,G8:true,G9:true
					};
					
					for (var r = 0; r < 10; r ++) { // rows

						var row = String.fromCharCode(65+r);

						seating_plan[r] = {}; 
						
						for (var i = 1; i <= 12; i++) {
							var stat = res[row+i];
							seating_plan[r][row+i] = { status: stat===undefined ? 'available' : stat['status'], type: vip_seating[row+i] ? 'P' : 'N' }
						}
					}

				}

				this.state.seatingPlan = seating_plan;

				callback ();

			}.bind (this)
		});
	},

	onSeatSelect: function (row,n,e) {

		var status = this.state.seatingPlan[row][n]['status'];

		if (status==='paid') return;

		status = status === 'selected' ? 'available' : 'selected';
		this.state.seatingPlan[row][n]['status'] = status;		

		e.target.setAttribute('data-status', status);

		this.props.onSeatSelect (n);
	},

	componentWillMount: function () {
		this.loadSeatingPlan (this.props.showtime.room, function () {
			this.forceUpdate();
		}.bind (this))
	},

	componentWillReceiveProps: function () {
		this.loadSeatingPlan (this.props.showtime.room, function () {
			this.forceUpdate();
		}.bind (this))
	},

	shouldComponentUpdate: function () {
		return false;
	},

	getInitialState: function () {
		return { seatingPlan: null };
	},

	render: function () {

		if (this.state.seatingPlan) {

			return (
				<div className="flex flex-direction-column flex-align-center">
				{
					Object.keys(this.state.seatingPlan).map( function (row) { // seating rows

						var seats = Object.keys(this.state.seatingPlan[row]).map( function (n) {
							
							var seat = this.state.seatingPlan[row][n];
				
							return (<div onClick={this.onSeatSelect.bind(this,row,n)}
									role="seat"
									data-status={seat.status} data-type={seat.type}
									className="flex">{n}</div>);

						}.bind (this));
						
						return (<div className="seating-row flex" data-row={row}>{seats}</div>);

					}.bind (this))
				}
				</div>
			);

		} else 
			return null;
	}
});