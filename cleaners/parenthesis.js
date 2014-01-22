var regexRemoveParens = /\(.*\)/g;
module.exports = function(options) {
	return {
		beforeClean: function(text) {
			return text.replace(regexRemoveParens, '');
		}
	};
};
