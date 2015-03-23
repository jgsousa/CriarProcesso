jQuery.sap.require("sap.sousa.CriarProcesso.util.Controller");
jQuery.sap.require("sap.sousa.CriarProcesso.util.modeloContentores");
jQuery.sap.require("sap.sousa.CriarProcesso.util.modeloProcesso");

sap.sousa.CriarProcesso.util.Controller.extend("sap.sousa.CriarProcesso.view.Resumo", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf sap.sousa.CriarProcesso.Resumo
     */
	onInit: function() {
        this.getRouter().attachRoutePatternMatched(function(){
            var model = this.getView().getModel("Processo");
            if(model.getData().items.length == 0){
                model.initMockData();
            }
        }, this);
	},

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf sap.sousa.CriarProcesso.Resumo
     */
//	onBeforeRendering: function() {
//
//	},

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf sap.sousa.CriarProcesso.Resumo
     */
//	onAfterRendering: function() {
//
//	},

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf sap.sousa.CriarProcesso.Resumo
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

    _handleValueHelpClose : function (evt) {
        var oSelectedItem = evt.getParameter("selectedItem");
        if (oSelectedItem) {
            var codigo  = oSelectedItem.getDescription();
            var texto   = oSelectedItem.getTitle();
            var data = this.getView().getModel("Processo").getData();
            var n = this.inputId.indexOf('idArmador');
            if(n != -1){
                data.Armador = codigo;
                data.DescrArmador = texto;
            }
            else{
                data.Despachante = codigo;
                data.DescrDespachante = texto;
            }
            this.getView().getModel("Processo").updateBindings();
        }
        evt.getSource().getBinding("items").filter([]);
        if(oSelectedItem && oSelectedItem.getDescription()){
            this._setFornecedorBinding(oSelectedItem.getDescription());
        }
    },

    onFinalizar : function(oEvent){

        var data = this.getView().getModel("Processo").getData();
        var dadosCont = sap.ui.getCore().getModel("Contentores").getData();
        var oModel = this.getView().getModel();

        var batchChanges = [];
        for(var i = 0; i < dadosCont.contentores.length; i++){
            var c = dadosCont.contentores[i];
            c.processo = data.Processo;
            for(var j =0; j < dadosCont.contentores[i].items.length; j++){
                var obj = dadosCont.contentores[i].items[j];
                obj.Quantidade = String(obj.Quantidade);
            }
            batchChanges.push( oModel.createBatchOperation("ContentorSet", "POST", dadosCont.contentores[i]) );
        }
        oModel.addBatchChangeOperations(batchChanges);
        oModel.submitBatch(function(data){

        }, function(oError){
            sap.m.MessageToast.show("Erro na criação de contentores");
        });
        this._sendUpdate();
    },

    _sendUpdate : function(){
        var obj = {};
        var data = this.getView().getModel("Processo").getData();
        obj.ProcessoId = data.Processo;
        obj.Empresa = data.Empresa;
        obj.BL = data.BL;
        obj.Descritivo = data.Descritivo;
        obj.Armador = data.Armador;
        obj.Despachante = data.Despachante;
        obj.DtDoc = data.DtDocumentos;
        obj.ETA = data.ETA;
        obj.NavioPartida = data.NavioPartida;

        var oModel = this.getView().getModel();
        var path = "/ProcessoSet('" + obj.ProcessoId + "')";
        oModel.update(path, obj, null, function(oData){
            sap.m.MessageToast.show("Criado com sucesso");
        }, function(oError){
            sap.m.MessageToast.show("Erro na criação");
        });
        this.getRouter().navTo("main");
    }

    onNavBack : function(){
        window.history.go(-1);
    }
});