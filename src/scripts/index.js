/*!
 * interactive-annotation-debate
 *
 * @version development
 * @author Simon Elvery <elvery.simon@abc.net.au>
 */

var doc, title, svgs, ns, n, parseTeaser, narrative, teasers, propositionNode, $nav, $stickyPosition, pageType;

doc = document;
n = require('narrative-core');
parseTeaser = require('./parse-teaser');
ns = require('util-news-selectors');

svgs = {
	for: require('../templates/for.hbs'),
	against: require('../templates/against.hbs'),
	forTitle: require('../templates/for-title.hbs'),
	againstTitle: require('../templates/against-title.hbs'),
	forSmall: require('../templates/for-small.hbs'),
	againstSmall: require('../templates/against-small.hbs')
};

// Initialise narrative
n.nav({
	shareText: 'Double Edge Words',
	shareHashtags: ['doubleedgewords']
});
narrative = n();
$nav = $('.Narrative-nav');

title = doc.querySelector('.Narrative-headerTitle');
title.innerHTML = title.textContent.split(':').map(function(chunk, i){
		if (i === 0) {
		pageType = chunk.trim().toLowerCase();
		if (pageType === 'for' || pageType === 'against') {
			$stickyPosition = $('<div class="stickyPosition">'+svgs[pageType+'Title']()+'</div>').appendTo('body');
			$('.Narrative-page').addClass(pageType);
			return svgs[pageType+'Title']();
		} else {
			pageType = 'topic';
			$('.Narrative-page').addClass('topic');
		}
	}
	return '<span>'+chunk.trim()+'</span>';
}).join(' ');

$(window).on('scroll', function(){
	var navOffsetTop = $nav.position().top;
	var windowScrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

	if (windowScrollY > navOffsetTop) {
		$stickyPosition.addClass('is-visible');
	} else {
		$stickyPosition.removeClass('is-visible');
	}
});

propositionNode = doc.querySelector('#panelproposition');
teasers = Array.prototype.slice.call(propositionNode.querySelectorAll('.inline-content, aside'))
	.map(require('./parse-teaser'));

// Remove old teasers
teasers.forEach(function(d){
	d.node.parentNode.removeChild(d.node);
});

// Put new elements in
propositionNode.innerHTML = propositionNode.innerHTML + teasers.reduce(function(html, teaser){
	teaser.inactive = teaser.side !== pageType;
	if (pageType !== 'topic') {
		teaser.svg = svgs[teaser.side+'Small']();
		return html += require('../templates/container-small.hbs')(teaser);
	}
	teaser.svg = svgs[teaser.side]();
	return html += require('../templates/container.hbs')(teaser);
},'<div>') + '</div>';

// What kind of page is this?


// Initialise context cards
require('interactive-context-cards')({
	cardTemplate: require('../templates/card.hbs')
});
