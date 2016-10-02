var request = require('request');
var fs = require('fs');
var getURLs = require('./hw_urls3');
var Pool = require('./hw_pool2');
var Mongo = require('./mongo2');


getURLs(function(urls){
  new Pool(urls).query(function(){
  console.log('大功告成..');
  process.exit();
  })
});