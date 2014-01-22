module.exports = function(maxWords) {
	return {
		afterClean: function(text) {
			return text.split('-').slice(0, maxWords).join('-');
		}
	};
};
