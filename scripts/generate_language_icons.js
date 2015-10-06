#!/usr/bin/env node

var jsdom = require('jsdom');
var analyzer = require('enwiktionary-analyzer').analyzer;
var fs = require('fs');
var path = require('path');
var async = require('async');
var WIDTH = 30;
var HEIGHT = 20;
window = {};
document = {};

var languages = analyzer.languagesList();



function generateIcon(lang) {
	

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
        var text = paper.text("50%", "69%", "{{lang}}").attr({ 
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

        fs.writeFileSync(path.join(__dirname, '..', 'views', 'partials', 'languageIcon.svg.handlebars'), svg, 'utf8');


      }
    }
  );
}

generateIcon()
