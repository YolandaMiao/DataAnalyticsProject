# **Web Crawler** #

1. 用nodeJS爬虫爬取列表页
	- 在主入口`hw_exe_v1`中调用url模块`hw_urls1`、请求池模块`hw_pool`、mongoDB交互模块`mongo`
	
	- url模块用来获取每个区的所有小区列表页，用`$('#filter-options').find('a').attr('href')`得到各区的url,进一步请求各区链接，抓取每个区第一页至最后页的小区列表信息，但每个区的总列表页数不同，所以可以在获取每个区的小区列表首页时解析总页数: `var page_num = $('.page-box').find('a:nth-last-child(2)').text();` 

	![](http://192.168.1.164:8000/WebCrawler/lianjia/list.JPG)

	- 请求池中调用解析模块`hw_parser`解析url。xiaoqu:`$('.list-wrap').find('li').find('.actshowMap_list').attr('xiaoqu').replace(/\'/g, '"')`; lat:`JSON.parse(xiaoqu)[1]`; lng: `JSON.parse(xiaoqu)[0]`; communityName: `JSON.parse(xiaoqu)[2]`; districtName: `$('.list-wrap').find('li').find('.actshowMap_list').attr('districtname')`; plateName:`$('.list-wrap').find('li').find('.actshowMap_list').attr('platename')`; communityId:`$('.list-wrap').find('li').find('.pic-panel').find('a').attr('key')`; price: `$('.list-wrap').find('li').find('.price').find('.num').text()`; age: `2016 - $('.list-wrap').find('li').find('.con').text().match(/\d\d\d\d/g)`; 最后需要使解析后数据类型与自定义的schema保持一致。
	

2. 用nodeJS爬虫爬取详情页
	- 在主入口`hw_exe_v2`中调用url模块`hw_urls3`、请求池模块`hw_pool2`、mongoDB交互模块`mongo2`
	
	- url模块用来获取每个区的所有小区详情页，用`$('#filter-options').find('a').attr('href')`得到各区的url,进一步请求各区链接，抓取每个区第一页至最后页的小区列表信息，并在获取每个区的小区列表首页时解析总页数: `var page_num = $('.page-box').find('a:nth-last-child(2)').text();` 再基于这些列表页url用`$('.info-panel').find('h2').find('a').attr('href')` 获取每个小区的url。
	
	![](http://192.168.1.164:8000/WebCrawler/lianjia/xiaoqu.JPG)
	
	- 请求池中调用解析模块`hw_parser2`解析url。info:`$('.wrapper').find('.detail-block').find('.actshowMap').attr('xiaoqu').replace(/\'/g, '"')`; lat:`JSON.parse(info)[1]`; lng: `JSON.parse(info)[0]`; communityName: `JSON.parse(info)[2]`; list_price: `$('.wrapper').find('.detail-block').find('.priceInfo').find('div:first-child').find('p').text().replace(/\W/g,"")`; avg_price:`$('.wrapper').find('.detail-block').find('.priceInfo').find('div:nth-child(3)').find('p').text().replace(/\W/g,"")`; building_count:`$('.wrapper').find('.detail-block').find('.res-info').find('li:nth-child(6)').find('.other').text().replace("栋","")`; house_count: `$('.wrapper').find('.detail-block').find('.res-info').find('li:nth-child(7)').find('.other').text().replace("户","")`; selling_count: `$('.wrapper').find('.detail-block').find('.js_outLink').text().replace(/\W/g, "")`; communityId: `$('.wrapper').find('.detail-block').find('#notice_focus').attr('propertyno')`; plate: `$('.wrapper').find('.detail-block').find('.res-top').find('span:nth-child(2)').text().replace("(",'').replace(")",'')` ; 最后需要使解析后数据类型与自定义的schema保持一致。


3. 数据导出工具：mongoexport
![](http://192.168.1.164:8000/WebCrawler/lianjia/csvexport.png)
	
	-列表页导出的部分结果为communities.csv
	-详情页导出的部分结果为xiaoqu.csv

----------

# **Data Analysis** #

Data Set: xiaoqu.csv

1. K-means地理聚类：
	 
	- 小区的经纬度作为地理聚类的feature
	`m=as.matrix(cbind(df$lat,df$lng),ncol=2)`

	- 已知该数据集中的小区在五个不同区，所以可以直接用K-Means Clustering求解
	`cl=(kmeans(m,5))`
	
		结果如下：
![](http://192.168.1.164:8000/DataAnalysis/cl.JPG)
	
	- 用ggplot2绘图
![](http://192.168.1.164:8000/DataAnalysis/Rplot.jpeg)	

2. 对如下小区预测均价：
![](http://192.168.1.164:8000/DataAnalysis/price_predict.JPG)

	- 首先， 由于数据包含多个feature，所以我们可以利用多元线性回归模型确定每个feature对于均价的相关性。绘制所有关系的散点图：
	![](http://192.168.1.164:8000/DataAnalysis/Rplot_price_prediction.jpeg)
	
	- 查看相关矩阵，做相关分析，研究`lat`、`lng`、`house_count`、`selling_count`、`community_age`与`avg_price`的相关性。
![](http://192.168.1.164:8000/DataAnalysis/cor1.JPG)
![](http://192.168.1.164:8000/DataAnalysis/cor2.JPG)
![](http://192.168.1.164:8000/DataAnalysis/cor3.JPG)
![](http://192.168.1.164:8000/DataAnalysis/cor4.JPG)
![](http://192.168.1.164:8000/DataAnalysis/cor5.JPG)
![](http://192.168.1.164:8000/DataAnalysis/cor6.JPG)

	- 对五个变量建立多元线性回归方程
![](http://192.168.1.164:8000/DataAnalysis/cor7.JPG)

	- 去掉一个Pr远超0.05的变量，优化p-value
![](http://192.168.1.164:8000/DataAnalysis/cor8.JPG)

	- 再去掉一个Pr远超0.05的变量，优化p-value
![](http://192.168.1.164:8000/DataAnalysis/cor9.JPG)

	- 模型结果：
    `y2_rs=a0+a1*lat+a2*lng+a4*selling_count` where 
![](http://192.168.1.164:8000/DataAnalysis/aa.JPG)
 
		error:0.175894

	- 预测结果：
   
	<code># community A:58552.91
    
	y2_A = a0+a1*31.2+a2*121.4+a4*10</code>
	
	<code># community B: 65359.83
    
	y2_B = a0+a1*31.25+a2*121.5+a4*10</code>

----------

# **Data Visualization** #
Data Set: house_lianjia.json

- 数据预处理：用postgreSQL清理数据，获取经纬度，均价，户数，小区名。运行如下sql语句：

        copy
		(SELECT array_to_json(array_agg(row_to_json(t))) FROM 
		(select lat,lng,avr_price, house_count, community_name from lianjia_data limit 10000) t)
		TO 'D:/house_lianjia1.json'; 

- 返回结果如下：
	
		[{"lat":"31.1418","lng":"121.58","avr_price":"47186","house_count":"670","community_name":"中邦大都会"},	
		{"lat":"30.8945","lng":"121.02","avr_price":"8910","house_count":"535","community_name":"中冶枫郡苑"},
		{"lat":"31.2301","lng":"121.337","avr_price":"31732","house_count":"1268","community_name":"虹桥1号"},...]	

- 运行`leaflet_dot_color_control_communities.html`，得到如图可视化效果。
![](http://192.168.1.164:8000/viz.JPG)