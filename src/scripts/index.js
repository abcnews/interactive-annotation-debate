/*!
 * interactive-annotation-debate
 *
 * @version development
 * @author Simon Elvery <elvery.simon@abc.net.au>
 */

var doc, contextify, title, svgs, ns, n, parseTeaser, narrative, teasers, propositionNode, $nav, $stickyPosition, pageType;

doc = document;
n = require('narrative-core');
parseTeaser = require('./parse-teaser');
ns = require('util-news-selectors');
contextify = require('interactive-context-cards');

svgs = {
	for: require('../templates/for.hbs'),
	against: require('../templates/against.hbs'),
	forTitle: require('../templates/for-title.hbs'),
	againstTitle: require('../templates/against-title.hbs'),
	forSmall: require('../templates/for-small.hbs'),
	againstSmall: require('../templates/against-small.hbs'),
	title: require('../templates/write-to-reply.hbs')
};

// Initialise narrative
n.nav({
	shareText: 'Write to Reply',
	shareHashtags: ['write2reply']
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
			return svgs.title();
		}
	}
	return '<span>'+chunk.trim()+'</span>';
}).join(' ');

if (pageType !== 'topic') {
	$(svgs.title()).insertAfter('.Narrative-navLogo');
}

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

// Annotations

// Initialise context cards
contextify({
	cardTemplate: require('../templates/card.hbs'),
	data: {
		author: $('[data-beacon="interactive-context-cards"]').closest(ns('embed:wysiwyg')).prev('h2,h3,h4').text().replace('Annotations by ','')
	}
});
