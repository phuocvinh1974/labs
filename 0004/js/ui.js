(function ($) {
    $.fn.scrollToElem = function () {
        var self = this;
        var Ox = $(self).offset().left;
		
        var find = function () {
            var cur;
			
            $(self.children().children()).each(function () {
                if ($(this).offset().left <= Ox) {
                    cur = this;
                }
            });
			
            return cur;
        }

        self.on("next", function () {
		
            var n = $(find()).next();
			
            if (n.length)
                $(self).animate({scrollLeft: n.offset().left - Ox + Math.abs($(self.children()).offset().left - Ox)}, 250);
            else
                $(self).trigger("ER");
        });

        self.on("prev", function () {
            var n = $(find()).prev();
            if (n.length)
                $(self).animate({scrollLeft: n.offset().left - Ox + Math.abs($(self.children()).offset().left - Ox)}, 250);
            else
                $(self).trigger("EL");
        });

    }
}(jQuery));