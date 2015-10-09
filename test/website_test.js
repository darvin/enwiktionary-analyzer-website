var request = require('supertest');
var chai = require('chai');
chai.should();
var expect = chai.expect;
var app = require('../server')();
describe('Website showing "test" in English', function(){
	this.timeout(6000);
	var word="test";
	var lang="en";
	it('should be fine at GET /?word=:word&lang=:lang', function(done) {
	  request(app)
		  .get('/')
		  .query({
		  	word:word,
		  	lang:lang
		  })
		  .expect(200, /multiple\-choice test/, function(err, res){
		  	expect(err).to.not.be.ok;
		    done(err);
		  });
	})

	it('should be fine at GET /:word', function(done) {
	  request(app)
		  .get('/'+word)
		  .expect(200, /multiple\-choice test/, function(err, res){
		  	expect(err).to.not.be.ok;
		    done(err);
		  });
	})

	it('should be fine at GET /:word/:lang', function(done) {
	  request(app)
		  .get('/'+word+'/'+lang)
		  .expect(200, /multiple\-choice test/, function(err, res){
		  	expect(err).to.not.be.ok;
		    done(err);
		  });
	})
	
})
