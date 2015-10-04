'use strict';

var utils = require('../lib/utils');

// -----------------------------------------------------------------------------

function render(viewName, layoutPath) {
    return function (req, res) {
        if (layoutPath) {
            res.locals.layout = layoutPath;
        }
        res.render(viewName);
    };
}

function redirect(url, status) {
    return function (req, res) {
        res.redirect(status || 302, url);
    };
}


function renderHome(req, res) {
	var word = req.params.word || req.query.word;
	var lang = req.params.lang || req.query.lang || "en";
	res.render('home', {
		wordQuery:word,
		langQuery:lang,
		xxx:"XXXXXX"
	});
}


exports.renderHome = renderHome
exports.render   = render;
exports.redirect = redirect;

