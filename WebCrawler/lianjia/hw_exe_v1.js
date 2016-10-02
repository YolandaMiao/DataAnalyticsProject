/*
  直接爬取并出现错误
*/
//
//

var request = require('request');
var fs = require('fs');
var getURLs = require('./hw_urls1');
var Pool = require('./hw_pool');
var Mongo = require('./mongo');


getURLs(function(urls){
  new Pool(urls).query(function(){
  console.log('大功告成..');
  process.exit();
  })
});