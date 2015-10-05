
var libpath    = require('path'),
    Handlebars = require('handlebars');
var prettyjson = require('prettyjson');
var analyzer = require('enwiktionary-analyzer').analyzer;
var escape = Handlebars.Utils.escapeExpression;

// CSS
exports.addLocalCSS      = addLocalCSS;
exports.addRemoteCSS     = addRemoteCSS;
exports.localCSS         = localCSS;
exports.remoteCSS        = remoteCSS;

// JS
exports.addLocalJS = addLocalJS;
exports.localJS    = localJS;

// Title, headings, and nav
exports.setTitle       = setTitle;

exports.prettyPrintJson = prettyPrintJson;
exports.renderWordLink = renderWordLink;
exports.renderWordLinkTitle = renderWordLinkTitle;
// -- Helpers ------------------------------------------------------------------

function addLocalCSS(path, options) {
    var css   = this.localCSS || (this.localCSS = []),
        entry = {};

    if (this.relativePath) {
        path = libpath.relative(this.relativePath, path);
    }

    entry.path = path;

    if (options.hash.hasOldIE) {
        entry.oldIE = libpath.join(
            libpath.dirname(path),
            libpath.basename(path, '.css') + '-old-ie.css'
        );
    }

    css[options.hash.prepend ? 'unshift' : 'push'](entry);
}

function addRemoteCSS(path, options) {
    var css = this.remoteCSS || (this.remoteCSS = []);
    css[options.hash.prepend ? 'unshift' : 'push'](path);
}


function addLocalJS(path, options) {
    var js = this.localJS || (this.localJS = []);

    if (this.relativePath) {
        path = libpath.relative(this.relativePath, path);
    }

    js[options.hash.prepend ? 'unshift' : 'push'](path);
}


function localCSS(options) {
    var entries   = this.localCSS,
        output    = '',
        comboPath = '/combo/' + this.version + '?';

    if (!(entries && entries.length)) { return output; }

    if (this.isProduction) {
        entries = entries.reduce(function (combo, entry) {
            if (entry.oldIE || combo.oldIEPaths) {
                combo.oldIEPaths || (combo.oldIEPaths = combo.paths.concat());
                combo.oldIEPaths.push(entry.oldIE || entry.path);
            }

            combo.paths.push(entry.path);
            return combo;
        }, {paths: []});

        entries = [{
            path : comboPath + entries.paths.join('&'),
            oldIE: entries.oldIEPaths && comboPath + entries.oldIEPaths.join('&')
        }];
    }

    entries.forEach(function (entry) {
        output += options.fn(entry);
    });

    return output;
}

function remoteCSS(options) {
    var urls   = this.remoteCSS,
        output = '';

    if (!(urls && urls.length)) { return output; }

    urls.forEach(function (url) {
        output += options.fn(url);
    });

    return output;
}

function localJS(options) {
    var urls   = this.localJS,
        output = '';

    if (!(urls && urls.length)) { return output; }

    if (this.isProduction) {
        urls = ['/combo/' + this.version + '?' + urls.join('&')];
    }

    urls.forEach(function (url) {
        output += options.fn(url);
    });

    return output;
}

function setTitle(title) {
    this.title = title;
}


function prettyPrintJson(jsonobj) {
    return prettyjson.render(jsonobj, {
      noColor: true
    });
}


function renderWordLink(wordLink) {
  var word = wordLink[1];
  var lang = wordLink[0];
  return new Handlebars.SafeString(
    '<a href=/'+word+'/'+lang+'>('+lang+') '+word+'</a>' 
    );
}


function renderWordLinkTitle(wordLink) {
  var word = wordLink[1];
  var lang = analyzer.canonicalLanguageName(wordLink[0]);

  return new Handlebars.SafeString(
    word + ' ('+lang+')'
  );
}
