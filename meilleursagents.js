var request = require('request'),
cheerio = require('cheerio');
fs = require('fs');
json = require('./meilleursagents.json'),
boncoinPrice = 0;
m2price = 0;
type = "";
city = "";
postalCode = 0;
surface = 0;
url = "https://www.meilleursagents.com/prix-immobilier/#estimates";

String.prototype.cleanup = function() {
	return this.toLowerCase().replace(/[^a-zA-Z0-9€]+/g, "");
}

String.prototype.keepdigits = function() {
	return this.toLowerCase().replace(/[^0-9]+/g, "");
}

String.prototype.keepletters = function() {
	return this.toLowerCase().replace(/[^a-zA-Z]+/g, "");
}


var dealtest = function meilleursagents(leboncoinData, callback){ 

//console.log(leboncoinData);

//needed data to determine the deal
postalCode = leboncoinData.properties.postalCode.substring(0,2);
surface = leboncoinData.properties.surface;
boncoinPrice = leboncoinData.properties.price;
type = leboncoinData.properties.type;
city = leboncoinData.properties.city;

request(url, function(err, resp, body){

	var deal = "TBD";

	if(!err && resp.statusCode == 200){
		
		var $ = cheerio.load(body);

		// we search the m2price for the corresponding postalCode or city
		$('.indicator').each(function(){ 
			var data = $(this).children().first().children().first();
			var info = data.text().cleanup();

			tmpM2price = $(this).find('td.t-right').text().cleanup();
			priceArray = tmpM2price.split("€");
			var m2priceHouse = priceArray[1];
			var m2priceApart = priceArray[0];

			if (info.match(/\d+/g) != null) {
				if(info.includes("2acorse")){
					info = "2a";
				}
				else if(info.includes("2bhaute")){
					info = "2b";
				}
				else{
    				info = info.keepdigits();
				}
			}
			else{
				info = info.keepletters();
			}

			if(info===postalCode || info===city){
				//console.log("m2price detected");
				//must find corresponding price
				var typeUpper = type.toUpperCase()
				if(typeUpper.includes("HOUSE") || typeUpper.includes("MAISON")){
					m2price = m2priceHouse;
				}
				else if(typeUpper.includes("APART") || typeUpper.includes("APPART")){
					m2price = m2priceApart;
				}
				else{
					console.log("type not ok");
				}
			}
		
		});

		console.log(m2price+"€/m²");

		json.properties.postalCode = postalCode;
		json.properties.type = type;
		json.properties.city = city;
		json.properties.m2price = m2price;

		var priceAverage = surface*m2price;
		if(boncoinPrice < priceAverage)
			deal = "Good deal !";
		else
			deal = "Bad deal !";

		json.properties.deal = deal;

		console.log(deal);

		callback && callback(deal);
	}
});
}

module.exports = dealtest;
