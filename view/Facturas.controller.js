jQuery.sap.require("sap.sousa.CriarProcesso.util.Controller");
jQuery.sap.require("sap.sousa.CriarProcesso.util.modeloFacturas");
jQuery.sap.require("sap.sousa.CriarProcesso.util.modeloProcesso");

sap.sousa.CriarProcesso.util.Controller.extend("sap.sousa.CriarProcesso.view.Facturas", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf sap.sousa.CriarProcesso.Facturas
     */
	onInit: function() {
        this.getRouter().attachRoutePatternMatched(function(){
           var model = this.getView().getModel("Processo");
            if(model.getData().items.length == 0){
                this.getRouter().navTo("main");
            }
            else{
                var fModel = new sap.sousa.CriarProcesso.util.modeloFacturas();
                fModel.initFromProcesso(model.getData());
                this.getView().setModel(fModel, "Facturas");
                this._setTable();
            }
        }, this);
	},

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf sap.sousa.CriarProcesso.Facturas
     */
//	onBeforeRendering: function() {
//
//	},

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf sap.sousa.CriarProcesso.Facturas
     */
//	onAfterRendering: function() {
//
//	},

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf sap.sousa.CriarProcesso.Facturas
     */
//	onExit: function() {
//
//	}

    onNavBack : function(){
        window.history.go(-1);
    },

    _setTable : function(){
        var oModel = this.getView().getModel("Facturas");
        var path = "Facturas>/items";
        var table = this.getView().byId("tabela");

        var oTemplate = new sap.m.ColumnListItem(
            {cells: [
                new sap.m.Text({text : "{Facturas>FacturaId}"}),
                new sap.m.ObjectNumber({
                    number: { path : "Facturas>FOB", type: new sap.ui.model.type.Float({ maxFractionDigits : 2}) } ,
                    unit : "EUR"
                }),
                new sap.m.Input({value : "{Facturas>Frete}", type:"Number"}),
                new sap.m.Input({value : "{Facturas>Seguro}", type:"Number"}),
                new sap.m.Input({value : "{Facturas>CNCA}", type:"Number"}),
                new sap.m.ObjectNumber({
                    number: { path : "Facturas>CIF", type: new sap.ui.model.type.Float({ maxFractionDigits : 2})},
                    unit : "EUR"
                })
            ]}
        );
        table.bindItems(path, oTemplate);
    },

    onLiveProcesso : function(oEvent){
        var data = this.getView().getModel("Facturas").getData();
        data.processo = oEvent.getParameter("value");
    },

    onLiveEmpresa : function(oEvent){
        var data = this.getView().getModel("Facturas").getData();
        data.empresa = oEvent.getParameter("value");
    },

    onPressAvancar : function () {
        var model = this.getView().getModel("Facturas");
        var object = model.getODataObject();
        var oModel = this.getView().getModel();
        var batch = [];
        oModel.create('/ProcessoSet', object, null, function(){
                sap.m.MessageToast.show("Criado com sucesso");
        	},function(oError){
                var model = new sap.ui.model.json.JSONModel();
                model.setJSON(oError.response.body);
                sap.m.MessageToast.show(model.getData().error.message.value);
        });
    }
});