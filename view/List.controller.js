sap.ui.controller("sap.sousa.CriarProcesso.view.List", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf sap.sousa.CriarProcesso.List
     */
//	onInit: function() {
//
//	},

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf sap.sousa.CriarProcesso.List
     */
//	onBeforeRendering: function() {
//
//	},

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf sap.sousa.CriarProcesso.List
     */
//	onAfterRendering: function() {
//
//	},

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf sap.sousa.CriarProcesso.List
     */
//	onExit: function() {
//
//	}

    handleValueHelp : function (oController) {
        this.inputId = oController.oSource.sId;
        // create value help dialog
        if (!this._valueHelpDialog) {
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.sousa.CriarProcesso.view.Dialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);
        }

        // open value help dialog
        this._valueHelpDialog.open();
    },

    _handleValueHelpSearch : function (evt) {
        var sValue = evt.getParameter("value");
        var oFilter = new sap.ui.model.Filter(
            "nome",
            sap.ui.model.FilterOperator.Contains, sValue
        );
        evt.getSource().getBinding("items").filter([oFilter]);
    },

    _handleValueHelpClose : function (evt) {
        var oSelectedItem = evt.getParameter("selectedItem");
        if (oSelectedItem) {
            var productInput = this.getView().byId("inputFornecedor");
            productInput.setValue(oSelectedItem.getDescription());
        }
        evt.getSource().getBinding("items").filter([]);
    }
});