var MovieTickets = React.createClass ({

	mixins: [React.addons.LinkedStateMixin],

	resSeatsPaid: function (s) {
		this.state.seatsPaid = s;
	},

	/* Number of NonVip (Normal) */
	getNoN: function () {

		var n = 0;
		
		Object.keys(this.state.seatsSelected).map( function (k) {
				if ( this.state.seatsSelected[k].type==='N' ) n++;
			}.bind (this)
		);

		return n;
	},

	getPrice: function (t) {

		var day = new Date(this.props.showtime.date).getDay(),
		start = parseInt(this.props.showtime.start),
		format = this.props.showtime.format,
		at = start < 600 ? 'start' : start > 600 && start < 1020 ? 'mid' : 'end',
		price = 0;

		if (t==='N') {
			if (format==='3D')
				price = parseInt(this.props.pricing[day][at]['3D-N']);
			else
				price = parseInt(this.props.pricing[day][at]['adult']);
		} else {
			if(format==='3D')
				price = parseInt(this.props.pricing[day][at]['3D-P']);
			else
				price = parseInt(this.props.pricing[day][at]['2D-P']);
		}
		
		// if ( this.props.events!==undefined )
		// 	price = parseInt(this.props.events.samePrice);

		return price;
	},

	paymentDiscount: function (s,n) {

		var day = new Date(this.props.showtime.date).getDay(),
		start = parseInt(this.props.showtime.start),
		format = this.props.showtime.format,
		at = start < 600 ? 'start' : start > 600 && start < 1020 ? 'mid' : 'end';

		if ( s==='children' )
		{
			var m = (parseInt(this.props.pricing[day][at]['adult']) - parseInt(this.props.pricing[day][at]['children'])) * n;

			this.setState ({ childrensDiscount: m })
		}
	},

	onCash: function () {

		var v = event.target.value;
		var c = 0;

		if ( isNaN(v) ) return 0;

		var total = this.state.paymentTotal - this.state.childrensDiscount;

		if (v >= total )
		{
			c = v - ( this.state.paymentTotal - this.state.childrensDiscount );
			document.getElementById('print').focus();
		}
		else c = '-';

		this.setState({ cash: v, charge: c.toCurrencyString() });
	},

	onChildrens: function ()
	{
		var n = parseInt(event.target.value);

		if ( isNaN(n) ) return 0;

		var NoN = this.getNoN();

		if ( n + this.state.students > NoN )
		{
			return null;
		}
		else
		{
			//todo
			this.setState ({ childrens: n });
			this.paymentDiscount('children', n);
		}
	},

	onStudents: function () {
		
		var v = parseInt(event.target.value);

		if ( isNaN(v) ) return 0;

		var NoN = this.getNoN();

		if ( v + this.state.childrens > NoN )
		{
			return null;
		}
		else
		{
			this.setState ({ students: v });
		}
	},

	onSeatSelect: function (n,t) { // n = seatID , t = type = VIP / STANDARD

		this.setState ({ cash: 0, charge: '-', childrens: 0, students: 0, childrensDiscount: 0, studentsDiscount: 0 });

		if (!this.state.seatsSelected[n])
		{
			var p = this.getPrice (t);
			this.state.seatsSelected[n] = { type: t, price: p };
			this.setState({ paymentTotal: this.state.paymentTotal + p })
		}
		else
		{
			delete this.state.seatsSelected[n];
			this.setState({ paymentTotal: this.state.paymentTotal - this.getPrice (t) })
		}
	},

	seatsConfirm: function () {

		if (!this.state._confirmAllow) return false;

		var data = { infos: this.props.showtime, seats: $.extend(this.state.seatsSelected, this.state.seatsPaid) };

		$.ajax({
			type: 'post',
			url: 'modules/tickets/seats-saving.php',
			data: { post: data },
			success: function (res) {

				var i = document.getElementsByTagName('iframe')[0];
				if (i) document.body.removeChild (i);

				this.replaceState (this.getInitialState());

				this.setState({ _reloadLayout: new Date().getTime() });
				
			}.bind(this)
		});
	},

	closeLayout: function () {

		this.replaceState ( this.getInitialState() );

		var i = document.getElementsByTagName('iframe')[0];
		if (i) document.body.removeChild (i);

		this.props.onClose ();
	},

	printing: function (sh,p) {
		
		if (Object.keys(this.state.seatsSelected).length)
		{
			$.ajax({
				type: 'post',
				url: 'modules/tickets/printing.php',
				data: { post: { showtime: sh, profile: p, seats: this.state.seatsSelected }  },
				dataType: 'json',
				success: function (res) {

					var iframe = document.createElement('iframe');
					iframe.style.display = 'none';
					iframe.src = 'tmp/' + res.filename + '.pdf';
					document.body.appendChild(iframe);

					var pdf = document.getElementsByTagName('iframe')[0];
					pdf.focus();
					pdf.contentWindow.print();

					this.setState({ _confirmAllow: true });
				}.bind (this)
			});
		}
		else
			alert ('nothing to print!')
	},

	getInitialState: function () {
		return {
			seatsSelected: {}, seatsPaid: {},
			childrens: 0, students: 0, paymentTotal: 0, cash: 0, charge: '-',
			childrensDiscount: 0, studentsDiscount: 0,
			_confirmAllow: false };
	},

	render: function () {

		if (this.props.show)
			return (
				<div className="layout-fit flex f-midcen">
					<div className="layout-box">
						<div onClick={this.closeLayout} style={{textAlign:'right',marginBottom:6}}><i className="fa fa-close" style={{cursor:'pointer'}}></i></div>
						<div className="flex f-space" style={{borderTop:'dotted 1px #999',borderBottom:'dotted 1px #999',paddingTop:6,paddingBottom:6,backgroundColor:'#F6F6F6'}}>
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
						<div style={{textAlign:'center',color:'#999',letterSpacing:5,marginTop:24,fontSize:'12px !important'}}>SCREEN</div>
						<SeatingPlanLayout showtime={this.props.showtime} onSeatSelect={this.onSeatSelect} resSeatsPaid={this.resSeatsPaid} _reload={this.state._reloadLayout} />
						<div style={{textAlign:'center',marginTop:12}}>
							<span style={{marginRight:6}}>CH</span><input type="text" onChange={this.onChildrens} value={this.state.childrens} maxLength="2" style={{width:25,textAlign:'center'}} />
							<span style={{marginRight:6,marginLeft:6}}>STD</span><input type="text" onChange={this.onStudents} value={this.state.students} maxLength="2" style={{width:25,textAlign:'center',marginRight:6}} />
							<span style={{marginRight:6}}>MEMBER</span><input type="text" value={null} style={{width:50,textAlign:'center',fontWeight:'bold'}} />
						</div>
						<div style={{textAlign:'center',marginTop:12,marginBottom:24}}>
							<span style={{marginRight:6}}>TOTAL</span><input type="text" value={(parseInt(this.state.paymentTotal)-this.state.childrensDiscount).toCurrencyString()} style={{width:100,fontSize:'24px !important',color:'#D50000'}} />
							<span style={{marginLeft:6,marginRight:6}}>CASH</span><input type="text" value={this.state.cash} onChange={this.onCash} style={{width:100,fontSize:'24px !important'}} />
							<span style={{marginLeft:6,marginRight:6}}>CHANGE</span><input type="text" value={this.state.charge} style={{width:100,fontSize:'24px !important',color:'#4CAF50'}} />
						</div>
						<div style={{textAlign:'center'}}>
							<button onClick={this.seatsConfirm} disabled={this.state._confirmAllow ? null : 'disabled'} style={{marginRight:12}}>CONFIRM</button>
							<button onClick={this.printing.bind(this,this.props.showtime,this.props.profile)} id="print">PRINT</button>
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

		if (e.target.getAttribute('role'))
			e.target.setAttribute('data-status', status);
		else 
			e.target.parentNode.setAttribute('data-status', status);

		this.props.onSeatSelect (n, this.state.seatingPlan[row][n]['type']);
	},

	componentWillMount: function () {
		this.loadSeatingPlan (this.props.showtime.room, function () {
			this.forceUpdate();
		}.bind (this))
	},

	componentWillReceiveProps: function (nP) {

		if (this.props._reload!==nP._reload)
		{
			this.loadSeatingPlan (this.props.showtime.room, function () {
				this.forceUpdate();
			}.bind (this))
		}
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
				
							return (
								<div onClick={this.onSeatSelect.bind(this,row,n)} role="seat" data-status={seat.status} data-type={seat.type} className="flex">
									<div>{n}</div>
								</div>
							);

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