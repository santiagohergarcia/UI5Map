sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vbm/AnalyticMap",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, AnalyticMap, Filter, FO) {
	"use strict";

	AnalyticMap.GeoJSONURL = "/xsjs/CountriesGeoJSONMap.xsjs";

	return Controller.extend("ui5.ui5.controller.World.World", {

		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("World").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function () {
			//this.byId("worldMap").zoomToRegions([]);
		},

		onCountrySelect: function (oEvt) {
			var oSelectedRegion = oEvt.getParameter("selected")[0],
				oCountry = oSelectedRegion.getBindingContext().getObject(),
				oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);

			//this.byId("worldMap").zoomToRegions([oCountry.CountryCode]);

			this.getOwnerComponent().getRouter().navTo("Country", {
				CountryCode: oCountry.CountryCode,
				layout: oNextUIState.layout
			});
		},

		onSearchLiveChange: function (oEvt) {
			var sValue = oEvt.getParameter("newValue"),
				aFilters = this._getCountryFilter(sValue);
			this.byId("countriesList").getBinding("items").filter(aFilters);
		},

		_getCountryFilter: function (sValue) {
			var aFilters = [];
			if (sValue) {
				aFilters.push(new Filter({
					filters: [
						new Filter({
							path: "CountryCode",
							operator: FO.Contains,
							value1: sValue,
							caseSensitive: false
						}),
						new Filter({
							path: "CountryName",
							operator: FO.Contains,
							value1: sValue,
							caseSensitive: false
						})
					],
					and: false
				}));
			}
			return aFilters;
		},

		onPressCountry: function (oEvt) {
			var oSelectedItem = oEvt.getSource(),
				oCountry = oSelectedItem.getBindingContext().getObject(),
				oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);

			this.getOwnerComponent().getRouter().navTo("Country", {
				CountryCode: oCountry.CountryCode,
				layout: oNextUIState.layout
			});
		},

		onMapRegionsDataRequested: function () {
			this.byId("worldMapCont").setBusy(true);
		},

		onMapRegionsDataReceived: function () {
			this.byId("worldMapCont").setBusy(false);
		},

		onPress: function () {
			AnalyticMap.GeoJSONURL = `/xsjs/AdmDivByCountryGeoJSONMap.xsjs?CountryCode=ARG`;
			var oMap = this.byId("worldMapCont").getItems()[0];
			var oNewMap = oMap.clone();
			this.byId("worldMapCont").destroyItems();
			this.byId("worldMapCont").addItem(oNewMap);
		}

	});
});