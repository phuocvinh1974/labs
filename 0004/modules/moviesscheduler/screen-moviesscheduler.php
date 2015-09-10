<style scoped>
        #main-content { padding-left: 12px; }

        div[role=room]{width:3200px;height:85px;background-color:#eee;}
        div[role=room] > div{float:left;}
        #movies-index div{float:left;}
        div[role=index-selected]{color:#000;height:30px;line-height:30px;margin-left:6px;padding-left:6px;padding-right:6px;cursor:pointer;}

        /*****/
        div[role=on-timeline]{color:#666666;background-color:#fafafa;overflow:hidden}
        div[role=on-timeline] > div{cursor:pointer;margin-left:6px;overflow:hidden}
        div[role=start-end] > span:first-child{color:#000;background-color:#aaa;font-weight:bold;}
        div[role=rest] { background-color:#000; text-align:center; min-width:5px; }
        div[role=rest] > input{width:100%;border:none;text-align:center;color:#fff;background-color:#000;outline:none;}
        button{cursor:pointer !important}
        
        i[role=btn-mi-remove] { color:#aaa; margin-right:6px; }
        i[role=btn-mi-remove]:hover { color: #000; }

        i[role=btn-m-remove] {position:relative;float:right;margin:2px 6px 0 0;color:#fff;opacity:0.75}
        i[role=btn-m-remove]:hover { color: #000; }
        i[role=btn-m-more] {position:relative;float:left;margin:2px 0 0 6px;color:#000;opacity:0.35}
        i[role=btn-m-more]:hover {color: #fff;opacity:1}
        i[role=inf-events] {margin-left: 6px; color: #ff00ff;}
        i[role=inf-events]:hover {color: #f00;}

        
        /*mini-calendar*/
        .mini-calendar-selected { width: 60px; background-color: #f00; color: #fff !important; font-weight: bold; padding: 0 !important; }
        div[role=today], div[role=next-day] { text-align: center; cursor: pointer; padding: 0 6px 0 6px; }
        .exists { font-weight: bolder; color: #f60; }
        /*END - mini-calendar*/
        
        #summary span[role=summary-title] {padding:0 6px 0 6px;background-color:#eee}
        #summary span[role=summary-title]:not(:first-child) {margin-left:12px;}
        #summary span[role=summary-count] {padding:0 6px 0 6px;background-color:#ccc;color:#000;}

        .wrap-controlbox {height:60px;width:100%;background-color: #f6f6f6;line-height: 60px}
        .wrap-search { height:30px;width:100%;background-color: #f6f6f6; }
        .wrap-moviesindex { height:30px;width:100%;background-color: #f6f6f6; line-height: 30px }

        #wrap-scroll::-webkit-scrollbar { height: 5px; }
        #wrap-scroll::-webkit-scrollbar-track { background-color: #eee; }
        #wrap-scroll::-webkit-scrollbar-thumb { background-color: SlateGray; }
        
        /******/

        
        /*.mini-calendar > div:not(:first-child){padding-left:6px;padding-right:6px;}*/
        /*.mini-calendar i {position:relative;top:-15px;margin-left:1px;text-align:center;color:#ffa000;}*/

        .day-selected{color:#428bca;font-weight:bold;}
        .jqx-input-content{background-color:#ddd; color:#000 !important}
        .jqx-dropdownlist-content{font-weight: bold; color:#000 !important;}
        .jqx-fill-state-normal-metro {color: #000; background-color: #eee;} /*jqxTooltip*/
</style>

<div id="movies-scheduler">
    <div class="wrap-search"><span style="margin-right:10px">MOVIE</span><span><input id="txt-search" style="border:none;"></span></div>

    <div style="clear:both;margin-top:12px"></div>

    <div id="movies-index" class="wrap-moviesindex"><div>MOVIES INDEX</div></div>

    <div id="wrap-scroll" style="width:1200px;overflow-x:scroll;"><div style="width:3200px;height:36px">&nbsp;</div></div>

    <!--R1-->
    <div style="clear:both;padding-top:12px"><span style="background-color:#000;color:#fff;padding:0 10px 0 10px;"><strong>ROOM 01</strong></span></div>
    <div id="_1" style="width:1200px;overflow-x:hidden;float:left">
        <div id="room-1" role="room" no="1" accept="2D,3D"></div>
    </div>

    <!--R2-->
    <div style="clear:both;padding-top:24px"><span style="background-color:#000;color:#fff;padding:0 10px 0 10px"><strong>ROOM 02</strong></span></div>
    <div id="_2" style="width:1200px;overflow-x:hidden;float:left">
        <div id="room-2" role="room" no="2" accept="2D"></div>
    </div>

    <!--R3-->
    <div style="clear:both;padding-top:24px"><span style="background-color:#000;color:#fff;padding:0 10px 0 10px"><strong>ROOM 03</strong></span></div>
    <div id="_3" style="width:1200px;overflow-x:hidden;float:left">
        <div id="room-3" role="room" no="3" accept="2D,3D"></div>
    </div>

    <!--*****-->
    <div style="clear:both;height:12px;"></div>
    <div class="inline"><div style="margin-right:12px">SUMMARY</div><div id="summary"></div></div>
    <div style="clear:both;height:12px;"></div>

    <div class="inline wrap-controlbox">
        <div><button id="btn-copy" style="margin-right:12px">COPY</button><button id="btn-paste" style="margin-right:12px">PASTE</button></div>
        <div id="mini-calendar" class="inline"></div>
        <div style="margin-left:6px"><button id="btn-confirm">CONFIRM</button><button id="btn-print" style="margin-left:12px">PRINT</button></div>
    </div>
</div>
<script src="modules/moviesscheduler/moviesscheduler.js"></script>