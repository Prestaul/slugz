var assert = require('chai').assert,
	Handleify = require('../index');


function generateTest(cases, slugz) {
	return function() {
		var handles = Object.keys(cases);

		handles.forEach(function(handle) {
			assert.equal(slugz(cases[handle]), handle);
		});
	};
}


var BARE_MINIMUM = {
	'advanced-php-programming': 'Advanced PHP Programming',
	'developing-hybrid-iphone-apps': 'Developing Hybrid iPhone Apps',
	'its-jonny': "It's Jonny!"
};

describe('slugz', function() {
	var slugz = Handleify();

	it('should do the bare minimum', generateTest(BARE_MINIMUM, slugz));

	it('should remove appostrophes', generateTest({
		'treat-high-blood-pressure-before-its-too-late': "Treat High Blood Pressure Before It's Too Late",
		'your-dogs-pain-medications-and-muscle-relaxants-dangerous-to-humans': "Your Dog's Pain Medications and Muscle Relaxants: Dangerous to Humans"
	}, slugz));

	it('should replace illegal chars with hyphens', generateTest({
		'worst-nfl-off-seasons-of-2013': 'Worst NFL Off-Seasons of 2013',
		'the-best-of-both-worlds': 'The Best of Both Worlds',
		'high-blood-pressure-know-your-medications': 'High Blood Pressure: Know Your Medications',
		'natural-ways-to-control-high-blood-pressure-and-better-yet-prevent-it': 'Natural Ways to Control High Blood Pressure and, Better Yet, Prevent It!',
		'virtual-minds-and-the-creation-of-immortality': 'Virtual Minds and the Creation of Immortality'
	}, slugz));

	it('should not produce consecutive hyphens', generateTest({
		'rheos-a-pacemaker-to-lower-high-blood-pressure': 'Rheos: A "Pacemaker" to Lower High Blood Pressure',
		'this-is-who-i-am-who-are-you': 'This is who I am... Who are you?'
	}, slugz));


	describe('with custom', function() {
		var myButt = {
			'leveraging-the-power-of-my-butt': 'Leveraging the Power of "The Cloud"',
			'my-butt-coming-soon-to-a-computer-near-you': 'The Cloud: Coming Soon To a Computer Near You!',
			'you-and-my-butt-a-perfect-pair': 'You and The Cloud: A Perfect Pair'
		};

		function myButtifier(text) {
			return text.replace(/(^|_)the_+cloud(_|$)/g, '_my_butt_');
		}

		describe('function', function() {
			var slugz = Handleify();

			slugz.use(myButtifier);

			it('should apply the function', generateTest(myButt, slugz));
		});

		describe('function', function() {
			var slugz = Handleify();

			slugz.use({
				clean: myButtifier
			});

			it('should apply the cleaner', generateTest(myButt, slugz));
		});
	});


	describe('with "common-words"', function() {
		var slugz = Handleify().use('common-words');

		it('should do the bare minimum', generateTest(BARE_MINIMUM, slugz));

		it('should remove common words', generateTest({
			'worst-nfl-off-seasons-2013': 'Worst NFL Off-Seasons of 2013',
			'virtual-minds-creation-immortality': 'Virtual Minds and the Creation of Immortality',
			'human-medication-never-give-dog': 'Human Medication You Should Never Give Your Dog',
			'treating-dog-human-medications': 'Treating Your Dog With Human Medications',
			'human-cough-medicines-kennel-cough-dogs': 'Human Cough Medicines for Kennel Cough in Dogs',
			'staying-cool-hot-outside': "Staying Cool When It's Hot Outside"
		}, slugz));

		it('should not remove first or last word', generateTest({
			'the-best-both-worlds': 'The Best of Both Worlds',
			'this-am-you': 'This is who I am... Who are you?',
			'your-dogs-pain-medications-muscle-relaxants-dangerous-humans': "Your Dog's Pain Medications and Muscle Relaxants: Dangerous to Humans",
			'its-not-me': "It's Not You... It's Me."
		}, slugz));

		it('should treat hyphenated words as a single word', generateTest({
			'save-money-over-the-counter-medications': 'Save Money on Over-the-Counter Medications',
			'javascript-clearly-best-in-show': 'Javascript Is Clearly Best-in-Show'
		}, slugz));

		it('should not remove "how to"', generateTest({
			'how-to-treat-high-blood-pressure-naturally': 'How to Treat High Blood Pressure Naturally',
			'programming-how-tos-b-testing': 'Programming How Tos: A/B Testing'
		}, slugz));

		describe('and a custom word list', function() {
			var slugz = Handleify().use('common-words', {
				remove: ['best', 'hot', 'humans?', 'its', 'the', 'worst', 'your'],
				preserve: ['hot[_\\-]+momma', 'your_+dogs?']
			});

			it('should do the bare minimum', generateTest(BARE_MINIMUM, slugz));

			it('should remove custom words', generateTest({
				'treating-your-dog-with-medications': 'Treating Your Dog With Human Medications',
				'virtual-minds-and-creation-of-immortality': 'Virtual Minds and the Creation of Immortality',
				'staying-cool-when-outside': "Staying Cool When It's Hot Outside",
				'how-your-dog-percieves-in-groups': 'How Your Dog Percieves Humans In Groups'
			}, slugz));

			it('should not remove first or last word', generateTest({
				'worst-nfl-off-seasons-of-2013': 'Worst NFL Off-Seasons of 2013',
				'human-medication-you-should-never-give-your-dog': 'Human Medication You Should Never Give Your Dog',
				'human-cough-medicines-for-kennel-cough-in-dogs': 'Human Cough Medicines for Kennel Cough in Dogs',
				'the-of-both-worlds': 'The Best of Both Worlds',
				'your-dogs-pain-medications-and-muscle-relaxants-dangerous-to-humans': "Your Dog's Pain Medications and Muscle Relaxants: Dangerous to Humans"
			}, slugz));

			it('should treat hyphenated words as a single word', generateTest({
				'javascript-is-clearly-best-in-show': 'Javascript Is Clearly Best-in-Show'
			}, slugz));
		});
	});


	describe('with "parenthesis"', function() {
		var slugz = Handleify().use('parenthesis');

		it('should do the bare minimum', generateTest(BARE_MINIMUM, slugz));

		it('should remove text in parenthesis', generateTest({
			'save-money-on-over-the-counter-medications': 'Save Money on Over-the-Counter (OTC) Medications',
			'natural-ways-to-control-high-blood-pressure': 'Natural Ways to Control High Blood Pressure (and, Better Yet, Prevent It!)'
		}, slugz));
	});


	describe('with "how-to"', function() {
		var slugz = Handleify().use('how-to');

		it('should do the bare minimum', generateTest(BARE_MINIMUM, slugz));

		it('should remove "how to"', generateTest({
			'build-a-hover-car': 'How to Build a Hover Car',
			'healthcare-headlines-deal-with-high-blood-pressure': 'Healthcare Headlines - How to Deal with High Blood Pressure',
			'dance-like-you-mean-it': 'HowTo: Dance Like You Mean It',
			'zen': 'Zen: How-to'
		}, slugz));
	});


	describe('with "max-words"', function() {
		var slugz = Handleify().use('max-words', 5);

		it('should do the bare minimum', generateTest(BARE_MINIMUM, slugz));

		it('should limit the number of words', generateTest({
			'healthcare-headlines-how-to-deal': 'Healthcare Headlines - How to Deal with High Blood Pressure',
			'natural-ways-to-control-high': 'Natural Ways to Control High Blood Pressure (and, Better Yet, Prevent It!)',
			'save-money-on-over-the': 'Save Money on Over-the-Counter (OTC) Medications'
		}, slugz));
	});


	describe('with "max-chars"', function() {
		var slugz = Handleify().use('max-chars', 43);

		it('should do the bare minimum', generateTest(BARE_MINIMUM, slugz));

		it('should limit the number of characters', generateTest({
			'healthcare-headlines-how-to-deal-with': 'Healthcare Headlines - How to Deal with Highss Blood Pressure',
			'healthcare-headlines-how-to-deal-with-highs': 'Healthcare Headlines - How to Deal with Highs Blood Pressure',
			'healthcare-headlines-how-to-deal-with-high': 'Healthcare Headlines - How to Deal with High Blood Pressure',
			'healthcare-headlines-how-to-deal-with-hig': 'Healthcare Headlines - How to Deal with Hig Blood Pressure',
			'natural-ways-to-control-high-blood-pressure': 'Natural Ways to Control High Blood Pressure (and, Better Yet, Prevent It!)',
			'save-money-on-over-the-counter-otc': 'Save Money on Over-the-Counter (OTC) Medications'
		}, slugz));

		it('should work with one long word', generateTest({
			'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopq': 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
		}, slugz));
	});


	describe('with all the cleaners', function() {
		var slugz = Handleify();

		slugz
			.use('common-words')
			.use('parenthesis')
			.use('how-to')
			.use('max-words', 5)
			.use('max-chars', 35);

		it('should do the bare minimum', generateTest(BARE_MINIMUM, slugz));

		it('should remove "how to"', generateTest({
			'rheos-pacemaker-lower-high-blood': 'Rheos: A "Pacemaker" to Lower High Blood Pressure',
			'this-am-you': 'This is who I am... Who are you?',
			'javascript-clearly-best-in-show': 'Javascript Is Clearly Best-in-Show',
			'save-money-over-the-counter': 'Save Money on Over-the-Counter (OTC) Medications',
			'natural-ways-control-high-blood': 'Natural Ways to Control High Blood Pressure (and, Better Yet, Prevent It!)',
			'build-hover-car': 'How to Build a Hover Car',
			'healthcare-headlines-deal-high': 'Healthcare Headlines - How to Deal with High Blood Pressure'
		}, slugz));
	});

	describe('with utf8 characters', function() {
		var slugz = Handleify();

		it('should handle a portuguese headline', generateTest({
			'receita-federal-autua-itaú-unibanco-por-fusão': 'Receita Federal autua Itaú Unibanco por fusão'
		}, slugz));

	});

});
