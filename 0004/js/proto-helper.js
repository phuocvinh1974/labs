Date.prototype.toDMString = function () {
	return [ this.getDate().toZPString(), (this.getMonth() + 1).toZPString() ].join('-');
}

Number.prototype.toZPString = function () {
	return this > 9 ? this : '0' + this;
}

Number.prototype.toHMString = function () {
	var h = parseInt(this / 60).toZPString();
    var m = parseInt(this - h * 60).toZPString();
    return h + ":" + m;
}

String.prototype.singlequotesReplace = function () {
    return this.replace(/'/g, '"');
}