(function ($) {
    $.fn.MoviesIndex = function () {
        var self = this;
        var methods = {
            add: function (a) {
                var e = '<div role="index-selected" draggable="true" data="' + JSON.stringify(a).replace(/"/g, "'") + '">' +
                        '<i role="btn-mi-remove" class="fa fa-remove"></i><span>' + a.IntTitle + '</span>' +
                        '</div>';
                $(self).append(e);
            },
            remove: function (elm) {
                $(elm).closest("div[role=index-selected]").remove();
            }
        };
        if (arguments.length) {
            switch (typeof (arguments[0])) {
                case 'string':
                    switch (arguments[0]) {
                        case "add":
                            methods.add(arguments[1]);
                            break;
                        case "remove":
                            methods.remove(arguments[1]);
                            break;
                    }
                    break;
            }

            if (typeof (arguments[arguments.length - 1]) === 'function')
                arguments[arguments.length - 1]();
        }
    }
}(jQuery));

(function ($) {
    var source;    
    $.fn.MoviesScheduler = function () {
        var self = this; 
        var widthEx = function (obj){
            var start = parseInt(obj.start);
            var end = parseInt(obj.end);

            if(start==0) 
                return (end - start) * 2 - 800;
            else 
                return (end - start) * 2;
        };
        var methods = {
            add: function (room, movie) {
                var found = methods.findRoom(room);
                var prev = found.schedule[found.schedule.length - 1];
                var format = methods.applyFormat( source.moviesIndex[movie._id].Format );

                if (prev._id === undefined)
                    found.schedule.push({_id: movie._id, format:format, start: parseInt(prev.end), end: source.moviesIndex[movie._id].Runtime.toMinutes() + parseInt(prev.end)});
                else {
                    found.schedule.push({start: parseInt(prev.end), end: parseInt(prev.end) + 5});
                    found.schedule.push({_id: movie._id, format:format, start: parseInt(prev.end) + 5, end: source.moviesIndex[movie._id].Runtime.toMinutes() + parseInt(prev.end) + 5});
                }
            },
            update: function (obj) {
                var found = methods.findRoom(obj.room);
                var count = parseInt($($(obj.element).closest("div[role=rest]")[0]).attr("count"));
                var changed = count ? parseInt($(obj.element).val()) : $(obj.element).val().toMinutes();
                found.schedule[count].end = parseInt(found.schedule[count].start) + changed;

                methods.timeRecalc(obj.room, count);
            },
            remove: function (obj) {
                var found = methods.findRoom(obj.roomno);
                if (found.schedule.length - 1 == obj.count && found.schedule[obj.count - 1]._id === undefined && (obj.count - 1) !== 0)
                    found.schedule.splice(obj.count - 1, 2);
                else
                    found.schedule.splice(obj.count, 2);
                methods.timeRecalc(obj.roomno, 0);
            },
            scheduleRender: function (roomNo) {
                if (roomNo) {
                    var found = methods.findRoom(roomNo);
                    var thisEofRoom = $($(self).find("[role=room][no=" + roomNo + "]")[0]);
                    thisEofRoom.empty();
                    var count = 0;
                    $.each(found.schedule, function () {
                        thisEofRoom.append(methods.appendElement(this, count));
                        count++;
                    });
                } else {
                    $.each(source.schedules, function () {
                        var roomNo = this.room;
                        var count = 0;
                        var thisEofRoom = $($(self).find("[role=room][no=" + roomNo + "]")[0]);
                        thisEofRoom.empty();
                        $.each(this.schedule, function () {
                            $($(self).find("[role=room][no=" + roomNo + "]")[0]).append(methods.appendElement(this, count));
                            count++;
                        });
                    });
                }
            },
            /* private */
            findRoom: function (n) {
                for (var i in source.schedules) {
                    if (source.schedules[i].room == n) {
                        return source.schedules[i];
                    }
                }
            },
            appendElement: function (obj, count) {
                if (obj._id) {

                    var movIndex = source.moviesIndex[obj._id];

                    var data = {movieId:obj._id,start:obj.start};

                    var elemevent = '';

                    if (obj.events!==undefined) {
                        data.events = obj.events;
                        elemevent = '<i role="inf-events" class="fa fa-exclamation-circle"></i>';
                    }

                    data = JSON.stringify(data).replace(/"/g,'\''); 

                    return '<div role="on-timeline" data="' + data + '" style="width:' + movIndex.Runtime.toMinutes() * 2 + 'px" count="' + count + '">' +
                            '<div style="background-color:' + movIndex.$bg + ';margin-left:0px;height:21px"><i role="btn-m-more" class="fa fa-bars"></i>' + elemevent + '<i role="btn-m-remove" class="fa fa-remove"></i></div>' +
                            '<div style="overflow-x:hidden;height:21px;">' + movIndex.IntTitle + '</div>' +
                            '<div><span style="margin-right:10px">' + movIndex.Runtime + ' min</span><span role="format">' + movIndex.Format + '</span></div>' +
                            '<div role="start-end"><span>' + parseInt(obj.start).minutesToTime() + '</span><span><i class="fa fa-long-arrow-right" style="margin:0 3px 0 3px"></i></span>' +
                            '<span>' + parseInt(obj.end).minutesToTime() + '</span></div></div>';
                } else {
                    var val = count ? parseInt(obj.end - obj.start) : parseInt(obj.end - obj.start).minutesToTime();
                    return '<div role="rest" style="width:' + widthEx(obj) + 'px;" count="' + count + '"><input value="' + val + '"></div>';
                }
            },
            timeRecalc: function (n, c) {
                var found = methods.findRoom(n);
                for (var i = parseInt(c) + 1; i < found.schedule.length; i++) {
                    if (found.schedule[i]._id) {
                        found.schedule[i].start = parseInt(found.schedule[i - 1].end);
                        found.schedule[i].end = source.moviesIndex[found.schedule[i]._id].Runtime.toMinutes() + parseInt(found.schedule[i].start);
                    } else {
                        var seg = parseInt(found.schedule[i].end) - parseInt(found.schedule[i].start);
                        found.schedule[i].start = parseInt(found.schedule[i - 1].end);
                        found.schedule[i].end = parseInt(found.schedule[i].start) + seg;
                    }
                }
            },
            applyFormat: function (s) {
                return s.split(',').indexOf('3D') >= 0 ? '3D' : '2D';
            }
        };
        if (arguments.length) {
            switch (typeof (arguments[0])) {
                case "string":
                    switch (arguments[0]) {
                        case "add":
                            methods.add(arguments[1], arguments[2]);
                            break;
                        case "update":
                            methods.update(arguments[1]);
                            break;
                        case "remove":
                            methods.remove(arguments[1]);
                            break;
                        case "scheduleRender":
                            methods.scheduleRender(arguments[1]);
                            break;
                        case "getSchedules":
                            return source.schedules;
                            break;
                        case "setSchedules":
                            source.schedules = arguments[1];
                        break;
                        case "getMoviesIndex":
                            return source.moviesIndex;
                            break;
                        case "setMoviesIndex":
                            source.moviesIndex = arguments[1];
                        break;
                    }
                    break;
                case "object":
                    source = arguments[0];
                    break;
            }
            if (typeof (arguments[arguments.length - 1]) === "function")
                arguments[arguments.length - 1]();
        }
    }
}(jQuery));

(function ($) {
    $.fn.MiniCalendar = function () {
        var miniCalendar = [];

        for (var i = 0; i < 8; i++) {
            var d = new Date();
            d.setDate(d.getDate() + i);
            miniCalendar.push(d.toYMDFormat() + "T00:00:00.000Z");
        }

        $(this).empty();

        $(this).append('<div role="today" date="' + miniCalendar[0] + '">TODAY</div>');
        for (var i = 1; i < miniCalendar.length; i++) {
            $(this).append('<div role="next-day" date="' + miniCalendar[i] + '">' + miniCalendar[i].slice(0,10).split("-")[2] + '</div>');
        }

        $.ajax({ type:'post', url:'modules/common/movies-calendar.php',
            success: function(res) { 
                // dat mau sac cho nhung ngay da co lich chieu!
                $.each(JSON.parse(res), function() {
                    var d = new Date(this.date.sec * 1000);
                    var e = '[role=next-day][date^=' + d.toYMDFormat() + ']';
                    if($(e)[0]) $($(e)[0]).addClass('exists');
                });
            }
        });
    }
}(jQuery));

/* MOVIES CALENDAR (TODAY -> NEXT DAYS) */
(function ($) {
    $.fn.MoviesCalendar = function () {
        var self = this;
        
        $(self).empty();

        $.ajax({type:"post",url:"modules/common/movies-calendar.php",
            success:function(res){
                var res = JSON.parse(res)
                for (var i in res) {
                    var d = new Date(res[i].date.sec * 1000);
                    var dText = d.toDMFormat() === new Date().toDMFormat() ? "TODAY" : d.toDMFormat();

                    $(self).append(['<div role="mini-date" date="' + d.toISOString() + '">',dText,'</div>'].join(""))
                }
            }
        });
    }
}(jQuery));

/* TICKETS */
(function ($) {

    var $date, $schedules, $moviesIndex, $moviesShowtime;
    
    $.fn.Tickets = function () {

        var self = this;
        
        var methods = {
            initialize: function (callback) {
                $date = new Date().toYMDFormat() + "T00:00:00.000Z";

                methods.getSchedules($date, function () {
                    if (!$schedules)
                        return;

                    methods.getMoviesIndex(function () {
                        methods.createMoviesShowtime($date);
                        methods.showtimeRender($moviesShowtime);

                        if (typeof callback === "function")
                            callback($date, $moviesIndex);
                    });
                });
            },

            load: function (ondate,callback) {
                
                methods.getSchedules(ondate, function () {
                    if (!$schedules)
                        return;

                    methods.getMoviesIndex(function () {
                        methods.createMoviesShowtime(ondate);
                        methods.showtimeRender($moviesShowtime);

                        if (typeof callback === "function")
                            callback(ondate, $moviesIndex);
                    });
                });
            },

            getSchedules: function (ondate, callback) {
                $.ajax({type: "post", url: "modules/tickets/tickets.php?action=get-schedules", data: {post: {ondate: ondate}},
                    success: function (res) {
                        var _schedules = JSON.parse(res);
                        $schedules = _schedules.notfound ? null : _schedules;

                        if (typeof callback === "function")
                            callback($schedules);
                    }});
            },
            getMoviesIndex: function (callback) {
                var k = Object.keys($schedules)[0];
                var distinct = [];

                $.each($schedules[k], function () {
                    $.each(this.schedule, function () {
                        if (this._id !== undefined)
                            distinct[this._id] = true;
                    });
                });

                $.ajax({type: "post", url: "modules/tickets/tickets.php?action=get-moviesindex", data: {post: {distinct: Object.keys(distinct)}},
                    success: function (res) {
                        $moviesIndex = JSON.parse(res);

                        if (typeof callback === "function")
                            callback($moviesIndex);
                    }});
            },
            createMoviesShowtime: function (ondate, callback) {
                var k = ondate.slice(0, 10)
                $moviesShowtime = [];

                $.each($schedules[k], function () {
                    var currentRoom = this.room;

                    $.each(this.schedule, function () {
                        if (this._id !== undefined) {
                            if ($moviesShowtime[this._id] === undefined)
                                $moviesShowtime[this._id] = new Array({ start: this.start, room: currentRoom, format: this.format, events: this.events });
                            else
                                $moviesShowtime[this._id].push({ start: this.start, room: currentRoom, format: this.format, events: this.events })
                        }
                    });
                });
				
				/* sort inside object : notice */
				for(var k in $moviesShowtime){
					$moviesShowtime[k] = $moviesShowtime[k].sort(function(a,b){ return parseInt(a.start)-parseInt(b.start); });
				}

                if (typeof callback === "function")
                    callback($moviesShowtime);
            },
            showtimeRender: function () {

                for (var o in $moviesShowtime) {
                    var showtime = [];
                    $.each($moviesShowtime[o], function () {
                        
                        var events = '';
                        if(this.events!==undefined) events = ',\'events\':' + JSON.stringify(this.events).replace(/"/g, "'");

                        showtime.push(
							'<div role="showtime" data="{\'room\':\'' + this.room + '\',\'movie\':\'' + o + '\',\'format\':\'' + this.format + '\',\'start\':\'' + this.start + '\'' + events + '}">' +
							'<div role="start">' + parseInt(this.start).minutesToTime() + '</div>' +
							'<div role="P" no="P' + this.room + '" style="color:#fff;text-align:center;font-size:12px !important">P' + this.room + '</div></div>');
                    });

                    $(self).append(
						'<div class="wrap">'+
							'<div role="on-showtime" class="noob noob-inline">' +
							'<div class="lbl-format">' + $moviesIndex[o].Format + '</div>' +
							'<div class="lbl-inttile">' + $moviesIndex[o].IntTitle + '</div>' +
							'<div class="lbl-title">' + $moviesIndex[o].Title + '</div>' +
							showtime.join("") + '</div></div>');
                }
            },
			loadSeatingPlan: function (obj) {
				$(obj.onElement).load('modules/common/room-' + obj.room + '.html',function(){
                    $.ajax({type:"post",url:"modules/tickets/tickets.php?action=load-seats",data:{post:obj},
                        success:function(res){
                            var res = JSON.parse(res);

                            if (!res.notfound) {
                                $.each(res.seats,function(){
                                    $('#'+this.seat).attr({status:this.status})
                                });
                            }
                        }
                    });
                });
			},            
            seatsConfirm: function (obj) {

                $.ajax({type:"post",url:"modules/tickets/tickets.php?action=seats-paid",data:{post:obj},
                    success:function(res){
                        console.log('seats saved!')
                    }
                });
            }
        };
		
        // PROG EVENTS

        // CONTROLLER
        if (arguments.length) {
            switch (arguments[0]) {
                case "initialize":
                    methods.initialize(arguments[1]);
                    break;
                case 'load':
                    methods.load(arguments[1], arguments[2]);
                    break;    
                case 'loadSeatingPlan':
                    methods.loadSeatingPlan(arguments[1]);
                    break;
                case "seatsConfirm":
                    methods.seatsConfirm(arguments[1]);
                    break;
                case 'get-movies-index':
                    return $moviesIndex;
                    break;
            }
        }
    }
}(jQuery));