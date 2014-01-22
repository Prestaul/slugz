module.exports = function(maxChars) {
	return {
		afterClean: function(text) {
			if(text.length <= maxChars)
				return text;
			else if(text.charAt(maxChars) === '-')
				return text.substr(0, maxChars);
			else
				return text.substr(0, text.lastIndexOf('-', maxChars)) || text.substr(0, maxChars);
		}
	};
};
