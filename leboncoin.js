	var request = require('request'),
	cheerio = require('cheerio');
	fs = require('fs');
	json = require('./leboncoin.json'),
	price = 0;
	city = "";
	postalCode = 0;
	type = "";
	rooms = 0;
	surface = 0;
	ges = "";
	energy = "";
	description = "";

	String.prototype.cleanup = function() {
		return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
	}

	String.prototype.keepdigits = function() {
		return this.toLowerCase().replace(/[^0-9]+/g, "");
	}

	String.prototype.keepletters = function() {
		return this.toLowerCase().replace(/[^a-zA-Z]+/g, "");
	}

	module.exports = function leboncoin(url, callback){ 

		json = require('./leboncoin.json') 

		request(url, function(err, resp, body){
			if(!err && resp.statusCode == 200){
				var $ = cheerio.load(body);
				$('.line').each(function(){ 
					var data = $(this).find('.value').text();
					var info = $(this).find('.property').text();
					info = info.cleanup();
					if(data.length > 0){
						switch(info){
							case "prix":
							price = data.keepdigits();
							break;
							case "typedebien":
							type = data;
							break;
							case "ville":
							var tmp = data.cleanup();
							city = tmp.keepletters();
							postalCode = tmp.keepdigits();
							break;
							case "pices":
							rooms = data;
							break;
							case "surface":
							surface = data.replace("m2", "");
							break;
							case "ges":
							ges = data.cleanup().substring(0, 1);
							break;
							case "classenergie":
							energy = data.cleanup().substring(0, 1);
							break;
							case "description":
							description = data;
							break;
						}
				}
			});

		json.properties.price = price;
		json.properties.type = type;
		json.properties.city = city;
		json.properties.postalCode = postalCode;	
		json.properties.surface = surface;
		json.properties.rooms = rooms;
		json.properties.GES = ges;
		json.properties.energyClass = energy;
		json.properties.description = description;

		callback && callback(json);
	}
});

} 
