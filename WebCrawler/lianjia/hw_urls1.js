/**
* 将filter-options过滤得到各区的url，进一步请求各区链接，抓取第一页至最后页的小区信息
*output: 'http://sh.lianjia.com/xiaoqu/distric/d[num]'
*/

var request = require('request');
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

var urlBase = 'http://sh.lianjia.com';
var urlXiaoqu = urlBase + '/xiaoqu';

var newArr = [];
var newUrl;
var page_num;

function findALLURL($) {
  var hrefs = [];
  var url, urlFull;
  $('#filter-options').find('a').each(function(i, node) {
    url = $(node).attr('href');
    urlFull = urlBase +  url;
    hrefs.push(urlFull);
  });
  hrefs = filterUrl(hrefs);
  return hrefs;
}


function filterUrl(arr) {
  var newArr = [];
  for (var i = 1; i < arr.length - 8; i++) {
    var url = arr[i];
    if (!url || url.indexOf('xiaoqu') === -1) continue;
    newArr.push(url);
  }
  return newArr;
}

module.exports = function(cb) {
	request.get(urlXiaoqu, function(e, res, body) {
		if (!e && res.statusCode == 200) {
		  var $ = cheerio.load(body);
		  var urls = findALLURL($);
		  
	urls.forEach(function(url,i){
		/*request url of each district, get page num*/
		request.get(url, function(e, res, body) {
			if (!e && res.statusCode == 200) {
				var $ = cheerio.load(body);
				var page_num = $('.page-box').find('a:nth-last-child(2)').text();
				page_num = parseInt(page_num);
			
				for (var j = 1; j <= page_num; j++) {
					newUrl = url + 'd' + j;
					newArr.push(newUrl);
				}
			urls = newArr;//在异步编程中，需要把依赖于异步函数（需要其执行结果或者达到某种状态）的代码放在对应的回调函数中
			cb(urls);
			}
		})
	})
		}
	});
}
  
