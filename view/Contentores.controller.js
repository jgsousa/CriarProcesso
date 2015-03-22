jQuery.sap.require("sap.sousa.CriarProcesso.util.Controller");
jQuery.sap.require("sap.sousa.CriarProcesso.util.modeloContentores");

sap.sousa.CriarProcesso.util.Controller.extend("sap.sousa.CriarProcesso.view.Contentores", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf sap.sousa.CriarProcesso.Contentores
     */
	onInit: function() {
        this.getRouter().attachRoutePatternMatched(function(){
            var model = this.getView().getModel("Processo");
            if(model.getData().items.length == 0){
                model.initMockData();
            }
        }, this);
        var model = this._iniciarModelo();
        var table = this.getView().byId("Destino");
        var oContext = model.getContextForMatricula("TESTE1");
        if(oContext) {
            table.setBindingContext(oContext, "Contentores");
        }
        this.contentor = "TESTE1";
    },

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf sap.sousa.CriarProcesso.Contentores
     */
//	onBeforeRendering: function() {
//
//	},

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf sap.sousa.CriarProcesso.Contentores
     */
//	onAfterRendering: function() {
//
//	},

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf sap.sousa.CriarProcesso.Contentores
     */
//	onExit: function() {
//
//	}
    _iniciarModelo : function(){
        var cModel = new sap.sousa.CriarProcesso.util.modeloContentores();
        cModel.initModelo();
        this.getView().setModel(cModel,"Contentores");
        this.cModel = cModel;
        var criarModelo = new sap.ui.model.json.JSONModel({ matricula:"", tipo:"" });
        this.getView().setModel(criarModelo,"Criar");
        var tipoModelo = new sap.ui.model.json.JSONModel({ tipos : [
            { key:"SC20", text:"SC20" } ,{ key:"SC40", text:"SC40" },{ key:"RF20", text:"RF20" },{ key:"RF40", text:"RF40" }
        ]});
        this.getView().setModel(tipoModelo, "Tipos");
        return cModel;
    },

    onAddContentor : function(oEvent){
        if (!this._addDialog) {
            this._addDialog = sap.ui.xmlfragment(
                "sap.sousa.CriarProcesso.view.Criar",
                this
            );
            this.getView().addDependent(this._addDialog);
        }

        // open value help dialog
        this._addDialog.open();
    },

    onDialogOkButton: function (oEvent) {
        var model = this.getView().getModel("Criar");
        model.refresh();
        var data = this.getView().getModel("Criar").getData();
        this._addDialog.close();
        if(data.matricula && data.tipo){
            sap.m.MessageToast.show(data.matricula + data.tipo);
        }
    },

    onDialogCloseButton: function (oEvent) {
        this._addDialog.close();
    },

    onCriarLive : function(oEvent){
        var data = this.getView().getModel("Criar").getData();
        data.matricula = oEvent.getParameter("value");
    },

    onAddItem : function(oEvent){
        var obj = oEvent.getSource().getBindingContext("Processo").getObject();
        if(obj.Transf == ""){
            sap.m.MessageToast.show("Introduzir quantidade");
        }
        else{
            if(!this.contentor){
                sap.m.MessageToast.show("Selecionar contentor");
            }
            else{
                this.cModel.addItem(this.contentor,obj);
                this.getView().getModel("Processo").updateBindings();
                var context = this.cModel.getContextForMatricula(this.contentor);
                var table = this.getView().byId("Destino");
                table.setBindingContext(context, "Contentores");
                this.cModel.updateBindings();
            }
        }
    },

    onRemoveItem : function(oEvent){
        var obj = oEvent.getSource().getBindingContext("Contentores").getObject();
        var processo = this.getView().getModel("Processo");
        processo.recuperaItem(obj);
        this.cModel.removeItem(this.contentor,obj);
        this.cModel.updateBindings();
        processo.updateBindings();
    },

    onCriarSelected : function(oEvent){
        var tipo = oEvent.getParameter("selectedItem");
        sap.m.MessageToast.show(tipo.getProperty("key"));
    },

    onContentorSelect : function(oEvent){
        var matricula = oEvent.getParameter("selectedItem").getProperty("key");
        var context = this.getView().getModel("Contentores").getContextForMatricula(matricula);
        if(context){
            var table = this.getView().byId("Destino");
            table.setBindingContext(context, "Contentores");
        }
    },

    onTransferirDestino : function(oEvent){
        var oObject = oEvent.getSource().getBindingContext().getObject();

    }

});