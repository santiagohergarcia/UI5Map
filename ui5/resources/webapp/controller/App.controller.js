sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("ui5.ui5.controller.App", {

		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.attachRouteMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name"),
				oArguments = oEvent.getParameter("arguments"),
				oViewModel = this.getOwnerComponent().getModel("view"),
				sLayout = oArguments.layout || "OneColumn";

			// Update the layout of the FlexibleColumnLayout
			oViewModel.setProperty("/fcl/layout", sLayout);
			
			this._updateUIElements();

			// Save the current route name
			this.currentRouteName = sRouteName;
			this.currentCountryCode = oArguments.CountryCode;
		},

		onStateChanged: function (oEvent) {
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout");

			this._updateUIElements();

			// Replace the URL with the new layout if a navigation arrow was used
			if (bIsNavigationArrow) {
				this.oRouter.navTo(this.currentRouteName, {
					layout: sLayout,
					CountryCode: this.currentCountryCode
				}, true);
			}
		},

		// Update the close/fullscreen buttons visibility
		_updateUIElements: function () {
			var oModel = this.getOwnerComponent().getModel("view");
			var oUIState = this.getOwnerComponent().getHelper().getCurrentUIState();
			oModel.setProperty("/fcl", oUIState);
		},

		onExit: function () {
			this.oRouter.detachRouteMatched(this._onRouteMatched, this);
			this.oRouter.detachBeforeRouteMatched(this._onBeforeRouteMatched, this);
		}

	});
});