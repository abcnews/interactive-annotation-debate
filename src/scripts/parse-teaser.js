var doc, dewysiwyg;

dewysiwyg = require('util-dewysiwyg');
doc = document;

module.exports = function(teaser) {
	var div, link, side, inner;

	// A temporary container for composition
	div = doc.createElement('div');

	// Mobile doesn't have an .inner
	inner = teaser.querySelector('.inner') || teaser;

	// Clean up.
	div.innerHTML = dewysiwyg(inner.innerHTML);

	// Extract
	link = div.querySelector('h2 a');
	side = div.querySelector('p:first-child').textContent.replace(':','').toLowerCase().trim();

	// Return details
	return {
		node: teaser,
		href: link.href,
		text: link.text,
		title: link.title || link.text,
		side: side,
		byline: div.querySelector('h2+p').innerHTML
	};
};