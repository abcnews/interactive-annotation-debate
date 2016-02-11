/*!
 * interactive-annotation-debate
 *
 * @version development
 * @author Simon Elvery <elvery.simon@abc.net.au>
 */

var hbs, container;

hbs = require('hbsfy/runtime');
container = require('../templates/container.hbs');

$(function () {
    document.getElementById('example').innerHTML = container({name:  "interactive-annotation-debate", class:"classy"});
});
