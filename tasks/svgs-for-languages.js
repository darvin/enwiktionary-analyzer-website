#!/usr/bin/env node

var jsdom = require('jsdom');
var analyzer = require('enwiktionary-analyzer').analyzer;
var fs = require('fs');
var path = require('path');
var async = require('async');
var WIDTH = 30;
var HEIGHT = 20;
var helpers = require('../lib/helpers');

var languages = analyzer.languagesList();
var imagesDir = path.join(__dirname, '..', 'build', 'images');


function generateIcon(lang, callback) {

  var langLabel = helpers.wordLinkLangIconLabel(lang);
  jsdom.env(
    "<html></html>",
    [],
    function (errors, win) {
      if (errors) {
        throw errors;
      } else {
        global.window = win
        global.document = win.document
        global.navigator = win.navigator

        var raphael = require('raphael')
        raphael.setWindow(win)



        var paper = raphael(0, 0, WIDTH, HEIGHT);
        
        var rect = paper.rect(0, 0, WIDTH, HEIGHT).attr("fill", "#444");
        var text = paper.text("50%", "69%", langLabel).attr({ 
          "font-size": HEIGHT/1.25, 
          "font-family": "Verdana, Geneva, sans-serif", 
          "font-weight": "bold",
          "letter-spacing":"-1px",
          "fill":"#fff"
        });

        svg = win.document.documentElement.innerHTML
        svg = svg.replace('<head></head><body>', '')
        svg = svg.replace('<head></head><body style="">', '')
        svg = svg.replace('</body>', '')

        fs.writeFile(path.join(imagesDir, lang+'.svg'), svg, 'utf8', function(err, result) {
          if (err) {
            console.log("Error writing: ", err);
            throw err;
          }
          console.log("- generated: "+lang+'.svg');
          callback(null);
        });
      }
    }
  );
}
var mkdirp = require('mkdirp');

module.exports = function(grunt) {
  grunt.registerTask('svgs-for-languages', 'Creates SVGs icons for languages', function() {

    if (fs.existsSync(imagesDir) && grunt.option('force') !== true) {
        grunt.log.warn(imagesDir + " already exists! quitting...");
        return;
    }
    var done = this.async();

    mkdirp(imagesDir, function(err) { 

      async.eachSeries(analyzer.languagesList(), generateIcon, done);
    });
  });

  
}



