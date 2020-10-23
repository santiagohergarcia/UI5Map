var oConn = $.hdb.getConnection();

var sCountryCode = $.request.parameters.get("CountryCode");

var sQuery = `SELECT 
		"AdminDivCode",
		"AdminDivName",
		"Shape".ST_AsGeoJson() as "Shape_GeoJSON"
	FROM "UI5MAP_HDI_DB_1"."UI5Map.db.views::AdminDivisions"
	WHERE "CountryCode" = '${sCountryCode}';`;

var aShapes = oConn.executeQuery(sQuery).map((oAdmDiv) => {
	return { 
		geometry: JSON.parse(oAdmDiv.Shape_GeoJSON),
		id: oAdmDiv.AdminDivCode,
		id2: oAdmDiv.AdminDivCode,
		properties: {
			name: oAdmDiv.AdminDivName
		},
		type: "Feature"
	};
}, []);

$.response.contentType = "text/json";
$.response.setBody(JSON.stringify({
	features: aShapes,
	type: "FeatureCollection"
}));