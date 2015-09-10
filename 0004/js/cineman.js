
function DatePicker () {

	var self = this, _root;

	this.initializer = function () {

		self.getCalendar( function (res) {
			$(_root).html( res.join('') )
		});

		return this; 
	}

	this.setWrapper = function (e) {
		_root = e;

		return this;
	}

	this.getCalendar = function (callback) {

		$.ajax({
			type: 'post',
			dataType: 'json',
			url: 'modules/common/movies-calendar.php',
			success: function (res) {

				var s = [];

                for (var i in res) {
					var d = new Date(res[i].date.sec * 1000);
					var t = d.toDMString() === new Date().toDMString() ? "TODAY" : d.toDMString();
					s.push('<div data="' + d.toISOString() + '">' + t + '</div>');
                }

                callback( s );
			}
		});
	}
}

/******************************************************************************/

function Showtimes () {

	var self = this;
	var _root, movieSchedules, moviesIndex, movieShowtimes;

	this.initializer = function () {
		$(_root).empty()
		$(_root).on('date-selected', self.showtimeRender)
	}

	this.setWrapper = function (e) {
		_root = e;

		return this;
	}

	this.showtimeRender = function (e,d) {
		self.getSchedules(d, function () {
			self.getMoviesIndex(function () {
				self.createMovieShowtimes().render()
			});
		});
	}

	this.getSchedules = function (d,callback) {

		$.ajax({
			type: 'post',
			url: 'modules/tickets/tickets.php?action=get-schedules',
			dataType: 'json',
			data: { post: { ondate: d } },
			success: function (res) {
				
				movieSchedules = res;

				callback();
			}
		});
	}

	this.getMoviesIndex = function (callback) {
		
		var distinct = [];

		$.each(movieSchedules[ Object.keys(movieSchedules)[0] ], function () {
			$.each(this.schedule, function () {
				if (this._id !== undefined)
					distinct[this._id] = true;
			});
		});

		$.ajax({
			type: 'post',
			url: 'modules/tickets/tickets.php?action=get-moviesindex',
			dataType: 'json',
			data: { post: { distinct: Object.keys(distinct) } },
			success: function (res) {
				
				moviesIndex = res;

				callback();
			}
		});
	}

	this.createMovieShowtimes = function () {

		movieShowtimes = [];

		$.each(movieSchedules[ Object.keys(movieSchedules)[0] ], function () {

            var thisroom = this.room;

            $.each(this.schedule, function () {
           	
                if (this._id !== undefined) {

                    if (movieShowtimes[this._id] === undefined) 
						movieShowtimes[this._id] = new Array({ start: this.start, room: thisroom, format: this.format, events: this.events });
                    else
						 movieShowtimes[this._id].push({ start: this.start, room: thisroom, format: this.format, events: this.events });
                }
                
            });
        });

        for (var k in movieShowtimes) {
			movieShowtimes[k] = movieShowtimes[k].sort( function(a,b) { return parseInt(a.start)-parseInt(b.start); });
		}

		return this;
	}

	this.render = function () {

		$(_root).empty();

		for (var o in movieShowtimes) {

			var showtimes = [];

			$.each(movieShowtimes[o], function () {

				var events = '';

				if( this.events!==undefined ) events = ',\'events\':' + JSON.stringify(this.events).replace(/"/g, "'");

				showtimes.push(
					'<div role="current-time" class="current-time" data="{\'room\':\'' + this.room + '\',\'movie\':\'' + o + '\',\'format\':\'' + this.format + '\',\'start\':\'' + this.start + '\'' + events + '}">' +
					'<div>' + parseInt(this.start).toHMString() + '</div></div>');
			});

			$(_root).append(
				'<div class="timeline">' +
					'<div>' + moviesIndex[o].Format + '</div>' +
					'<div>' + moviesIndex[o].IntTitle + '</div>' +
					'<div>' + moviesIndex[o].Title + '</div>' + showtimes.join('') + 
				'</div>');
		}

	}
}

/******************************************************************************/

function Tickets () {
	
	var self = this, _data, _root, seatsSelected;

	this.initializer = function (data) {

		if( $('#ticket-proccess').length ) $('#ticket-proccess').remove();
		
		_data = data;
		_root = $('<div/>', { id: 'ticket-proccess', class: 'ticket-proccess' }).appendTo('body');

		self.loadProccessLayout();

		// G events

		_GES = {};

		$(_GES).on('seats-confirm', self.seatsConfirm)
		$(_GES).on('payment-confirm', self.paymentConfirm);
		$(_GES).on('layout-close', function () { $(_root).remove(); });
		$(_GES).on('payment-cancel', function () { $('.viewport').animate({ scrollLeft: 0 }, 250); });
		// I events
		$(_root).on('click', 'div[role=seat]', function () { self.seatsSelecting( this ) });

		// console.log(_data)
	}

	this.loadProccessLayout = function () {

		$(_root).load('modules/common/ticket-proccess-layout.html?' + new Date().getTime(), function () {
			self.loadSeatingPlan( _data.room );
		});
	}

	this.loadSeatingPlan = function (n) {

		$('#seating-plan-wrapper').load('modules/common/room-' + n + '.html?' + new Date().getTime(), function () {

			// var data = _data.showtime;
			// data.date = _data.dateSelected;

			$.ajax({
			 	type: "post",
			 	url: "modules/tickets/tickets.php?action=load-seats", data: { post: _data },
				success: function (res) {

					var _res = JSON.parse(res);

					if (!_res.notfound) {
						$.each(_res.seats, function () {
							$('#'+this.seat).attr({ status: this.status });
						});
					}
				}
			});
		});
	}

	this.seatsSelecting = function (seat) {
		if($(seat).attr('status')!=='paid')
			$(seat).attr({ status: $(seat).attr('status')==='selected' ? 'available' : 'selected' });
	}

	this.seatsConfirm = function () {

		var elems = $('#seating-plan-wrapper div[role=seat][status=selected]');

		if(!elems.length) {
			console.log({ msg:'Nothing!', msgType:'error' })
			return;
		}

		seatsSelected = [];

		$.each(elems, function () {
			seatsSelected.push({ seat: $(this).attr('id'), type: $(this).attr('type') });
		})

		$('#lbl-seats-total').html( elems.length );
		$('#lbl-payment-total').html( self.payCalc );

		$('.viewport').animate({ scrollLeft: 840 }, 250);

	}

	this.payCalc = function () {

		var day = new Date(_data.dateSelected).getDay();
		var start = parseInt(_data.start);
		var format = _data.format;
		var at = start < 600 ? 'start' : start > 600 && start < 1020 ? 'mid' : 'end';
		var pay = 0;

		$.each(seatsSelected, function () {
			if( this.type==='N' ){
				if( format==='3D' )
					pay += parseInt(_GLOBAL.cache.price[day][at]['3D-N']);
				else
					pay += parseInt(_GLOBAL.cache.price[day][at]['adult']);
			} else {
				if( format==='3D' )
					pay += parseInt(_GLOBAL.cache.price[day][at]['3D-P']);
				else
					pay += parseInt(_GLOBAL.cache.price[day][at]['2D-P']);
			}
		});

		if (_data.events!==undefined)
			pay = seatsSelected.length * parseInt(_data.events.samePrice);

		return pay;
	}

	this.paymentConfirm = function () {

		var seats = [];

		$.each( $('#seating-plan-wrapper div[role=seat][status=selected],div[role=seat][status=paid]' ), function () {
				seats.push({ 
					seat: $(this).attr('id'),
					type: $(this).attr('type'),
					status: $(this).attr('status')
				});
		});

		var data = { seats: seats, showtime: _data };

		$.ajax({
			type: 'post',
			url: 'modules/tickets/tickets.php?action=seats-paid', data: { post: data },
			success: function (res) {
				console.log({ msg: 'saved!' })

				$('.viewport').animate({ scrollLeft: 840*2 }, 250);
			}
		});

	}

	this.printing = function () {}

}