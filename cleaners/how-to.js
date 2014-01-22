var regexRemoveHowTo = /\bhow[\s-]*to\b/g;
module.exports = function(options) {
	return {
		beforeClean: function(text) {
			return text.replace(regexRemoveHowTo, '');
		}
	};
};
