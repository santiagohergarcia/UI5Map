sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vbm/AnalyticMap",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, AnalyticMap, Fragment, Filter, FO) {
	"use strict";

	return Controller.extend("ui5.ui5.controller.Country.Country", {

		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("Country").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvt) {
			var sCountryCode = oEvt.getParameter("arguments").CountryCode;
			//Replate the map with the new Country 
			this._replaceCountryMap(sCountryCode).then(() => {
				//Bind view to current Country
				this.getView().bindElement({
					path: `/Countries('${sCountryCode}')`,
					parameters: {
						expand: "AdminDivisions"
					},
					events: {
						dataRequested: () => {
							this.getView().setBusy(true);
						},
						dataReceived: () => {
							this.getView().setBusy(false);
						}
					}
				});
			});

		},

		onModelCtxChange: function (oEvt) {
			var oCtx = oEvt.getSource().getBindingContext();
			if (oCtx) {
				this._setZoomToRegions();
			}
		},

		_setZoomToRegions: function () {
			var oMap = this.byId("countryMap"),
				aRegions = oMap.getRegions().map(r => r.getCode());
			oMap.setBusy(true);
			setTimeout(() => {
				oMap.zoomToRegions(aRegions);
				oMap.setBusy(false);
			}, 1000);
		},

		_replaceCountryMap: function (sCountryCode) {
			var oCountryMapCont = this.byId("countryMapCont");
			this.getView().setBusy(true);
			//Destroys the previous map, if existed
			oCountryMapCont.destroyContent();
			//Sets the new GeoJSON map URL
			AnalyticMap.GeoJSONURL = `/xsjs/AdmDivByCountryGeoJSONMap.xsjs?CountryCode=${sCountryCode}`;
			//Creates and sets the new map
			return Fragment.load({
				id: this.getView().getId(),
				name: "ui5.ui5.view.Country.CountryMap",
				controller: this
			}).then((oContainerContent) => {
				oCountryMapCont.addContent(oContainerContent);
				this.getView().setBusy(false);
			});
		},

		onFullScreen: function () {
			this.oRouter.navTo("Country", {
				layout: this.getView().getModel("view").getProperty("/fcl/actionButtonsInfo/midColumn/fullScreen"),
				CountryCode: this.getView().getBindingContext().getProperty("CountryCode")
			});
		},

		onExitFullScreen: function () {
			this.oRouter.navTo("Country", {
				layout: this.getView().getModel("view").getProperty("/fcl/actionButtonsInfo/midColumn/exitFullScreen"),
				CountryCode: this.getView().getBindingContext().getProperty("CountryCode")
			});
		},

		onClose: function () {
			this.oRouter.navTo("World", {
				layout: this.getView().getModel("view").getProperty("/fcl/actionButtonsInfo/midColumn/closeColumn")
			});
		},

		onSearchLiveChange: function (oEvt) {
			var sValue = oEvt.getParameter("newValue"),
				aFilters = this._getCountryFilter(sValue);
			this.byId("admDivList").getBinding("items").filter(aFilters);
		},

		_getCountryFilter: function (sValue) {
			var aFilters = [];
			if (sValue) {
				aFilters.push(new Filter({
					filters: [
						new Filter({
							path: "AdminDivCode",
							operator: FO.Contains,
							value1: sValue,
							caseSensitive: false
						}),
						new Filter({
							path: "AdminDivName",
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

		onModeSelChange: function () {
			this._setZoomToRegions();
		}

	});
});