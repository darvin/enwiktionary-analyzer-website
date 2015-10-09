
var libpath    = require('path'),
    Handlebars = require('handlebars');
var prettyjson = require('prettyjson');
var analyzer = require('enwiktionary-analyzer').analyzer;
var languages = require('enwiktionary-analyzer').languages;
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
exports.renderWordLinkTitle = renderWordLinkTitle;
exports.setCurrentWord = setCurrentWord;
exports.canonicalRoleName = canonicalRoleName;
exports.wordLinkWord = wordLinkWord;
exports.wordLinkLang = wordLinkLang;
exports.wordLinkLangFull = wordLinkLangFull;
exports.wordLinkLangIconLabel = wordLinkLangIconLabel;
exports.ifWordLinkNotCurrentLang = ifWordLinkNotCurrentLang;

exports.math = math;
exports.ifCond = ifCond;
exports.capitalize = capitalize;
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

var currentLang = null;

function setCurrentWord(wordLink) {
  currentLang = wordLink[0];
}





function renderWordLinkTitle(wordLink) {
  if (wordLink) {
    var word = wordLink[1];
    var lang = languages.canonicalLanguageName(wordLink[0]);

    return new Handlebars.SafeString(
      word + ' ('+lang+')'
    );
  }

}

function canonicalRoleName(roleName) {
  return analyzer.canonicalRoleName(roleName);
}



function wordLinkWord (wordLink) {
  return wordLink[1];
};
function wordLinkLang(wordLink) {
  return wordLink[0];
};
function wordLinkLangFull (wordLink) {
  var lang = wordLink[0];
  return languages.canonicalLanguageName(lang);
};
function wordLinkLangIconLabel (wordLink) {
  var lang = wordLink[0];
  var langLabel = lang;
  var regexPro = /(.*)-pro/;
  if (lang.match(regexPro)) {
    langLabel = "*"+lang.match(regexPro)[1];
  };
  return langLabel;
};
function ifWordLinkNotCurrentLang(wordLink, options) {
  var lang = wordLink[0];
  return !(currentLang&& lang==currentLang) ? options.fn(this) : options.inverse(this);
}


function ifCond(v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
}

function math(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
}


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
