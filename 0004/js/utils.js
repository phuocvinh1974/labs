/* prototypes */
Date.prototype.toYMDFormat = function () {//return string
    return this.getFullYear() + "-" + (this.getMonth() + 1).LPad() + "-" + this.getDate().LPad();
};
Date.prototype.toDMFormat = function () {//return string
    return [this.getDate().LPad(),(this.getMonth() + 1).LPad()].join("-");
};
String.prototype.toMinutes = function () {//return number
    var t = this.split(":");
    if (t[0])
        return t = t.length - 1 ? parseInt(t[0]) * 60 + parseInt(t[1]) : parseInt(t[0]);
    return parseInt(this);
};
String.prototype.singlequotesReplace = function () {//return string
    return this.replace(/'/g, '"');
};
Number.prototype.LPad = function () {//return string
    return this > 9 ? this : "0" + this;
};
Number.prototype.minutesToTime = function () {//return string
    var h = parseInt(this / 60).LPad();
    var m = parseInt(this - h * 60).LPad();
    return h + ":" + m;
};
Number.prototype.formatNumber = function () {// return string
    return this.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
};
Number.prototype.makeArray = function () { //return array
    var a = [];
    for(var i = 0; i <= this; i++)
        a.push(i)

    return a;
};
