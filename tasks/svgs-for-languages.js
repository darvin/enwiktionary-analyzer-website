#!/usr/bin/env node

var jsdom = require('jsdom');
var analyzer = require('enwiktionary-analyzer').analyzer;
var fs = require('fs');
var path = require('path');
var async = require('async');
var HEIGHT = 20;
var WIDTH = HEIGHT*2;
var WIDTH_LONG = HEIGHT*4;

var helpers = require('../lib/helpers');

var languages = analyzer.languagesList();
var imagesDir = path.join(__dirname, '..', 'build', 'images');



var generateIcon = function(){
  var raphael = null;
  var win = null;
  jsdom.env(
    "<html></html>",
    [],
    function (errors, theWin) {
      if (errors) {
        throw errors;
      } else {
        win = theWin;
        global.window = win
        global.document = win.document
        global.navigator = win.navigator

        raphael = require('raphael')
        raphael.setWindow(win)




      }
    }
  );
  function clearPaper(paper){
    var paperDom = paper.canvas;
    paperDom.parentNode.removeChild(paperDom);
  }

  function widthForLabel(label) {
    if (label.length<=4) {
      return WIDTH;
    } else {
      return WIDTH_LONG;
    }
  }

  return function(lang, callback) {
    var langLabel = helpers.wordLinkLangIconLabel([lang, null]);

    var width = widthForLabel(langLabel);
    var paper = raphael(0, 0, width, HEIGHT);
    
    var rect = paper.rect(0, 0, width, HEIGHT).attr("fill", "#444");
    var text = paper.text("50%", "69%", langLabel).attr({ 
      "font-size": HEIGHT*0.75, 
      "font-family": "Verdana, Geneva, sans-serif", 
      "font-weight": "bold",
      "letter-spacing":"-1px",
      "fill":"#fff"
    });

    svg = win.document.documentElement.innerHTML
    clearPaper(paper);
    svg = svg.replace('<head></head><body>', '')
    svg = svg.replace('<head></head><body style="">', '')
    svg = svg.replace('</body>', '')

    fs.writeFile(path.join(imagesDir, lang+'.svg'), svg, 'utf8', function(err, result) {
      if (err) {
        console.log("Error writing: ", err);
        throw err;
      }
      // console.log("- generated: "+lang+'.svg  ');
      if (langLabel.length>3) {
        console.log("Lang: ", lang, " Lang Label: ",langLabel, " Name: ", helpers.wordLinkLangFull([lang, null]));
      }
      callback(null);
    });
  }
}();


var mkdirp = require('mkdirp');

module.exports = function(grunt) {
  grunt.registerTask('svgs-for-languages', 'Creates SVGs icons for languages', function() {

    if (fs.existsSync(imagesDir) && grunt.option('force') !== true) {
        grunt.log.warn(imagesDir + " already exists! quitting...");
        return;
    }
    var done = this.async();

    mkdirp(imagesDir, function(err) { 
      var allLangs = analyzer.languagesList();
      var indexHTML = "<html><body>"+allLangs.splice(0,2000).map(function(lang){
        return '   <img src="'+lang+'.svg" alt="'+lang+'"/>'
      }).join("\n")+"</body></html>"
      fs.writeFileSync(path.join(imagesDir, "index.html"), indexHTML, "utf8");
      async.eachSeries(allLangs, generateIcon, done);
    });
  });

  
}



