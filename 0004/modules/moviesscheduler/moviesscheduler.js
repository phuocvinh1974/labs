$(document).ready(function () {

    _GLOBAL.cache = {};

    var moviesIndex;
    var movieindexColors = ["#4DDB4D","#66CCCC","#66CCFF","#66CC99","#3366FF","#990099","#6633CC","#669999"];

    function applyColors() {
        var tmp = movieindexColors.slice();
        $.each(moviesIndex, function () {
            this.$bg = tmp.pop();
        })
    }

    function summary() {
        var m = {};
        $("div[role=on-timeline]").each(function () {
            var movieId = JSON.parse($(this).attr('data').singlequotesReplace()).movieId;
            var inttitle = this.childNodes[1].innerHTML;
            m[movieId] = m[movieId] !== undefined ? {inttitle: inttitle, count: m[movieId].count} : {inttitle: inttitle, count: 0};
            m[movieId].count += 1;
        })

        $("#summary").empty();
        $.each(m, function () {
            $("#summary").append('<span role="summary-title">' + this.inttitle + '</span><span role="summary-count"><strong>' + this.count + '</strong></span>')
        })
    }

    //COMPONENTS
    $("button").jqxButton({theme: _GLOBAL.theme});
    
    $('#main-notification').jqxNotification({
        position: 'bottom-right', template: null, opacity: 0.9,
        autoOpen: false, animationOpenDelay: 500, autoClose: true, autoCloseDelay: 3000, theme:_GLOBAL.theme
    });

    $("#txt-search").jqxInput({placeHolder: "enter movie name", source: function (query, response) {
            var tmp = new $.jqx.dataAdapter(
                    {type: "post", datatype: "json", datafields: [{name: "IntTitle"}, {name: "Runtime"}], url: "modules/common/movies-list.php"},
            {autoBind: true,
                formatData: function (data) {
                    data.query = query;
                    return data;
                }, loadComplete: function (data) {
                    response($.map(data.items, function (item) {
                        return {
                            label: item.IntTitle,
                            value: JSON.stringify({_id: item._id.$id, IntTitle: item.IntTitle, Runtime: item.Runtime, Format: item.Format})};
                    }));
                }
            });
        }, searchMode: "startswithignorecase", width: 280, height: 30, theme: _GLOBAL.theme
    });

    $('#mini-calendar').MiniCalendar();

    // EVENTS
    $("#txt-search").on("select", function (e) {
        var selected = e.args ? e.args.item : null;
        if (selected) {
            var selected = JSON.parse(selected.value);
            if (!moviesIndex[selected._id]) {
                moviesIndex[selected._id] = {_id: selected._id, IntTitle: selected.IntTitle, Runtime: selected.Runtime, Format: selected.Format}
            }

            $('#movies-index').MoviesIndex('add', selected);
        }
        $("#txt-search").val('');
    });

    $("#movies-index").on("dragstart", "[role=index-selected]", function (e) {
        e.originalEvent.dataTransfer.setData("movie-data", e.currentTarget.attributes.data.value);
    });

    $("div[role=room]").on("dragover", function (e) {
        e.preventDefault();
        $(this).css({border: "5px dashed black"});
    });

    $("div[role=room]").on("dragleave", function () {
        $(this).css({border: "none"});
    });

    $("#movies-index").on("click", "[role=btn-mi-remove]", function () {/* remove movie queue */
        $("#movies-index").MoviesIndex("remove", this);
    });

    $('div[role=room]').on('drop', function (e) {
        e.preventDefault();
        $(this).css({border: 'none'});
        _GLOBAL.processes.alldone = false; //kiem tra moi thu da luu & hoan tat

        var roomNo = $(this).attr("no");
        var movieData = JSON.parse(e.originalEvent.dataTransfer.getData('movie-data').replace(/'/g, '"'));
        $('#movies-scheduler').MoviesScheduler('add', roomNo, movieData);
        $('#movies-scheduler').MoviesScheduler('scheduleRender', roomNo);

        summary();
    });

    $("div[role=room]").on("change", "div[role=rest] > input", function () {
        var roomno = $($(this).closest("[role=room]")[0]).attr("no");
        $(this).css({width:this.value})
        $("#movies-scheduler").MoviesScheduler("update", {room: roomno, element: this});
        $("#movies-scheduler").MoviesScheduler("scheduleRender", roomno);
    });

    $("div[role=room]").on("click", "[role=btn-m-remove]", function () {
        var roomno = $($(this).closest("[role=room]")[0]).attr("no");
        $("#movies-scheduler").MoviesScheduler("remove", {roomno: roomno, count: $($(this).closest("[role=on-timeline]")[0]).attr("count")});
        $("#movies-scheduler").MoviesScheduler("scheduleRender", roomno);

        summary();
    });

    $("#btn-copy").click(function () {
        _GLOBAL.cache.copyDate = _GLOBAL.cache.dateSelected;
        _GLOBAL.cache.copySchedules = $("#movies-scheduler").MoviesScheduler("getSchedules");
        _GLOBAL.cache.copyMoviesIndex = $("#movies-scheduler").MoviesScheduler("getMoviesIndex");

        $('#main-notification').html('Copy : ' + _GLOBAL.cache.copyDate);
        $('#main-notification').jqxNotification('open');
    });
    
    $("#btn-paste").click(function () {
        
        if(!confirm("Copy from "+_GLOBAL.cache.copyDate.substring(0,10)+" to "+_GLOBAL.cache.dateSelected.substring(0,10))) return;

        $("#movies-scheduler").MoviesScheduler("setSchedules",_GLOBAL.cache.copySchedules);
        $("#movies-scheduler").MoviesScheduler("setMoviesIndex",_GLOBAL.cache.copyMoviesIndex);
        $("#movies-scheduler").MoviesScheduler("scheduleRender");
    });

    $('#mini-calendar').on('click', "[role=today],[role=next-day]", function () {
    
        $($('.mini-calendar-selected')[0]).removeClass('mini-calendar-selected');
        $(this).addClass('mini-calendar-selected');

        _GLOBAL.cache.dateSelected = $(this).attr("date");

        $.ajax({type: "post", url: "modules/moviesscheduler/moviesscheduler.php?action=get-schedules", data: {post: {date: _GLOBAL.cache.dateSelected}},
            success: function (response) {
                var obj = JSON.parse(response);
                moviesIndex = obj.moviesIndex ? obj.moviesIndex : {};
                _GLOBAL.cache.$new = obj.$new ? true : false;

                applyColors();
                $("#movies-scheduler").MoviesScheduler({schedules: obj.schedules, moviesIndex: moviesIndex});
                $("#movies-scheduler").MoviesScheduler("scheduleRender");

                summary();
            }});
    }); //!important!

    $("#btn-confirm").click(function () {
        var data = {};
        data.date = _GLOBAL.cache.dateSelected;
        data.schedules = $("#movies-scheduler").MoviesScheduler("getSchedules");
        if (confirm("Sure?"))
            $.ajax({type: "post", url: "modules/moviesscheduler/moviesscheduler.php?action=apply", data: {post: data},
                success: function (r) {
                    _GLOBAL.processes.alldone = true;
                    $('#mini-calendar div[date^='+_GLOBAL.cache.dateSelected.slice(0,10)+']').trigger("click");

                    $('#main-notification').html('Saved')
                    $('#main-notification').jqxNotification('open');
                }
            });
    });

    $('#movies-scheduler').on('click', 'i[role=btn-m-more]', function () {

        if(_GLOBAL.processes.alldone===false || _GLOBAL.cache.$new===true) return;

        var data = JSON.parse($($(this).closest('div[role=on-timeline]')[0]).attr('data').replace(/'/g,'"'));

        var roomno = $($(this).closest('div[role=room]')[0]).attr('no');
        var sameprice = prompt('Input (same) price for this showtime:', 0);

        if (sameprice > 0) {
            var newData = {
                date: _GLOBAL.cache.dateSelected,
                roomno: roomno,
                _id: data.movieId,
                start: data.start,
                samePrice: sameprice
                };

                $.ajax({type:'post',url:'modules/moviesscheduler/moviesscheduler.php?action=same-price',data:{post:newData},
                success:function(res){
                    //todo
                    console.log(res)
                }
            });

        } else {
                //remove same price
                $.ajax({type:'post',url:'modules/moviesscheduler/moviesscheduler.php?action=same-price-remove',data:{post:data},
                    success:function(res){
                        //todo
                        console.log(res)
                    }
                });
        }
        
            
    });

    $('#movies-scheduler').on('mouseover', 'i[role=inf-events]', function() {
        var data = JSON.parse( $($(this).closest('div[role=on-timeline]')[0]).attr('data').replace(/'/g,'"') );

        $(this).jqxTooltip({content: 'Same Price : ' + data.events.samePrice, position: 'top', autoHide: true, trigger: 'none', closeOnClick: true, theme:_GLOBAL.theme});
        $(this).jqxTooltip('open');
    });

    $('#wrap-scroll').scroll(function(e){
        $('#_1,#_2,#_3').scrollLeft(this.scrollLeft);
    });

    $('div[role=room]').on('click','div[role=rest]', function(){
        if($(':first-child',this)[0].value <= 5) $(this).css({width:'50px'})
    })

    $('div[role=room]').on('dblclick','div[role=rest]', function(){
        $(this).css({width:$(':first-child',this)[0].value*2+'px'})
    })


    //BOMB
    $("#mini-calendar div[role=today]").trigger("click");
});