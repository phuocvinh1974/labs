Date.prototype.toDMString = function () {
	return [ this.getDate().toZPString(), (this.getMonth() + 1).toZPString() ].join('-');
};

Date.prototype.toDayNameString = function () {
	var n = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	return n[this.getDay()];
};

Date.prototype.Today = function () {
	return [this.getFullYear(), (this.getMonth() + 1).toZPString(), this.getDate().toZPString()].join('-');
};

Number.prototype.toZPString = function () { // return 0n (if n < 10) string
	return this > 9 ? this : '0' + this;
};

Number.prototype.toHMTString = function () { // return HH:MM string
    var h = parseInt(this / 60).toZPString();
    var m = parseInt(this - h * 60).toZPString();
    return h + ":" + m;
};

Number.prototype.toCurrencyString = function () { // return 1.000.000.00 string
    return this.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
};