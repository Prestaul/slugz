var COMMON_WORDS = [
		'a',
		'about',
		'an',
		'and',
		'are',
		'at',
		'be',
		'before',
		'by',
		'can',
		'do',
		'for',
		'from',
		'get',
		'have',
		'how',
		'i',
		'in',
		'is',
		'it',
		'its',
		'make',
		'my',
		'need',
		'new',
		'of',
		'on',
		'or',
		'should',
		'that',
		'the',
		'this',
		'to',
		'up',
		'use',
		'what',
		'when',
		'who',
		'with',
		'you',
		'your'
	],
	EXCEPTIONS = [
		'how[_\\-]*tos?'
	];


var regexMoreUnderscores = /_/g;
module.exports = function(options) {
	var words = options && options.remove && options.remove.push ? options.remove : COMMON_WORDS,
		preserve = options && options.preserve && options.preserve.push ? options.preserve : EXCEPTIONS,
		regexReplaceCommon = new RegExp('(?:^|_)(' + preserve.join('|') + ')(?:_|$)|_(?:' + words.join('|') + ')_', 'g');

	return function(text) {
		return text.replace(regexMoreUnderscores, '__')
			.replace(regexReplaceCommon, '$1_');
	};
};
