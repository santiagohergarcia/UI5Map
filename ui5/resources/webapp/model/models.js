sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createMainModel: function () {
			return new sap.ui.model.odata.v2.ODataModel("/xsodata/Regions.xsodata", {
				defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
				defaultCountMode: "None"
			});
		},

		createViewModel: function () {
			return new JSONModel({
				fcl: {}, 
				world: {
					mode: "MAP",
					search: ""
				},
				country: {
					mode: "MAP",
					search: ""
				}
			});
		}

	};
});