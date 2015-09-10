var _GLOBAL = { theme: "metro", cache: {}, processes: { alldone: true } }; // GLOBAL VARS SYSTEM
var _GES = {}; // GLOBAL EVENTS

$(document).ready(function () {
	$.ajaxSetup ({ cache: false });

    $("#main-menu").jqxMenu({clickToOpen: true, animationHideDuration: 0, animationShowDuration: 0, animationHideDelay: 0, animationShowDelay: 0, autoCloseInterval: 0, autoCloseOnClick: true, theme: _GLOBAL.theme});

    // events
    $("#main-menu").on("itemclick", function (e) {
        $("body > div").not("#main-menu,#main-content,#main-notification,.jqx-notification-container").remove();

        switch (e.args.id) {
            case "mnu-members":
                $("#main-content").load("modules/members/screen-members.php");

                $("[id^=mnu-]").removeClass("mnu-selected");
                $("#mnu-members").addClass("mnu-selected");
                break;

            case "mnu-movieslist":
                $("#main-content").load("modules/movieslist/screen-movieslist.php");

                $("[id^=mnu-]").removeClass("mnu-selected");
                $("#mnu-movieslist").addClass("mnu-selected");
                break;

            case "mnu-moviesscheduler":
                $("#main-content").load("modules/moviesscheduler/screen-moviesscheduler.php");

                $("[id^=mnu-]").removeClass("mnu-selected");
                $("#mnu-moviesscheduler").addClass("mnu-selected");
                break;

            case "mnu-home":
                $("#main-content").load("modules/home/screen-home.php");

                $("[id^=mnu-]").removeClass("mnu-selected");
                $("#mnu-home").addClass("mnu-selected");
                break;

            case "mnu-tickets":
                $("#main-content").load("modules/tickets/screen-tickets.php");

                $("[id^=mnu-]").removeClass("mnu-selected");
                $("#mnu-tickets").addClass("mnu-selected");
                break;

            case 'mnu-price':
                $("#main-content").load("modules/price/screen-price.php");

                $("[id^=mnu-]").removeClass("mnu-selected");
                $("#mnu-tickets").addClass("mnu-selected");
                break;
        }
    });

//    $(window).on("beforeunload", function () {
//        return false;
//    });
});