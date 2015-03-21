jQuery.sap.require("sap.sousa.CriarProcesso.util.modeloProcesso");
jQuery.sap.require("sap.ui.core.IconPool");
jQuery.sap.require("sap.sousa.CriarProcesso.util.Controller");

sap.sousa.CriarProcesso.util.Controller.extend("sap.sousa.CriarProcesso.view.List", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf sap.sousa.CriarProcesso.List
     */
	onInit: function() {
        this._shopCartButton = this.getView().byId("btnAvancar");
	},

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
	onAfterRendering: function() {
        var model = this.getView().getModel();
        var pmodel = this.getView().getModel("Processo");
	},

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
            "Descritivo",
            sap.ui.model.FilterOperator.Contains, sValue
        );
        evt.getSource().getBinding("items").filter([oFilter]);
    },

    handleChange : function (oEvent) {
        if(oEvent.getParameter("newValue")){
            this._setFornecedorBinding(oEvent.getParameter("newValue"));
        }
    },

    _handleValueHelpClose : function (evt) {
        var oSelectedItem = evt.getParameter("selectedItem");
        if (oSelectedItem) {
            var fornecedorInput = this.getView().byId("inputFornecedor");
            fornecedorInput.setValue(oSelectedItem.getDescription());
        }
        evt.getSource().getBinding("items").filter([]);
        if(oSelectedItem && oSelectedItem.getDescription()){
            this._setFornecedorBinding(oSelectedItem.getDescription());
        }
    },

    _setFornecedorBinding : function (fornecedor) {
        var path = "/FornecedorSet('" + fornecedor + "')/Itens";

        var table = this.getView().byId("tabela");
        this._table = table;

        var button = new sap.m.Button({text : "", press : [this.handleAddItem, this],
                                        icon : "{icon}"});

        var oTemplate = new sap.m.ColumnListItem(
            {cells: [
                new sap.m.Text({text : "{Proforma}"}),
                new sap.m.Text({text : "{PedidoID}"}),
                new sap.m.Text({text : "{Descritivo}"}),
                new sap.m.ObjectNumber({
                    number: { path : "Quantidade", type: new sap.ui.model.type.Float({ maxFractionDigits : 2}) } ,
                    unit : "{Unidade}"
                }),
                new sap.m.ObjectNumber({
                    number: { path : "Valor", type: new sap.ui.model.type.Float({ maxFractionDigits : 2}) } ,
                    unit : "{Moeda}"
                }),
                new sap.m.Input({value : "{Factura}", editable : "{editavel}", change : function(oEvent){
                    var texto = oEvent.getParameter("newValue");
                    oEvent.getSource().getBindingContext().getObject().Factura = texto;
                }}),
                button
                 ]});
        table.bindItems(path, oTemplate);
    },

    handleAddItem : function(oEvent){
        var text = oEvent.getSource().getBindingContext().getObject().Descritivo;
        var oObject = oEvent.getSource().getBindingContext().getObject();
        if(!oObject.Factura){
            sap.m.MessageToast.show("Preencher número de factura");
        }
        else {
            var oModel = this.getView().getModel("Processo");
            if(!oObject.icon) {
                oModel.addItem(oObject, this);
                oObject.icon = "sap-icon://accept";
                oObject.editavel = false;
                sap.m.MessageToast.show("Item adicionado");
            }
            else{
                oModel.removeItem(oObject, this);
                oObject.icon = "";
                oObject.editavel = true;
                ;
                sap.m.MessageToast.show("Item Removido");
            }
            this.getView().getModel().updateBindings(true)
        }
    },

    onCartPressed : function(){
        this.getRouter().navTo("n2");
    }
});