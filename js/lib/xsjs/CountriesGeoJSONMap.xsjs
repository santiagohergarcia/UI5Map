var conn = $.hdb.getConnection();

var stRevenueBy = `SELECT 
			"CountryCode",
			"CountryName",
			"Shape".ST_AsGeoJson() as "Shape_GeoJSON"
		FROM "UI5MAP_HDI_DB_1"."UI5Map.db.views::Countries";`;

var shapesArray = conn.executeQuery(stRevenueBy).map((country) => {
	return { 
		geometry: JSON.parse(country.Shape_GeoJSON),
		id: country.CountryCode,
		id2: country.CountryCode,
		properties: {
			name: country.CountryName
		},
		type: "Feature"
	};
}, []);

$.response.contentType = "text/json";
$.response.setBody(JSON.stringify({
	features: shapesArray,
	type: "FeatureCollection"
}));