'use strict';

var utils = require('../lib/utils');
var wikt = require('enwiktionary-analyzer');


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

	function finish(err, parsedWord, wordHTMLWiktionary) {
		res.render('home', {
			wordQuery:word,
			langQuery:lang,
			error:err,
			word:parsedWord,
			wordHTMLWiktionary:wordHTMLWiktionary
		});
	}
	if (word && lang) {
		wikt.api.fetchArticleForLanguageHtml(word, lang, function(err, articleWiktHtml) {
			if (err) 
				return finish("HTML Wiki Article Not Found");

			wikt.api.fetchArticle(wikt.api.getArticleName(word, lang), function(err, article) {
				if (err) 
					return finish("WikiText Article Not Found");
				wikt.analyzer.parseArticle(word, article, function(err, parsedWord){
					if (err)
						return finish("Problem With Parsing");
					var parsedWordInLang = parsedWord[lang];
					if (!parsedWordInLang)
						return finish("No Such Lang In Word");
					finish(null, parsedWordInLang, articleWiktHtml);
				});
			});

		})
	} else {
		finish(null);
	}
	
}


exports.renderHome = renderHome
exports.render   = render;
exports.redirect = redirect;

