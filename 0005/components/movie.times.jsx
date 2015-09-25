var MovieTimes = React.createClass ({
	
	getSchedules: function (d,callback) {

		$.ajax({
			type: 'post',
			url: 'modules/common/movie-schedules.php',
			data: { date: d },
			dataType: 'json',
			success: function (res) {
				this.state.Schedules = res;
				callback ();
			}.bind (this)
		});
	},

	getIndex: function (callback) {

		var distinct = [];

		$.each(this.state.Schedules, function () {
			$.each(this.schedule, function () {
				if (this._id!==undefined)
					distinct[this._id] = true;
			});
		});

		$.ajax({
			type: 'post',
			url: 'modules/common/movie-index.php',
			dataType: 'json',
			data: { distinct: Object.keys(distinct) },
			success: function (res) {
				this.state.Index = res;
				callback ();
			}.bind (this)
		});
	},

	createShowtimes: function (d,callback) {

		this.getSchedules (d, function () {
			this.getIndex ( function () {
				// begin

				var _schedules = this.state.Schedules;
				var _index = this.state.Index;
				var _showtimes = [];

				// create showtimes
				$.each(_schedules, function () {

					var thisroom = this.room;

					$.each(this.schedule, function () {

						if (this._id!==undefined) { // is movie time (not rest time)

							if (_showtimes[this._id]===undefined) 
								_showtimes[this._id] = new Array({
								shortTitle: _index[this._id].shortTitle,
								IntTitle: _index[this._id].IntTitle,
								Title: _index[this._id].Title,
								movie: this._id, date: d, start: this.start, room: thisroom, format: this.format, events: this.events });
                    		else
							 	_showtimes[this._id].push({
							 	shortTitle: _index[this._id].shortTitle,
							 	IntTitle: _index[this._id].IntTitle,
							 	Title: _index[this._id].Title,
							 	movie: this._id, date: d, start: this.start, room: thisroom, format: this.format, events: this.events });
						}
					});
				});

				for (var k in _showtimes) {
					_showtimes[k] = _showtimes[k].sort( function(a,b) { return parseInt(a.start)-parseInt(b.start); });
				}

				this.state.Showtimes = _showtimes;

				callback ();

				// end
			}.bind (this))
		}.bind (this));
	},

	componentWillMount: function () {
		this.createShowtimes (this.props.current, function () {
			this.forceUpdate ();
		}.bind (this));
	},

	componentWillReceiveProps: function (nextProps) {
		this.createShowtimes (nextProps.current, function () {
			this.forceUpdate ();
		}.bind (this));
	},

	getInitialState: function () {
		return { Schedules: {}, Index: {}, Showtimes: {} }
	},

	render: function () {

		var m = Object.keys(this.state.Showtimes).map( function (k) {

			var n = this.state.Showtimes[k];

			var t = Object.keys(n).map( function (k) {
				return (<span onClick={this.props.onTimeSelect.bind(this, n[k])} style={{marginRight:12}} className="m-time"><i className="fa fa-caret-right" style={{marginRight:3}}></i>{ parseInt(n[k].start).toHMTString() }</span>);
			}.bind (this));
			
			return (
				<div className="infos flex">
					<div style={{marginRight:12}}><i className="fa fa-film"></i></div>
					<div>
						<div>{this.state.Index[k].Format}</div>
						<div><span>{this.state.Index[k].IntTitle}</span><span style={{marginLeft:6,color:'#fff'}}>{this.state.Index[k].Title}</span></div>
						<div style={{cursor:'pointer'}}>{t}</div>
					</div>
				</div>
			);

		}.bind (this));

		return (<div className="showtimes">{m}</div>);
	}
});