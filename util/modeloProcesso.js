jQuery.sap.declare('sap.sousa.CriarProcesso.util.modeloProcesso');

sap.ui.model.json.JSONModel.extend("sap.sousa.CriarProcesso.util.modeloProcesso", {

    addItem : function(oObject){

        var data = this.getData();
        data.items.push(oObject);
        data.total = data.items.length;
        this.refresh();
    },

    removeItem : function(oObject){

        var data = this.getData();
        var index = -1;
        for (var i=0 ; i < data.items.length ; i++)
        {
            if ((data.items[i]["PedidoID"] == oObject.PedidoID) &&
                (data.items[i]["ItemID"] == oObject.ItemID)) {
                index = i;
            }
        }
        if(index != -1){
            data.items.splice(index,1);
            data.total = data.items.length;
        }
        this.refresh();
    },

    setProcessoEmpresa : function(processo, empresa){
        var data = this.getData();
        data.Processo = processo;
        data.Empresa = empresa;
    },

    initMockData : function(){

        this.setProcessoEmpresa("14ND888","1000");
        var oObject = { PedidoID: "550002323", ItemID: "00010", Descritivo: "Item teste 1", Quantidade: 200, Unidade: "UN", Factura: "9232", Transf:"" };
        this.addItem(oObject);
        var oObject2 = { PedidoID: "550002323", ItemID: "00020", Descritivo: "Item teste 2", Quantidade: 300, Unidade: "UN", Factura: "9232", Transf:"" };
        this.addItem(oObject2);
    },

    recuperaItem : function(object){
        var data = this.getData();
        for(var i = 0; i < data.items.length; i++){
            if(object.PedidoID == data.items[i]["PedidoID"] && object.ItemID == data.items[i]["ItemID"]){
                var item = data.items[i];
                item.Quantidade = Number(item.Quantidade) + Number(object.Quantidade);
            }
        }
    }
})