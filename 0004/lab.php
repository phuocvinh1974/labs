<!DOCTYPE html>
<html>
	<head>
			<meta http-equiv="content-type" content="text/html; charset=utf-8">
			<title>LAB</title>
			<link rel="stylesheet" href="css/font-awesome.min.css">
			<link rel="stylesheet" href="css/default.css">
			<script src="js/jquery-2.1.3.min.js"></script>
			<script src="js/proto-helper.js"></script>
			<script src="js/cineman.js"></script>
	</head>

	<body>

		<style scoped>

			.datepicker, .timeline, .ticket-proccess, .stages{ display: flex; display: -webkit-flex; }

			.datepicker > div { margin-right: 6px; }

			.timeline > div { margin-right: 6px; }

			.ticket-proccess { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
			.ticket-proccess, .stages { justify-content: center; align-items: center; align-content: center; }
			.viewport { margin:auto; width: 840px; height: 640px; background:rgba(50, 50, 50, .5); overflow-x: hidden; }

			.stages { width: calc(840px*3); height: 100%; }
			.stages > div {
				display: flex; display: -webkit-flex;
				justify-content: center; align-items: center; align-content: center;
				-webkit-justify-content: center; -webkit-align-items: center; -webkit-align-content: center;
				flex-direction: column; -webkit-flex-direction: column;
				width: 840px; height: 100%; }
			.payment > div { width: 240px; background-color: #fff; text-align: center; }

			div[role=seat] {
				width: 35px; height: 35px;
				line-height: 35px;
				text-align: center;
				font-size:12px !important; letter-spacing:1px; cursor: pointer; }
			div[role=seat]:not(:last-child) { margin:0 3px 0 0; }
			div[role=seat][status=available][type=P] { background-color: #F7D358; }			
			div[role=seat][status=available] { background-color: #fff; color: #000; }
			div[role=seat][status=selected] { background-color: #0404B4; color: #fff; }
			div[role=seat][status=paid] { background-color: #ff0000; color: #fff; }

			.close {
				position: absolute; left: 50%;
				width: 30px; height: 30px;
				line-height:30px; margin-left: -15px; color:rgba(50, 50, 50, .5); background-color: #fff; text-align: center; cursor: pointer; }

			hr { border: dashed 1px #ddd }	

		</style>

		<div id="datepicker" class="datepicker">datepicker loading..</div>
		<div id="showtimes" class="showtimes">showtime loading...</div>
		
	</body>

	<script type="text/javascript">


			var _GLOBAL = { theme: "metro", cache: {}, processes: { alldone: true } };//remove
			var _GES = {};//remove
			var datepicker = new DatePicker(), showtimes = new Showtimes();
			
			datepicker.setWrapper('#datepicker').initializer();
			showtimes.setWrapper('#showtimes').initializer();

			$.ajax({ type:'post', url:'modules/common/price-list.php', success: function(res) { _GLOBAL.cache.price = JSON.parse(res); } });

			$('#datepicker').on('click', 'div[data]', function () {

				var d = $(this).attr('data');
				_GLOBAL.cache.dateSelected = d;

				$('#showtimes').trigger('date-selected', d)
				if( $('#ticket-proccess').length ) $('#ticket-proccess').remove();
			});

			$('#showtimes').on('click', 'div[role=current-time]', function () {

				var data = JSON.parse( $(this).attr('data').singlequotesReplace() );
				var tickets = new Tickets();

				data.dateSelected = _GLOBAL.cache.dateSelected;
				
				tickets.initializer( data );
			});


	</script>
</html>