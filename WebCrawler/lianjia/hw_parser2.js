var Mongo = require('./mongo2');
var cheerio = require('cheerio');
var index = 0;

function update(obj) {
  Mongo.community.findOneAndUpdate({
    community_id: obj.community_id
  }, obj, {
    upsert: true
  }, function(e, d) {
    console.log('更新成功...');
  });
}

function parser(e, res, body){
	
  var $ = cheerio.load(body);
  var listNode = $('.wrapper').find('.detail-block');
	var info = listNode.find('.actshowMap').attr('xiaoqu').replace(/\'/g, '"');
	//console.log(typeof(info));
    info = JSON.parse(info);
    var lat = info[1], lng = info[0], communityName = info[2];
	//console.log(lat + " " + lng);
	var list_price = listNode.find('.priceInfo').find('div:first-child').find('p').text().replace(/\W/g,"");
	//console.log(list_price);
	var avg_price = listNode.find('.priceInfo').find('div:nth-child(3)').find('p').text().replace(/\W/g,"");
	//console.log(avg_price);
	var age = 2016 - listNode.find('.res-info').find('li:nth-child(2)').find('.other').text().match(/\d\d\d\d/g);
	//console.log(age);
	var building_count = listNode.find('.res-info').find('li:nth-child(6)').find('.other').text().replace("栋","");
	//console.log(building_count);
	var house_count = listNode.find('.res-info').find('li:nth-child(7)').find('.other').text().replace("户","");
	//console.log(house_count);
	var selling_count = listNode.find('.js_outLink').text().replace(/\W/g, "");
	//console.log(selling_count);
	var communityId = listNode.find('#notice_focus').attr('propertyno');
	console.log(communityId);
	var plate = listNode.find('.res-top').find('span:nth-child(2)').text().replace("(",'').replace(")",'');
    index ++;
	console.log(index);
	
	var result = {
      community_id: communityId,
      lat: lat,
      lng: lng,
      community_id: communityId, 	
      community_name: communityName,
	  plate_name:plate,
	  community_age:age,
	  list_price:list_price,
	  building_count:building_count,
	  house_count:house_count,
	  selling_count:selling_count,
	  avg_price:avg_price
	  
    };
    update(result);
}

module.exports = parser;