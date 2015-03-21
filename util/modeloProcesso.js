jQuery.sap.declare('sap.sousa.CriarProcesso.util.modeloProcesso');

sap.ui.model.json.JSONModel.extend("sap.sousa.CriarProcesso.util.modeloProcesso", {

    addItem : function(oObject){

        var oModel = this;
        var data = oModel.getData();
        data.items.push(oObject);
        data.total = data.items.length;
        oModel.refresh();
    },

    removeItem : function(oObject){
        var oModel = this;
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
})