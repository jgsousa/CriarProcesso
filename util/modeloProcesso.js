jQuery.sap.declare('sap.sousa.CriarProcesso.util.modeloProcesso');

sap.sousa.CriarProcesso.util.modeloProcesso = {

    addItem : function(oObject, oController){

        var oModel = oController.getView().getModel("Processo");
        var data = oModel.getData();
        data.items.push(oObject);
        data.total = data.items.length;
        oModel.refresh();
    },

    removeItem : function(oObject, oController){
        var oModel = oController.getView().getModel("Processo");
        var data = oModel.getData();
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
        oModel.refresh();
    }
}