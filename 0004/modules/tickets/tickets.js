$(document).ready(function () {
	
	function payCalc () {		
		var seats = [];
		var noVIP = 0;

		$.each($('#seating-plan div[role=seat][status=selected]'), function () {
			seats.push({ seat:$(this).attr('id'), type:$(this).attr('type') });
			if( $(this).attr('type') !== 'P' ) noVIP++;
		});

		if (seats.length) {
			var day = new Date(_GLOBAL.cache.dateSelected).getDay();
			var start = parseInt(_GLOBAL.cache.showtimeSelected.start);
			var format = _GLOBAL.cache.showtimeSelected.format;
			var at = start < 600 ? 'start' : start > 600 && start < 1020 ? 'mid' : 'end';
			var pay = 0;

			if ( _GLOBAL.cache.showtimeSelected.events!==undefined ){
				pay = seats.length * parseInt(_GLOBAL.cache.showtimeSelected.events.samePrice);
			} else {
				$.each(seats, function () {
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
			}

			return { seatsTotal: seats.length, noVIP: noVIP, pay: pay  };
		} else
			return false;
	}

	_GLOBAL.cache = {};

	$('#calendar').MoviesCalendar();
	
    $('#movies-showtime').Tickets('initialize', function (d) {  	
    	_GLOBAL.cache.dateSelected = d;
    	var e = '#calendar [role=mini-date][date^=' + d.slice(0,10) + ']';
    	$($(e)[0]).attr({ status:'selected' });
    });

	$.ajax({ type:'post', url:'modules/common/price-list.php', success: function(res) { _GLOBAL.cache.price = JSON.parse(res); } });
        
	// COMPONENTS
    $('button').jqxButton({ width:100, height:30, theme:_GLOBAL.theme });
    $('#childrens-sale, #students-sale').jqxDropDownList({ width:50, height:30, autoDropDownHeight:true, placeHolder:'', theme:_GLOBAL.theme });

    $('#cash').jqxInput({width:200,height:30,theme:_GLOBAL.theme})
    $('#member-code').jqxInput({width:50,height:30,theme:_GLOBAL.theme})
	
	// EVENTS	
	$('#movies-showtime').on('click', 'div[role=showtime]', function () {
		$('#movies-showtime .wrap-selected').removeClass('wrap-selected'); 
		$('#movies-showtime .start-selected').removeClass('start-selected');
		$(this).closest('.wrap').addClass('wrap-selected');
		$(this).find('div[role=start]').addClass('start-selected');
	}); /* UI */

	$('#calendar').on('click', '[role=mini-date]', function () {
		_GLOBAL.cache.dateSelected = $(this).attr('date');
		$($('#calendar [role=mini-date][status=selected]')[0]).attr({status:''});//huy trang thai selected cua phan tu truoc do
		$(this).attr({status:'selected'});//dat lai trang thai selected

		$('#movies-showtime').empty();
		$('#movies-showtime').Tickets('load', _GLOBAL.cache.dateSelected);
	}); /* A */

	$('#movies-showtime').on('click', 'div[role=showtime]', function() {

		var data = JSON.parse($(this).attr('data').singlequotesReplace());
		var m = $('#movies-showtime').Tickets('get-movies-index');
		_GLOBAL.cache.showtimeSelected = data;

		$('#movies-showtime').Tickets('loadSeatingPlan',
			{onElement:'#seating-plan',movie:data.movie,start:data.start,room:data.room,format:data.format,date:_GLOBAL.cache.dateSelected}
		);

		$('#info-1').html(['<div>',m[data.movie].IntTitle,'</div>','<div>',m[data.movie].Title,'</div>'].join(''));

		$('#info-2').html([
			'<div>',parseInt(data.start).minutesToTime(),'</div>',
			'<div>',_GLOBAL.cache.dateSelected.slice(5,10).split('-').reverse().join('-'),'</div>',
			'<div>',data.format,'</div>'
			].join(''));

        $("#dummy-centered").appendTo("body").css({display:"block"});
	}); /* A */

	$('#seating-plan').on('click', 'div[role=seat]', function () {
		if($(this).attr('status')!=='paid')
			$(this).attr({status:$(this).attr('status')==='selected'?'available':'selected'});
	}); /* A */

	$('#movie-service').on('seats-confirm', function () {
		
			var paycalc = payCalc();

			if (!paycalc) return;

			_GLOBAL.cache.pay = paycalc.pay;
			_GLOBAL.cache.totalPay = paycalc.pay;
			_GLOBAL.cache.noVIP = paycalc.noVIP;

			$('#seats-total').html( paycalc.seatsTotal );
			$('#pay').html( paycalc.pay.formatNumber() );
			$('#childrens-sale').jqxDropDownList({ source: paycalc.noVIP.makeArray() });
			$('#students-sale').jqxDropDownList({ source: paycalc.noVIP.makeArray() });

			$('#movie-service').animate({scrollLeft:840}, 250);
	}); /* A */

	function recalcPay () {
		var day = new Date(_GLOBAL.cache.dateSelected).getDay();
		var start = parseInt(_GLOBAL.cache.showtimeSelected.start);
		var format = _GLOBAL.cache.showtimeSelected.format;
		var at = start < 600 ? 'start' : start > 600 && start < 1020 ? 'mid' : 'end';

		var sale4Child = $('#childrens-sale').val() * ( parseInt(_GLOBAL.cache.price[day][at]['adult']) - parseInt(_GLOBAL.cache.price[day][at]['children']) );

		var sale4Std = $('#students-sale').val() * ( parseInt(_GLOBAL.cache.price[day][at]['adult']) - parseInt(_GLOBAL.cache.price[day][at]['student']) );

		_GLOBAL.cache.totalPay = _GLOBAL.cache.pay - (sale4Child + sale4Std);
	}

	$('#childrens-sale').on('change', function (e) {
		//todo
		recalcPay()
		$('#pay').html(_GLOBAL.cache.totalPay.formatNumber());

		var n = parseInt(_GLOBAL.cache.noVIP) - e.args.item.value;
		 $('#students-sale').jqxDropDownList({ source:n.makeArray() }); // re-calc
	});

	$('#students-sale').on('change', function () {
		//todo
		recalcPay()
		$('#pay').html(_GLOBAL.cache.totalPay.formatNumber());
	});


	$('#cash').change(function () {
		_GLOBAL.cache.cash = parseInt ( $(this).val() );
		
		var change = _GLOBAL.cache.cash - _GLOBAL.cache.totalPay;

		$(this).val ( _GLOBAL.cache.cash.formatNumber() )
		$('#change').html( change.formatNumber() )
	});
	/*------------------------------------------------------------------------*/

	$('#movie-service').on('paid-confirm', function () {

		// kiem tra du lieu hop le
		if( !_GLOBAL.cache.cash ) return;
		if( _GLOBAL.cache.cash < _GLOBAL.cache.pay ) return;

		// du lieu chuan bi luu
		var seats = [];

		$.each( $('#seating-plan div[role=seat][status=selected],div[role=seat][status=paid]' ), function () {
				seats.push({seat:$(this).attr('id'),type:$(this).attr('type'),status:$(this).attr('status')});
		});

		var obj = { seats:seats, showtime:_GLOBAL.cache.showtimeSelected, date:_GLOBAL.cache.dateSelected };

		$("#movies-showtime").Tickets("seatsConfirm", obj);//*important

		$("#movie-service").animate({scrollLeft: 840 * 2}, 250);
	}); /* A */
	
	$('#btn-close').click( function () {
		$('#dummy-centered').css({ display: 'none' });
		$('#childrens-sale, #students-sale').jqxDropDownList('clearSelection');
		$('#cash').val('');
		$('#change').empty();
	}); /* UI */

	$("#movie-service").on("paid-cancel", function(){ $("#movie-service").animate({scrollLeft:0}, 250); });

	//window.setInterval(function(){console.log("checking")}, 60000)
});
