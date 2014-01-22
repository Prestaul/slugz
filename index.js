var path = require('path');

module.exports = function() {

	var beforeClean = [],
		duringClean = [],
		afterClean = [];

	function slugz(text) {
		var handle = text.toLowerCase();

		beforeClean.forEach(function(fn) {
			handle = fn(handle);
		});

		handle = collapseAppostrophes(handle);
		handle = replaceIllegals(handle);

		duringClean.forEach(function(fn) {
			handle = cleanEnds(handle);
			handle = fn(handle);
		});

		handle = hyphenate(handle);
		handle = cleanEnds(handle);

		afterClean.forEach(function(fn) {
			handle = fn(handle);
		});

		handle = cleanEnds(handle);

		return handle;
	}

	slugz.use = function(cleaner, options) {
		if(typeof cleaner === 'string') {
			cleaner = require(path.join(__dirname, 'cleaners', cleaner + '.js'))(options);
		}

		if(typeof cleaner === 'function') {
			duringClean.push(cleaner);
		} else {
			if(typeof cleaner.beforeClean === 'function') beforeClean.push(cleaner.beforeClean);
			if(typeof cleaner.clean === 'function') duringClean.push(cleaner.clean);
			if(typeof cleaner.afterClean === 'function') afterClean.push(cleaner.afterClean);
		}

		return slugz;
	};

	return slugz;

};


var regexCollapseAppostrophes = /'/g;
function collapseAppostrophes(text) {
	return text.replace(regexCollapseAppostrophes, '');
}

var regexReplaceIllegals = /[^a-z0-9\-]/g;
function replaceIllegals(text) {
	return text.replace(regexReplaceIllegals, '_');
}

var regexHyphenate = /[_\-]+/g;
function hyphenate(text) {
	return text.replace(regexHyphenate, '-');
}

var regexCleanEnds = /^[_\-]+|[_\-]+$/;
function cleanEnds(text) {
	return text.replace(regexCleanEnds, '');
}
