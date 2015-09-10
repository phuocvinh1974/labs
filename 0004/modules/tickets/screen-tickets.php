<style scoped>
	[role=button] {cursor:pointer}

	#calendar { height:30px; line-height:30px; margin-bottom:12px; padding-left:12px; background-color:#ff6000; color:#fff; cursor:pointer; }
	div[role=mini-date] { padding-right:12px; padding-left:12px; font-size:24px !important; color:#F5D0A9; }
	div[role=mini-date][status=selected] { background-color: #fff; color: #ff6000; font-weight: bold; }

	.wrap { width: 100%; height: 50px; overflow: hidden; cursor: pointer; margin-bottom: 6px; background-color: #f8f8f8; }	
	.wrap-selected { background-color: #ffcc00; }
	.wrap-selected > div:nth-child(1) > div:nth-child(3) { color: #fff; }

	div[role=on-showtime] > div { margin-right:6px; }
	div[role=on-showtime] > div:nth-child(4) { margin-left: 12px }
	.lbl-format, .lbl-inttile, .lbl-title { font-size:24px !important; }
	.lbl-title { color: #ccc; }
	.lbl-format { padding-left: 12px; background-color: #eee; }
	.start-selected { background-color: #fff; padding: 0 12px 0 12px; }
	
	div[role=showtime] > div:first-child { font-size:24px !important; height:34px; }
	div[role=P][no=P1] {background-color:#FF66A3;}
	div[role=P][no=P2] {background-color:#ADD6FF;}
	div[role=P][no=P3] {background-color:#DBB84D;}	

	#dummy-centered {position:absolute;width:0;height:0;left:50%;top:50%;display:none;}		
			
	/* SEATING PLAN */
	#movie-service { position:relative; width:840px; height:600px; left:-420px; top:-300px; overflow-x:hidden; background:rgba(50, 50, 50, .5); }

	#btn-close { position:relative; width:40px; height:40px; background:rgba(0, 0, 0, 0.5); text-align:center; line-height:40px; color:#fff; top:-310px; left:-20px; border-radius:20px; cursor:pointer; }

	#info-1 > div { font-size:24px !important; margin-top: 12px; background-color: #fff; color: #666; }
	#info-1 > div:nth-child(1)::after { content: ':'; margin: 0 3px 0 3px; }

	#info-2 > div { width:60px; font-size:24px !important; text-align: center; }
	#info-2 > div:nth-child(1) { background-color: DarkBlue; color: #fff; }
	#info-2 > div:nth-child(2) { background-color: #fff; color: #000; }
	#info-2 > div:nth-child(3) { background-color: DarkBlue; color: #fff; }

	#pay, #seats-total, #change { font-size:24px !important; font-weight: bolder; }
	#pay { color: Crimson; }
	#change { color: SeaGreen; }

	/* END - SEATING PLAN */

	#seating-plan {position:relative;display:table;margin-top:12px;margin-left:auto;margin-right:auto}	
	#seating-plan div[role=seat] {width:40px;height:40px;line-height:30px;text-align:center;cursor:pointer;background-color:#fff;}
	#seating-plan div[role=seat]:not(:last-child) {margin:0 3px 0 0;}
		
	#seating-plan div[role=seat][type=P] {background-color:#F7D358}/* VIP */
	#seating-plan div[role=seat]:hover {background-color:#ccc;color:#fff}
	#seating-plan div[role=seat][status="selected"] {background-color:#0404B4;color:#fff}
	#seating-plan div[role=seat][status="paid"] {background-color:#ff0000;color:#fff}

	.jqx-dropdownlist-state-normal{border:none;background-color:#eee;color:#000}
	.jqx-dropdownlist-content {font-weight: bold; text-align: center;}
    .jqx-listbox{border:none;color:#000;background-color:#fff;}
    .jqx-input{border:none;color:#000;background-color:#eee;font-weight: bolder;}
</style>

<div id="calendar" class="noob noob-inline"><!--important--></div>
<div id="movies-showtime"><!--important--></div>
<div id="dummy-centered">
	<div id="btn-close"><i class="fa fa-close"></i></div>
	<div id="movie-service" class="trama">
		<div style="width:calc(840px * 3)" class="noob noob-inline">
			
			<div style="width:840px;">
				<div id="info-1" class="noob noob-inline noob-centered"></div>
				<div id="info-2" class="noob noob-inline noob-centered"></div>
				<div style="display:table;margin-left:auto;margin-right:auto;border-bottom:solid 1px #fff;color:#fff;margin-top:12px">S C R E E N</div>
				<div id="seating-plan"><!--important--></div>	
				<div style="margin-top:12px;margin-left:auto;margin-right:auto;display:table;background-color:#fcc">
					<button onclick="$('#movie-service').trigger('seats-confirm')">CONFIRM</button>
				</div>			
			</div>
			
			<div id="paycheck" style="width:840px;" class="noob noob-centered">
				<div style="width:200px;background-color:#fff;padding:12px 0 12px 0;" class="noob noob-break noob-centered">
					<div>SEATS</div>
					<div id="seats-total"></div>

					<div>TOTAL</div>
					<div id="pay"></div>

					<div style="margin-top:6px">CHIDLRENS / STUDENTS</div>
					<div class="noob noob-inline">
						<div id="childrens-sale" style="margin-right:6px"></div>
						<div id="students-sale" style="margin-left:6px"></div>						
					</div>

					<div style="margin-top:12px">MEMBER CODE</div>
					<input id="member-code" style="text-align:center"/>

					<div style="margin-top:12px">CASH</div>
					<input id="cash" maxlength="9" style="text-align:center"/>

					<div>CHANGE</div>
					<div id="change"></div>

					<div style="margin-top:24px"><button onclick="$('#movie-service').trigger('paid-confirm')">CONFIRM</button></div>
					<div style="margin-top:12px"><button onclick="$('#movie-service').trigger('paid-cancel')">CANCEL</button></div>
					
				</div>
			</div>
			
			<div id="tickets-print" style="width:840px;">PRN</div>
		</div>
	</div>
</div>
<script src="modules/tickets/tickets.js"></script>