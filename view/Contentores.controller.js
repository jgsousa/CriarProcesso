jQuery.sap.require("sap.sousa.CriarProcesso.util.Controller");
jQuery.sap.require("sap.sousa.CriarProcesso.util.modeloContentores");
jQuery.sap.require("sap.sousa.CriarProcesso.util.modeloProcesso");

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
        //var table = this.getView().byId("Destino");
        //var oContext = model.getContextForMatricula("TESTE1");
        //if(oContext) {
        //    table.setBindingContext(oContext, "Contentores");
        //}
        //this.contentor = "TESTE1";
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
            { key:"-", text:"" },
            { key:"SC20", text:"SC20" } ,{ key:"SC40", text:"SC40" },
            { key:"RF20", text:"RF20" },{ key:"RF40", text:"RF40" }
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
        var data = this.getView().getModel("Criar").getData();
        data.matricula = "";
        data.tipo = "-";
        this.getView().getModel("Criar").updateBindings();
        // open value help dialog
        this._addDialog.open();
    },

    onCopyContentor : function(oEvent){
        var valido = this._validarCopia(this.contentor);
        if(valido == true) {
            if (!this._addDialogCopy) {
                this._addDialogCopy = sap.ui.xmlfragment(
                    "sap.sousa.CriarProcesso.view.Copiar",
                    this
                );
                this.getView().addDependent(this._addDialogCopy);
            }
            var data = this.getView().getModel("Criar").getData();
            data.matricula = "";
            data.tipo = "-";
            this.getView().getModel("Criar").updateBindings();
            // open value help dialog
            this._addDialogCopy.open();
        }
        else{
            sap.m.MessageToast.show("Quantidade insuficiente");
        }
    },

    onDialogOkButton: function (oEvent) {
        var model = this.getView().getModel("Criar");
        model.refresh();
        var data = this.getView().getModel("Criar").getData();
        if(data.tipo == "-"){
            sap.m.MessageToast.show("Escolher tipo");
            return;
        }
        if(!data.matricula){
            sap.m.MessageToast.show("Introduzir matricula");
            return;
        }
        this._addDialog.close();
        if(data.matricula && data.tipo){
            this.cModel.addContentor(data.matricula,data.tipo);
            this.cModel.updateBindings();
            if(!this.contentor){
                var context = this.getView().getModel("Contentores").getContextForMatricula(data.matricula);
                var table = this.getView().byId("Destino");
                table.setBindingContext(context, "Contentores");
                this.contentor = data.matricula;
            }
        }
    },

    onDialogCopiarOkButton: function (oEvent) {
        var model = this.getView().getModel("Criar");
        model.refresh();
        var data = model.getData();
        if(data.tipo == "-"){
            sap.m.MessageToast.show("Escolher tipo");
            return;
        }
        if(!data.matricula){
            sap.m.MessageToast.show("Introduzir matricula");
            return;
        }
        this._addDialogCopy.close();
        if(data.matricula && data.tipo){
            this.cModel.addContentor(data.matricula,data.tipo);
            this.cModel.updateBindings();
            if(!this.contentor){
                var context = this.getView().getModel("Contentores").getContextForMatricula(data.matricula);
                var table = this.getView().byId("Destino");
                table.setBindingContext(context, "Contentores");
                this.contentor = data.matricula;
            }
            else{
                var old = this.cModel.getForMatricula(this.contentor);
                var pModel = this.getView().getModel("Processo");
                pModel.efectuarCopia(old,data.matricula,this.cModel);
                this.cModel.updateBindings();
                this.getView().getModel("Processo").updateBindings();
            }
        }
    },

    onDialogCloseButton: function (oEvent) {
        this._addDialog.close();
    },

    onDialogCopiarCloseButton: function (oEvent) {
        this._addDialogCopy.close();
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

    onContentorSelect : function(oEvent){
        var matricula = oEvent.getParameter("selectedItem").getProperty("key");
        var context = this.getView().getModel("Contentores").getContextForMatricula(matricula);
        if(context){
            var table = this.getView().byId("Destino");
            table.setBindingContext(context, "Contentores");
            this.contentor = matricula;
        }
    },

    onTransferirDestino : function(oEvent){
        var oObject = oEvent.getSource().getBindingContext().getObject();

    },

    _validarCopia : function(matricula){
        var cont = this.cModel.getForMatricula(this.contentor);
        var model = this.getView().getModel("Processo");
        return model.checkCopia(cont);
    }

});